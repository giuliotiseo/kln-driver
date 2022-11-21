/* Amplify Params - DO NOT EDIT
	API_LTSGRAPHQL_GRAPHQLAPIENDPOINTOUTPUT
	API_LTSGRAPHQL_GRAPHQLAPIIDOUTPUT
	AUTH_LTSF4F53B30_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

var AWS = require("aws-sdk");
var ses = new AWS.SES({apiVersion: '2010-12-01'});

exports.handler = async (event) => {
  var body = JSON.parse(event.body);

  var params = {
    Destination: {
      ToAddresses: [body.email],
    },
    Message: {
      Body: {
        Text: { Data: `${body.senderName} ti ha invitato ad iscriverti al servizio LTS. Puoi trovare il modulo precompilato cliccando su questo link: ${body.url}` },
      },

      Subject: { Data: "Invito iscrizione a LTS" },
    },
    Source: "info@flussodigitale.it",
  };
  
  await sendMessage(params);

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    body: event.body,
  };
  
  return response;
};


async function sendMessage(params) {
  await ses.sendEmail(params).promise();
}