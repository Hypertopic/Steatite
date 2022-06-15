/**
 * Adds the info in DynamoDB of the  added in S3
 *
 * The user puts the image in the bucket S3 "pe22-test"
 * The function adds its etag and its resource in dynamoDB
 *
 **/

// dependencies
const AWS = require("aws-sdk");
const sharp = require("sharp");
const path = require("path");
const crypto = require("crypto");
const ExifImage = require("exif").ExifImage;

const DynamoDB = new AWS.DynamoDB();
const S3 = new AWS.S3();

// Name of the table in DynamoDB
const tableName = "picture";

// Allowed extensions for sharp
const allowedExtensionsForSharp = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "avif",
  "tiff",
  "svg",
];

exports.handler = (event, context) => {
  // Gets the info from the triggered event (= put in S3 bucket) : bucket name and file name
  const s3Object = event["Records"][0].s3;
  const sourceBucketName = s3Object.bucket.name;
  const pathFileName = decodeURIComponent(
    s3Object.object.key.replace(/\+/g, " ")
  );

  // Infer the image type from the file suffix.
  const typeMatch = pathFileName.match(/\.([^.]*)$/);
  if (!typeMatch) {
    console.log("Could not determine the image type.");
    return;
  }

  // Check that the image type is supported
  const imageType = typeMatch[1].toLowerCase();
  if (!allowedExtensionsForSharp.includes(imageType)) {
    console.log(`Unsupported image type: ${imageType}`);
    return;
  }

  const parsedPathInfos = path.parse(pathFileName); // Extract the infos of the path
  // [DOC] : https://nodejs.org/api/path.html#pathparsepath
  const fileName = parsedPathInfos.base;
  const corpus = parsedPathInfos.dir ? parsedPathInfos.dir : "Misc/";

  if (corpus === "Thumbnail" || corpus === "Optimized") return;

  const keyObject = corpus + "/" + fileName;
  const paramsGetObject = {
    Bucket: sourceBucketName,
    Key: keyObject,
  };

  S3.getObject(paramsGetObject, async function (err, data) {
    if (err) {
      console.log("[ERROR : getObject] :", err, err.stack); // an error occurred
    } else {
      const fileContent = data["Body"]; // Extract the content of the file

      let DateTimeOriginal;

      new ExifImage({ image: fileContent }, function (error, exifData) {
        if (error) console.log("Error: " + error.message);
        else {
          var str = exifData.exif.DateTimeOriginal.split(" ");
          //get date part and replace ':' with '-'
          DateTimeOriginal = str[0].replace(/:/g, "-");
        }
      });

      // create the final etag encrypted
      let finalEtag = crypto.createHash("sha1");
      let hash = finalEtag.update(fileContent).digest("hex");
      const etagWithoutQuoteAndExtension = hash + ".jpeg";
      // set thumbnail width. Resize will set the height automatically to maintain aspect ratio.
      const height = 100;

      // Use the sharp module to resize the image and save in a buffer.
      try {
        var buffer = await sharp(fileContent)
          .resize(height)
          .toFormat("jpeg", { mozjpeg: true })
          .toBuffer();
      } catch (error) {
        console.log("Error sharp resize] : ", error);
        return;
      }

      // Upload the thumbnail image to the destination bucket
      try {
        const destparams = {
          Bucket: sourceBucketName,
          Key: "Thumbnail/" + etagWithoutQuoteAndExtension,
          Body: buffer,
          ContentType: "image/jpeg",
          StorageClass: "REDUCED_REDUNDANCY",
        };
        await S3.putObject(destparams).promise();
      } catch (error) {
        console.log("Error putObject thumbnail] : ", error);
        return;
      }
      const baseUrlAWS =
        "https://" + sourceBucketName + ".s3.eu-west-3.amazonaws.com/";
      const resource = baseUrlAWS + keyObject;
      // Create the object with all the params
      const paramsPutItem = {
        Item: {
          hash: {
            S: hash,
          },
          name: {
            S: fileName,
          },
          created: {
            S: DateTimeOriginal,
          },
          corpus: {
            S: corpus,
          },
          baseUrlAWS: {
            S: baseUrlAWS,
          },
        },
        TableName: tableName,
      };
      // Put the new item in DynamoDB
      DynamoDB.putItem(paramsPutItem, async function (err) {
        if (err) {
          console.log("[ERROR : putItem] :", err, err.stack); // an error occurred
        } else {
          console.log(
            "[SUCCESS] : item successfully added to the table ",
            tableName,
            " at the uri : ",
            resource
          );
        }
      });
    }
  });
};
