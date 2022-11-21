const aws = require('aws-sdk');
const docClient = new aws.DynamoDB.DocumentClient({ region: 'eu-central-1' });

let params = { TableName: `${process.env.PROFILETABLE}`}

// Methods
docClient.get(params, function (err, data) {
  if (err) console.log(err)
  else console.log(data)
})

docClient.query(params, function (err, data) {
  if (err) console.log(err)
  else console.log(data)
})


docClient.put(params, function (err, data) {
  if (err) console.log(err)
  else console.log(data)
})

docClient.update(params, function (err, data) {
  if (err) console.log(err)
  else console.log(data)
})


// Async functions abstractions
async function listProfiles(companyId) {
  params = {
    TableName: `${process.env.PROFILETABLE}`,
    IndexName: "profileByTenant",
    ProjectionExpression: "id, tenant, username, refreshTokens, roleIds",
    KeyConditionExpression: "tenant = :v1",
    ExpressionAttributeValues: { ":v1": companyId },
    ReturnConsumedCapacity: "TOTAL"
  }

  try {
    const data = await docClient.query(params).promise();

    console.log("listProfiles data", data);

    return data?.Items?.length > 0
      ? data.Items.map(profile => ({
        id: profile.id,
        username: profile.username,
        tenant: profile.tenant,
        refreshTokens: profile?.refreshTokens 
          ? profile.refreshTokens
          : [],
        roleIds: profile?.roleIds?.length > 0
          ? profile.roleIds.map(refreshToken => parseInt(refreshToken))
          : [],
        }))
      : [];
  } catch (err) {
    return err
  }
}


async function getProfile(profileId) {
  // Controllo l'esistenza dell'azienda su DynamoDB e ne estraggo i dati in modo da sapere se dovrò creare anche l'azienda o no
  params = {
    TableName: `${process.env.PROFILETABLE}`,
    Key: { id: profileId },
    ProjectionExpression: "id, tenant, username, psw, roleIds, refreshTokens",
  };

  console.log("getProfile profileId", profileId);


  try {
    const data = await docClient.get(params).promise();

    console.log("getProfile data", data);

    return data?.Item ? { ...data.Item } : {}
  } catch (err) {
    return err
  }
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
  dateNow = (new Date()).toISOString();
  params = {
    TableName: `${process.env.PROFILETABLE}`,
    Item: {
      __typename: 'Profile',
      id,
      username: email,
      psw,
      name,
      surname,
      email,
      searchable: `${name.toLowerCase()} ${surname.toLowerCase()}`,
      phone,
      createdAt: dateNow,
      updatedAt: dateNow,
      tenant: companyId,
      roleIds: roleIds.map(role => parseInt(role)),
      fiscalCode: "EMPTY",
      owner: owner
    }
  }

    try {
      const data = await docClient.put(params).promise();
      return data;
    } catch (err) {
      return err
    }
}

async function updateRefreshToken({
  id,
  refreshTokens,
}) {
  console.log("Controlla i refresh tokens", refreshTokens);

  params = {
    TableName: `${process.env.PROFILETABLE}`,
    Key: { id },
    UpdateExpression: "set refreshTokens = :val1",
    ExpressionAttributeValues: { ":val1": refreshTokens },
    ReturnValues: "ALL_NEW"
  }

  // update profile operation
  try {
    const data = await docClient.update(params).promise();
    return data;
  } catch (err) {
    return err
  }
}

async function updatePassword({
  id,
  psw
}) {
  params = {
    TableName: `${process.env.PROFILETABLE}`,
    Key: { id },
    UpdateExpression: "set psw = :val1",
    ExpressionAttributeValues: { ":val1": psw },
    ReturnValues: "ALL_NEW"
  }

  // update profile operation
  try {
    const data = await docClient.update(params).promise();
    return data;
  } catch (err) {
    return err
  }
}

module.exports = {
  get: getProfile,
  list: listProfiles,
  create: createProfile,
  updateRefreshToken,
  updatePsw: updatePassword, 
}