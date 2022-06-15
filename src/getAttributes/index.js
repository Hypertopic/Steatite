const AWS = require("aws-sdk");
const DynamoDB = new AWS.DynamoDB();

const tableName = "picture";

let response = {
  statusCode: 200,
  headers: { "Content-Type": "application/json" },
  body: "",
};

exports.handler = async (event) => {
  // 1. Parse out query string parameters

  const apiUrl = 'https://' + event['headers']['Host'] + '/' + event['requestContext']['stage'] + "/"
  const imageEtag = event["pathParameters"]["hash"];
  const imageCorpus = event["pathParameters"]["corpus"];

  // 2. Get the information from DynamoDB
  let paramsGetItem = {
    TableName: tableName,
    Key: {
      hash: {
        S: imageEtag,
      },
    },
  };

  await DynamoDB.getItem(paramsGetItem, (err, data) => {
    if (err) {
      console.log("[ERROR : getItem] :", err, err.stack); // an error occurred
      response.statusCode = 404;
      response.body = "Picture with hash " + imageEtag + " not found";
      return response;
    } else {
      if (Object.keys(data).length === 0) {
        response.statusCode = 404;
        response.body = "Picture with hash " + imageEtag + " not found";

        return response;
      }
      if (data["Item"]["corpus"]["S"] !== imageCorpus) {
        response.statusCode = 404;
        response.body = "Picture with corpus " + imageCorpus + " not found";

        return response;
      }

      const baseUrlAWS = data["Item"]["baseUrlAWS"]["S"]
      const name = data["Item"]["name"]["S"]



      const responseTable = [];
      let addedValue = {};

      for (var attribute in data["Item"]) {
        if (attribute !== "hash") {
          addedValue[attribute] = data["Item"][attribute]["S"];
        }
      }

      addedValue['response'] = baseUrlAWS + imageCorpus + "/" + name
      addedValue['optimized'] = apiUrl + "optimized/" + imageEtag
      addedValue['thumbnail'] = apiUrl + "thumbnail/" + imageEtag


      let added = { key: [imageCorpus, imageEtag], value: addedValue };
      responseTable.push(added);

      response.body = JSON.stringify({ rows: responseTable }, null, 2);
    }
  }).promise();

  return response;
};
