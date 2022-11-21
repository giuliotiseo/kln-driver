const aws = require('aws-sdk');
const ddb = new aws.DynamoDB({
  region: 'eu-central-1'
});

async function listProfiles(companyId) {
  let results = [];
  console.log("Effettuo la ricerca su tenant", companyId);

  // Controllo l'esistenza dell'azienda su DynamoDB e ne estraggo i dati in modo da sapere se dovrò creare anche l'azienda o no
  const profilesQueryParams = {
    TableName: `${process.env.PROFILETABLE}`,
    IndexName: "profileByTenant",
    ProjectionExpression: "id, tenant, username, refreshTokens, roleIds",
    KeyConditionExpression: "tenant = :v1",
    ExpressionAttributeValues: { ":v1": {"S": companyId } },
    ReturnConsumedCapacity: "TOTAL"
  };

  try {
    const raw_results = await ddb.query(profilesQueryParams).promise();
    if(!raw_results) {
      throw error("Error while retriving profiles data", profilesQueryParams);
    }

    console.log("Vedi rawResults", raw_results);
    results = raw_results ? raw_results?.Items : [];
  } catch(err) {
    console.log("Errore durante la ricerca dei profili sul DynamoDB", err);
  }

  return results?.length > 0
    ? results.map(profile => ({
      id: profile.id.S,
      username: profile.username.S,
      tenant: profile.tenant.S,
      refreshTokens: profile?.refreshTokens?.L 
        ? profile.refreshTokens.L.map(refreshToken => refreshToken.S)
        : [],
      roleIds: profile?.roleIds?.L 
        ? profile.roleIds.L.map(refreshToken => parseInt(refreshToken.N))
        : [],
      }))
    : [];
}

async function getProfile(profileId) {
  let results;

  // Controllo l'esistenza dell'azienda su DynamoDB e ne estraggo i dati in modo da sapere se dovrò creare anche l'azienda o no
  const profileQueryParams = {
    TableName: `${process.env.PROFILETABLE}`,
    Key: { 'id': { S: profileId }},
    ProjectionExpression: "id, tenant, username, psw, roleIds, refreshTokens",
  };

  console.log("getProfile profileId", profileId);

  try {
    const raw_result = await ddb.getItem(profileQueryParams).promise();
    console.log("getProfile raw_result", raw_result);
    if(!raw_result) {
      throw error("Error while retriving profiles data", profileQueryParams);
    }
    results = raw_result ? {
      id: raw_result.Item.id.S,
      psw: raw_result.Item.psw.S,
      roleIds: raw_result.Item.roleIds.L,
      refreshTokens: raw_result?.Item?.refreshTokens?.L?.map(el => el?.S) || [],
    } : null;
  } catch(err) {
    console.log("Errore durante la ricerca del profilo sul DynamoDB", err);
  }

  return results;
}

async function createProfile({
  id,
  email,
  psw,
  name,
  surname,
  phone,
  companyId,
  roleIds,
  owner,
}) {
  let results = null;
  const dateNow = (new Date()).toISOString();
  const profileParams = {
    TableName: `${process.env.PROFILETABLE}`,
    Item: {
      '__typename': { S: 'Profile' },
      'id': { S: id },
      'username': { S: email },
      'psw': { S: psw } ,
      'name': { S: name },
      'surname': { S: surname },
      'email': { S: email },
      'searchable': { S: `${name.toLowerCase()} ${surname.toLowerCase()}`},
      'phone': { S: phone },
      'createdAt': { S: dateNow },
      'updatedAt': { S: dateNow },
      'tenant': {S: companyId },
      'roleIds': { L: roleIds.map(role => ({ N: role })) },
      'fiscalCode': { S: "EMPTY" },
      'owner': { S: owner }
    }
  }

  // Create profile operation
  try {
    await ddb.putItem(profileParams).promise();
    results = profileParams;
  } catch(err) {
    console.log('Errore durante la creazione del profilo', err);
    throw error("Error during profile creation");
  }

  return results;
}

async function updateRefreshToken({
  id,
  // token,
  refreshTokens,
}) {
  let result;
  console.log("Controlla i refresh tokens", refreshTokens);

  const profileParams = {
    TableName: `${process.env.PROFILETABLE}`,
    Key: { 'id': { S: id }},
    UpdateExpression: "set refreshTokens = :val1",
    // ExpressionAttributeValues: { ":val1": {"S": token }},
    ExpressionAttributeValues: { ":val1": { L: refreshTokens.map(rt => ({ S: rt })) }},
    ReturnValues: "ALL_NEW"
  }

  // update profile operation
  try {
    result = await ddb.updateItem(profileParams).promise();
    console.log("Risultato aggiornamento refreshtoken", result);
  } catch(err) {
    console.log('Errore durante l\'aggiornamento del refresh token', err);
    throw error("Error during profile creation");
  }

  return result;
}

async function updatePassword({
  id,
  psw
}) {
  let result;
  const profileParams = {
    TableName: `${process.env.PROFILETABLE}`,
    Key: { 'id': { S: id }},
    UpdateExpression: "set psw = :val1",
    ExpressionAttributeValues: { ":val1": {"S": psw }},
    ReturnValues: "ALL_NEW"
  }

  // update profile operation
  try {
    result = await ddb.updateItem(profileParams).promise();
    console.log("Risultato aggiornamento della password", result);
  } catch(err) {
    console.log('Errore durante l\'aggiornamento della password', err);
    throw error("Error during profile update");
  }

  return result;
}

module.exports = {
  get: getProfile,
  list: listProfiles,
  create: createProfile,
  updateRefreshToken,
  updatePsw: updatePassword, 
}