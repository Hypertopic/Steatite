// dependencies
const AWS = require("aws-sdk");
const sharp = require("sharp");
const { Buffer } = require("node:buffer");

const DynamoDB = new AWS.DynamoDB();
const S3 = new AWS.S3();
const tableName = "picture";
const sourceBucketName = "pe22";

exports.handler = async (event) => {
  
  let response = {
    statusCode: 200,
    headers: { "Content-Type": "image/jpeg" },
    isBase64Encoded: true,
    body : ""
  }

  const imageHash = event["pathParameters"]["hash"];
  const keyOptimizedImage = "Optimized/" + imageHash + ".jpeg";

  const paramsGetItem = {
    TableName: tableName,
    Key: {
      hash: {
        S: imageHash,
      },
    },
  };
  try {
    const dynamoDBItem = await DynamoDB.getItem(paramsGetItem).promise();

    let optimizedImage = dynamoDBItem["Item"]["optimized"]["S"];
    let optimizedImageName = dynamoDBItem["Item"]["name"]["S"];
    let optimizedImageCorpus = dynamoDBItem["Item"]["corpus"]["S"];
    let optimizedBaseUrlAWS = dynamoDBItem["Item"]["baseUrlAWS"]["S"];

    if (optimizedImage.length <= 0) {
      const paramsGetObjectInCorpus = {
        Bucket: sourceBucketName,
        Key: optimizedImageCorpus + "/" + optimizedImageName,
      };

      // Get object in corpus folder
      const miscImage = await S3.getObject(paramsGetObjectInCorpus).promise();

      // Optimize the image
      var sharpedImage = await sharp(miscImage.Body)
        .toFormat("jpeg", { mozjpeg: true })
        .toBuffer();

      const destparams = {
        Bucket: sourceBucketName,
        Key: keyOptimizedImage,
        Body: sharpedImage,
        ContentType: "image/jpeg",
        StorageClass: "REDUCED_REDUNDANCY",
      };

      // Add object in the Optimized folder
      await S3.putObject(destparams).promise();

      // Setting up the parameters in order to update the DynamoDB line
      const paramsUpdateItems = {
        ExpressionAttributeNames: {
          "#OPT": "optimized",
        },
        ExpressionAttributeValues: {
          ":opt": {
            S: optimizedBaseUrlAWS + keyOptimizedImage,
          },
        },
        Key: {
          hash: {
            S: imageHash,
          },
        },
        ReturnValues: "ALL_NEW",
        TableName: tableName,
        UpdateExpression: "SET #OPT = :opt",
      };

      await DynamoDB.updateItem(paramsUpdateItems).promise();

      response.body = sharpedImage.toString("base64")

    } else {
      const paramsGetObjectInOptimized = {
        Bucket: sourceBucketName,
        Key: keyOptimizedImage,
      };

      const optimizedImage = await S3.getObject(
        paramsGetObjectInOptimized
      ).promise();

      let image = Buffer.from(optimizedImage.Body, "binary");

      response.body = image.toString("base64")
    }
  } catch (err) {
    console.log(err);

    response = {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: err }, null, 2),
    };
  }

  return response;
};
