/* Amplify Params - DO NOT EDIT
	API_LTSGRAPHQL_GRAPHQLAPIENDPOINTOUTPUT
	API_LTSGRAPHQL_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import crypto from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { default as fetch, Request } from 'node-fetch';

const { Sha256 } = crypto;
const GRAPHQL_ENDPOINT = process.env.API_LTSGRAPHQL_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.AWS_REGION || 'eu-central-1';

const queryWithoutSender = /* GraphQL */ `
  query OrderByCarrierStatusCompletedAt(
    $carrierId: ID
    $start: String
    $end: String
    $sortDirection: ModelSortDirection
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    orderByCarrierStatusCompletedAt(
      carrierId: $carrierId
      statusCompletedAt: {
        between: [{
          status: DELIVERED,
          completedAt: $start
        }, {
          status: DELIVERED,
          completedAt: $end
        }]
      }
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        extId
        stamp
        name
        preOrderId
        carrierId
        receiverId
        senderId
        pickupStorageId
        deliveryStorageId
        carrierName
        senderName
        receiverName
        pickupStorageName
        deliveryStorageName
        senderVat
        carrierVat
        receiverVat
        pickupStorageVat
        deliveryStorageVat
        completedAt
        paymentCondition
        shipmentType
        billingType
        pickupCheckpoint { extId name thirdCompanyId thirdCompanyName thirdCompanyVat location { place_id region province city address coordinate }}
        pickupDateStart
        pickupDateEnd
        depotCheckpoint { extId name thirdCompanyId thirdCompanyName thirdCompanyVat location { place_id region province city address coordinate }}
        depotDateStart
        depotDateEnd
        deliveryCheckpoint { extId name  thirdCompanyId thirdCompanyName thirdCompanyVat location { place_id region province city address coordinate }}
        deliveryDateStart
        deliveryDateEnd
        status
        orderNumber
        docs { date number type }
        support
        quantity
        size
        loadingMeter
        grossWeight
        netWeight
        packages
        customer { id name vatNumber uniqueCode pec }
        palletInfo { value size type system }
        collectChecks
        checks { items { id orderId amount carrierId senderId receiverId carrierName senderName receiverName }}
        travels {
          items {
            id departureDate arrivalDate carrierId customerId operation operationValue
            waypoint {
              companyName companyId estimatedLength estimatedTime
              checkpoint { extId name  thirdCompanyId thirdCompanyName thirdCompanyVat location { place_id region province city address coordinate }}
            }
            travel {
              id
              stamp
              departureDate
              licensePlate
              vehicleName
              driverName
              start {
                companyName estimatedLength estimatedTime
                checkpoint { extId name  thirdCompanyId thirdCompanyName thirdCompanyVat location { place_id region province city address coordinate }}
              }
              end {
                companyName estimatedLength estimatedTime
                checkpoint { extId name thirdCompanyId thirdCompanyName thirdCompanyVat location { place_id region province city address coordinate }}
              }
              estimatedTravelTime
              estimatedTravelLength
              estimatedTransportCosts
              status
            }
          }
        }
      }
      nextToken
    }
  }
`;

const queryWithSender = /* GraphQL */ `
  query OrderByCarrierStatusSenderVatCompletedAt(
    $carrierId: ID
    $senderVat: String
    $start: String
    $end: String
    $sortDirection: ModelSortDirection
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    orderByCarrierStatusSenderVatCompletedAt(
      carrierId: $carrierId
      statusSenderVatCompletedAt: {
        between: [{
          status: DELIVERED,
          senderVat: $senderVat,
          completedAt: $start
        }, {
          status: DELIVERED,
          senderVat: $senderVat,
          completedAt: $end
        }]
      }
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        extId
        stamp
        name
        preOrderId
        carrierId
        receiverId
        senderId
        pickupStorageId
        deliveryStorageId
        carrierName
        senderName
        receiverName
        pickupStorageName
        deliveryStorageName
        senderVat
        carrierVat
        receiverVat
        pickupStorageVat
        deliveryStorageVat
        completedAt
        paymentCondition
        shipmentType
        billingType
        pickupCheckpoint { extId name thirdCompanyId thirdCompanyName thirdCompanyVat location { place_id region province city address coordinate }}
        pickupDateStart
        pickupDateEnd
        depotCheckpoint { extId name thirdCompanyId thirdCompanyName thirdCompanyVat location { place_id region province city address coordinate }}
        depotDateStart
        depotDateEnd
        deliveryCheckpoint { extId name  thirdCompanyId thirdCompanyName thirdCompanyVat location { place_id region province city address coordinate }}
        deliveryDateStart
        deliveryDateEnd
        status
        orderNumber
        docs { date number type }
        support
        quantity
        size
        loadingMeter
        grossWeight
        netWeight
        packages
        customer { id name vatNumber uniqueCode pec }
        palletInfo { value size type system }
        travels {
          items {
            id departureDate arrivalDate carrierId customerId operation operationValue
            waypoint {
              companyName companyId estimatedLength estimatedTime
              checkpoint { extId name  thirdCompanyId thirdCompanyName thirdCompanyVat location { place_id region province city address coordinate }}
            }
            travel {
              id
              stamp
              departureDate
              licensePlate
              vehicleName
              driverName
              start {
                companyName estimatedLength estimatedTime
                checkpoint { extId name  thirdCompanyId thirdCompanyName thirdCompanyVat location { place_id region province city address coordinate }}
              }
              end {
                companyName estimatedLength estimatedTime
                checkpoint { extId name  thirdCompanyId thirdCompanyName thirdCompanyVat location { place_id region province city address coordinate }}
              }
              estimatedTravelTime
              estimatedTravelLength
              estimatedTransportCosts
              status
            }
          }
        }
      }
      nextToken
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const bodyVariables = JSON.parse(event.body);
  const endpoint = new URL(GRAPHQL_ENDPOINT);

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: AWS_REGION,
    service: 'appsync',
    sha256: Sha256
  });

  console.log("Body variables", bodyVariables);

  let query = queryWithoutSender;
  let variables = {
    carrierId: bodyVariables.id,
    sortDirection: bodyVariables?.sortDirection || "DESC",
    start: new Date(bodyVariables?.start).toISOString(),
    end: new Date(bodyVariables?.end).toISOString(),
    nextToken: bodyVariables?.nextToken || undefined,
    limit: bodyVariables?.limit || 999
  }

  if(bodyVariables?.senderVat) {
    variables = {
      ...variables,
      senderVat: bodyVariables?.senderVat
    }

    query = queryWithSender;
  }
  
  console.log("Variables", variables);

  const requestToBeSigned = new HttpRequest({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      host: endpoint.host
    },
    hostname: endpoint.host,
    body: JSON.stringify({ query, variables }),
    path: endpoint.pathname
  });

  const signed = await signer.sign(requestToBeSigned);
  const request = new Request(endpoint, signed);

  let statusCode = 200;
  let body;
  let response;

  try {
    console.log("Request", request);
    response = await fetch(request);
    body = await response.json();
    console.log("Body", body);
    if (body.errors) statusCode = 400;
  } catch (error) {
    statusCode = 500;
    body = {
      errors: [
        {
          message: error.message
        }
      ]
    };
  }

  return {
    statusCode,
    //  Uncomment below to enable CORS requests
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    }, 
    body: JSON.stringify(body),
  };
};
