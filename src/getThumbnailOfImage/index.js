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
  const keyThumbnailImage = "Thumbnail/" + imageHash + ".jpeg";

  const paramsGetItem = {
    TableName: tableName,
    Key: {
      hash: {
        S: imageHash,
      },
    },
  };

  const paramsGetObjectInThumbnail = {
    Bucket: sourceBucketName,
    Key: keyThumbnailImage,
  };

  try {

    const thumbnailImage = await S3.getObject(
      paramsGetObjectInThumbnail
    ).promise();

    let image = Buffer.from(thumbnailImage.Body, "binary");

    response.body = image.toString("base64")
  } catch (err) {
    if (err.code === "NoSuchKey") 
    {

      const dynamoDBItem = await DynamoDB.getItem(paramsGetItem).promise();

      if (Object.keys(dynamoDBItem).length > 0) { // The object isn't generated in the Optimized folder.
        
        let thumbnailImageName = dynamoDBItem["Item"]["name"]["S"];
        let thumbnailImageCorpus = dynamoDBItem["Item"]["corpus"]["S"];

        const paramsGetObjectInCorpus = {
          Bucket: sourceBucketName,
          Key: thumbnailImageCorpus + "/" + thumbnailImageName,
        };
  
        // Get object in corpus folder
        const miscImage = await S3.getObject(paramsGetObjectInCorpus).promise();
    
        const height = 100;

        // Optimize the image
        const buffer = await sharp(miscImage.Body)
          .resize(height)
          .toFormat("jpeg", { mozjpeg: true })
          .toBuffer();
        
        const destparams = {
          Bucket: sourceBucketName,
          Key: keyThumbnailImage,
          Body: buffer,
          ContentType: "image/jpeg",
          StorageClass: "REDUCED_REDUNDANCY",
        };
  
        // Add object in the Thumbnail folder
        await S3.putObject(destparams).promise();

        response.body = buffer.toString("base64")

      } else {
        response = {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: "The item with the hash " + imageHash + " doesn't exist in DynamoDB. Hash must be wrong.",
        };
      }
    } else {
      response = {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: err }, null, 2),
      };
    }
  } 

  return response;
};

