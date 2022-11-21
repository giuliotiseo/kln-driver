const aws = require('aws-sdk');
const crypto = require("crypto");
const helpers = require("./helpers");
const removeSpacesFromString = helpers.removeSpacesFromString;
const generateCompanyCode = helpers.generateCompanyCode;

const ddb = new aws.DynamoDB.DocumentClient();

const cognitoISP = new aws.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
});

/**
 * @type {import('@types/aws-lambda').PostConfirmationTriggerHandler}
*/
exports.handler = async (event, context, callback) => {
  let companyId, profileId;
  if (event.request.userAttributes.sub && event.request.userAttributes["custom:companyName"]) {
    let dateNow = (new Date()).toISOString();
    const vatNumber = event.request.userAttributes["custom:vatNumber"];
    const place_id = event.request.userAttributes["custom:companyPlaceId"];
    const profileFiscalCode = event.request.userAttributes["custom:profileFiscalCode"];

    const groupParams = {
      GroupName: process.env.GROUP,
      UserPoolId: event.userPoolId,
    };

    const addUserParams = {
      GroupName: process.env.GROUP,
      UserPoolId: event.userPoolId,
      Username: event.userName,
    };

    const raw_companyId = `${removeSpacesFromString(vatNumber.toUpperCase())}-${place_id}`;
    const raw_profileId = `${removeSpacesFromString(profileFiscalCode.toUpperCase())}-${removeSpacesFromString(vatNumber.toUpperCase())}`;

    // Creating the hash object in hex encoding
    companyId = crypto.createHash('sha256').update(raw_companyId).digest('hex');
    profileId = crypto.createHash('sha256').update(raw_profileId).digest('hex');

    // Controllo l'esistenza dell'azienda su DynamoDB e ne estraggo i dati in modo da sapere se dovrò creare anche l'azienda o no
    const companyQueryParams = {
      TableName: `${process.env.COMPANYTABLE}`,
      Key: { id: companyId }, 
    };

    try {
      ddb.get(companyQueryParams, async function(err, data) {
        if(err) {
          console.log('Errore nella ricerca dell\'azienda', err.stack);
          return null;
        } else {
          const result_companyId = (data && data.Item) ? data.Item.id : null;
          if(!result_companyId) {
            await createSuperAdminOp({
              ...event.request.userAttributes, companyId, profileId 
            }, dateNow);
          } else {
            console.log("Azienda già esistente");
          }
        }
      });
    } catch(err) {
      console.log("Errore durante la ricerca dell'azienda sul DynamoDB");
      return null;
    }

    // Aggiungo l'utente al gruppo 'subscribers'
    try {
      await cognitoISP.getGroup(groupParams).promise();
    } catch (e) {
      await cognitoISP.createGroup(groupParams).promise();
    }
    
    try {
      await cognitoISP.adminAddUserToGroup(addUserParams).promise();
      callback(null, event);
    } catch (error) {
      callback(error);
    }
  } 

  return {...event, response: { companyId, profileId }};
};


// Create admin: profile + company
async function createSuperAdminOp(attributes, dateNow) {
  // const task = attributes["custom:profileRoleId"].split("#")[0];
  const companyParams = {
    Item: {
      __typename: 'Company',
      id: attributes.companyId,
      tag: attributes.companyId,
      companyCode: generateCompanyCode(attributes["custom:companyName"]),
      vatNumber: attributes["custom:vatNumber"],
      name: attributes["custom:companyName"],
      city: attributes["custom:companyCity"],
      address: attributes["custom:companyAddress"],
      location: {
        city: attributes["custom:companyCity"],
        address: attributes["custom:companyAddress"],
        place_id: attributes["custom:companyPlaceId"],
      },
      type: attributes["custom:companyType"],
      phones: [{ name:"default", value: attributes["custom:companyPhone"]}],
      emails: [{ name: "default", value: attributes["custom:companyEmail"] }],
      fiscalCode: attributes["custom:companyFiscalCode"],
      createdAt: dateNow,
      updatedAt: dateNow,
      owner: attributes.sub
    },
    TableName: `${process.env.COMPANYTABLE}`
  }

  const profileParams = {
    Item: {
      __typename:'Profile',
      id: attributes.profileId,
      username: attributes.email,
      name: attributes["custom:profileName"],
      surname:attributes["custom:profileSurname"],
      email: attributes.email,
      searchable: `${attributes["custom:profileName"].toLowerCase()} ${attributes["custom:profileSurname"].toLowerCase()}`,
      createdAt: dateNow ,
      updatedAt: dateNow,
      tenant: attributes.companyId,
      fiscalCode: attributes["custom:profileFiscalCode"],
      refreshTokens:  [], 
      roleIds: attributes["custom:profileRoleId"]
        .split(",")
        .filter((item, index, inputArray) => inputArray.indexOf(item) == index), 
      owner: attributes.sub
    },
    TableName: `${process.env.PROFILETABLE}`
  }

  // Create profile operation
  try {
    await ddb.put(profileParams).promise();
    console.log('Profilo creato con successo');
  } catch(err) {
    console.log('Errore durante la creazione dell\'utente (profile)', err);
  }

  // Create company operation
  try {
    await ddb.put(companyParams).promise();
    console.log('Azienda creata con successo');
  } catch(err) {
    // Rollback: Elimina profilo
    const deleteProfileParams = {
      Key: { id: attributes.sub },
      TableName: `${process.env.COMPANYTABLE}`,
    }

    await ddb.delete(deleteProfileParams).promise();

    console.log('Errore durante la creazione dell\'utente (company)', err);
  }
}