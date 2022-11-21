var AWS = require("aws-sdk");
var ses = new AWS.SES({ apiVersion: '2010-12-01' });

async function sendEmail(inputParams) {
  var params = {
    Destination: {
      ToAddresses: [inputParams.email],
    },
    Message: {
      Body: {
        Text: { Data: `La nuova password per accedere al tuo profilo LTS è ${inputParams.psw}. Una volta effettuato il login, potrai cambiarla nuovamente.` },
      },

      Subject: { Data: "Reimpostazione password profilo LTS" },
    },
    Source: "info@flussodigitale.it",
  };
  

  await ses.sendEmail(params).promise();
}

module.exports = {
  send: sendEmail
}