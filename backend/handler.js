'use strict';
const AWS = require('aws-sdk')
const Schema = require('js/schema.js')
const Filter = require('js/filter.js')

let schema = new Schema();
let filter = new Filter();

function corsHeaders(event) {
  let allowedHosts = ["http://localhost:3000", "http://localhost:5500", "https://mwolfeu.github.io"];
  let eho = event.headers.origin;
  if (allowedHosts.includes(eho))
    return {
      "Access-Control-Allow-Origin": eho,
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE"
    }
  return {}
}

module.exports = {

  hello: async(event) => {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Ping Successful',
        input: event,
      }),
    };
  },

  byRegion: async(event) => {
    return {
      statusCode: 200,
      headers: corsHeaders(event),
      body: JSON.stringify(filter.regionAggregates())
    };
  },

  create: async(event, context) => {

    let bodyObj = {}
    try {
      bodyObj = JSON.parse(event.body);
      // if you keep pk you replace the contents
      if (event.path != "/v1/incident" || (event.path == "/v1/incident" && !('pk' in bodyObj.data))) {
        bodyObj.data.pk = Date.now();
      }
      // Use admin 'status' if specified
      if (event.path != "/v1/incident") {
        bodyObj.data.status = 'unreviewed'; // unreviewed == survey new, reviewed == adm updated
      }
    } catch (jsonError) {
      console.log('There was an error parsing the body', jsonError)
      return {
        statusCode: 460
      }
    }

    if (!bodyObj.lang) {
      console.log('Language not set');
      return { statusCode: 461 }
    }

    if (!(['en', 'ur'].includes(bodyObj.lang))) {
      console.log('Language incorrect: ', bodyObj.lang);
      return { statusCode: 462 }
    }
    let lang = bodyObj.lang;

    let rv = schema.encode(bodyObj.data, lang);
    let putParams;
    if (rv.valid) {

      putParams = {
        TableName: process.env.DYNAMODB_INCIDENT_TABLE,
        Item: bodyObj.data
      }

    } else {
      console.log(JSON.stringify(rv));
      return {
        statusCode: 400, // failed schema validation
      }
    }

    let putResult = {}
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient()
      putResult = await dynamodb.put(putParams).promise()
    } catch (error) {
      console.log('Error: lambda create')
      console.log('putParams', putParams)
      return {
        statusCode: 500,
        // body: JSON.stringify([event, context, putParams, error])
      }
    }

    return {
      statusCode: 201,
      headers: corsHeaders(event)
        //body: JSON.stringify([event, context])
    }
  },

  list: async(event, context) => {
    let scanParams = {
      TableName: process.env.DYNAMODB_INCIDENT_TABLE
    }
    let scanResult = {}
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient()
      scanResult = await dynamodb.scan(scanParams).promise()
      if (scanResult.Items)
        scanResult.Items.forEach(d => schema.decode(d, 'en'));
    } catch (scanError) {
      console.log('Error: lambda scan')
      console.log('scanError', scanError)
      return {
        statusCode: 500
      }
    }

    if (scanResult.Items == null ||
      !Array.isArray(scanResult.Items) ||
      scanResult.Items.length == 0) {
      return {
        statusCode: 404
      }
    }
    return {
      statusCode: 200,
      headers: corsHeaders(event),
      body: JSON.stringify(scanResult)
    }
  },

  // LIST INSTEAD UNLESS THEY DECIDE TO DO ANALYTICS
  // get: async(event, context) => {
  //   let getParams = {
  //     TableName: process.env.DYNAMODB_INCIDENT_TABLE,
  //     Key: {
  //       name: event.pathParameters.name
  //     }
  //   }
  //   let getResult = {}
  //   try {
  //     let dynamodb = new AWS.DynamoDB.DocumentClient()
  //     getResult = await dynamodb.get(getParams).promise()
  //   } catch (getError) {
  //     console.log('Error: lambda get')
  //     console.log('getError', getError)
  //     return {
  //       statusCode: 500
  //     }
  //   }

  //   if (getResult.Item == null) {
  //     return {
  //       statusCode: 404
  //     }
  //   }

  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify(getResult)
  //   }
  // },

  // REPLACE ROW INSTEAD
  // update: async(event, context) => {
  //   let bodyObj = {}
  //   try {
  //     bodyObj = JSON.parse(event.body)
  //   } catch (jsonError) {
  //     console.log('There was an error parsing the body', jsonError)
  //     return {
  //       statusCode: 460
  //     }
  //   }

  //   // binarify here
  //   // if (typeof bodyObj.age == 'undefined') {
  //   //   console.log('Missing parameters')
  //   //   return {
  //   //     statusCode: 400
  //   //   }
  //   // }

  //   let updateParams = {
  //     TableName: process.env.DYNAMODB_INCIDENT_TABLE,
  //     Key: {
  //       pk: parseInt(event.pathParameters.pk)
  //     },
  //     UpdateExpression: 'set #ln = :ln',
  //     ExpressionAttributeNames: {
  //       '#ln': 'last_name'
  //     },
  //     ExpressionAttributeValues: {
  //       ':ln': bodyObj.data.last_name
  //     }
  //   }

  //   try {
  //     let dynamodb = new AWS.DynamoDB.DocumentClient();
  //     await dynamodb.update(updateParams).promise();
  //   } catch (updateError) {
  //     console.log('Error: lambda update')
  //     console.log('updateError', updateError)
  //     return {
  //       statusCode: 500,
  //       body: JSON.stringify(updateError)
  //     }
  //   }

  //   return {
  //     statusCode: 200
  //   }
  // },

  delete: async(event, context) => {
    let deleteParams = {
      TableName: process.env.DYNAMODB_INCIDENT_TABLE,
      Key: {
        pk: parseInt(event.pathParameters.pk)
      }
    }

    let deleteResult = {}
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient()
      deleteResult = await dynamodb.delete(deleteParams).promise()
    } catch (deleteError) {
      console.log('Error: lambda delete')
      console.log('deleteError', deleteError)
      return { statusCode: 500 }
    }

    return {
      statusCode: 200,
      headers: corsHeaders(event),
    }
  }
}