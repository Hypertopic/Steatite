const AWS = require("aws-sdk");
const S3 = new AWS.S3();
var DynamoDB = new AWS.DynamoDB();
const tableName = "picture";
let responseObject = {};

exports.handler= async (event, context) => {
   // 1. Parse out query string parameters
   console.log("event : ",event)
   console.log("context : ",context)
   const imageEtag = event['pathParameters']['hash']
   const imageCorpus = event['pathParameters']['corpus']

   
   console.log("********** imageEtag **********");
   console.log(imageEtag);
   
   // 2. Get the information from DynamoDB
   let paramsGetItem = {
      TableName: tableName,
      Key: {
      "hash" : {
         "S" : imageEtag
      }
      }
   };
   
   let result = await DynamoDB.getItem(paramsGetItem, (err, data) => {
      if (err) {
         console.log("[ERROR : getItem] :",err, err.stack); // an error occurred
         responseObject['statusCode'] = 404
         responseObject['headers'] = {}
         responseObject['headers']['Content-Type'] = 'application/json'
         responseObject['body'] = "Picture with hash "+imageEtag+" not found"
         
         return responseObject
    }
    else {
         console.log("********** imageInfo **********");
         // console.log(imageInfo)
         console.log(data);
         if (Object.keys(data).length === 0) {
            responseObject['statusCode'] = 404
            responseObject['headers'] = {}
            responseObject['headers']['Content-Type'] = 'application/json'
            responseObject['body'] = "Picture with hash "+imageEtag+" not found"
         
            return responseObject
         } 
         if (data['Item']['corpus']['S'] !== imageCorpus) {
             responseObject['statusCode'] = 404
            responseObject['headers'] = {}
            responseObject['headers']['Content-Type'] = 'application/json'
            responseObject['body'] = "Picture with corpus "+imageCorpus+" not found"
         
            return responseObject
         }
         // Construct the body of the response object
         let imageResponse = {}
         imageResponse['hash'] = imageEtag;
         imageResponse['resource'] = data['Item']['resource']
         
         const uriImage = data['Item']['resource']['S']
         console.log(uriImage)

         const responseTable = []
         let addedValue = {}
         
         for(var attribute in data['Item']){
            addedValue[attribute] = data['Item'][attribute]['S']
         }
         
         let corpus=data['Item']['corpus']['S']
         let added={"key":[corpus, imageEtag], "value" : addedValue}
         responseTable.push(added)
         
         console.log("response table : ",responseTable)
         
           
         // 4. Construct http repsonse object
         responseObject['statusCode'] = 200
         responseObject['headers'] = {}
         responseObject['headers']['Content-Type'] = 'application/json'
         responseObject['body'] = JSON.stringify({'rows': responseTable}, null, 2)
         //responseObject['body'] = JSON.stringify({'hello': 'world'})

         //5. Return the response object
         console.log("****** response *******")
         console.log(responseObject)
         //return responseObject;
         return responseObject
       
    }
   }).promise();
   
   return responseObject;
};