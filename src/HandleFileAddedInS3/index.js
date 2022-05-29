/**
 * Adds the info in DynamoDB of the  added in S3
 * 
 * The user puts the image in the bucket S3 "pe22-test"
 * The function adds its etag and its resource in dynamoDB
 * 
 **/

// dependencies
const AWS = require("aws-sdk")
const util = require('util');
const sharp = require('sharp');
const path = require('path');
const crypto = require('crypto')

const DynamoDB = new AWS.DynamoDB();
const S3 = new AWS.S3();

// Name of the table in DynamoDB
const tableName = "picture"

exports.handler = (event) => {
    console.log("event : ",event)
    // Gets the info from the triggered event (= put in S3 bucket) : bucket name and file name

    const s3_object = event['Records'][0].s3
    const source_bucket_name = s3_object.bucket.name
    const pathFileName = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "))
    
    // Infer the image type from the file suffix.
      const typeMatch = pathFileName.match(/\.([^.]*)$/);
      if (!typeMatch) {
          console.log("Could not determine the image type.");
          return;
      }

     // Check that the image type is supported
      const imageType = typeMatch[1].toLowerCase();
      if (imageType != "jpg" && imageType != "png") {
          console.log(`Unsupported image type: ${imageType}`);
          return;
      }
      
    const parsedPathInfos = path.parse(pathFileName) // Extract the infos of the path 
    // [DOC] : https://nodejs.org/api/path.html#pathparsepath
    
    const fileName = parsedPathInfos.base

    const corpus = parsedPathInfos.dir ? parsedPathInfos.dir : "Misc/" 
    console.log("corpus : ",corpus)
    if (corpus === "Thumbnail") 
      return 

    const keyObject = corpus + "/" + fileName
    
    const paramsGetObject = {
        Bucket: source_bucket_name,
        Key: keyObject
    }
    
    S3.getObject(paramsGetObject, function(err, data) {
        if (err) {
            console.log("[ERROR : getObject] :", err, err.stack); // an error occurred
        }
        else {
            const file_content = data['Body'] // Extract the content of the file

            // Set the creation date
            var creationDate = new Date().toISOString().slice(0, 10);
            
            // create the final etag encrypted
            let finalEtag = crypto.createHash('sha1')
            let hash = finalEtag.update(file_content).digest('hex')

            const baseUrlAWS = 'https://pe22-test.s3.eu-west-3.amazonaws.com/' 
            const resource = baseUrlAWS + keyObject
            const thumbnail = baseUrlAWS + "Thumbnail/" + fileName
            // Create the object with all the params
            const paramsPutItem = {
                Item: {
                    hash: {
                        S: hash 
                    },
                    resource: {
                        S: resource
                    },
                    name: {
                        S: fileName  
                    },
                    created: {
                        S: creationDate
                    },
                    corpus: {
                        S: corpus
                    },
                    thumbnail: {
                        S: thumbnail
                    }
                },
                TableName: tableName
            }
            console.log(paramsPutItem)
            
            // Put the new item in DynamoDB
            DynamoDB.putItem(paramsPutItem, async function(err) {
                if (err) {
                    console.log("[ERROR : putItem] :", err, err.stack); // an error occurred
                }
                else {
                    console.log("[SUCCESS] : item successfully added to the table ",tableName, " at the uri : ", resource)
                
                    // Download the image from the S3 source bucket.

                    try {
                        const params = {
                            Bucket: source_bucket_name,
                            Key: keyObject
                        };
                        var origimage = await S3.getObject(params).promise();

                    } catch (error) {
                        console.log(error);
                        return;
                    }

                    // set thumbnail width. Resize will set the height automatically to maintain aspect ratio.
                    const width  = 200;

                    // Use the sharp module to resize the image and save in a buffer.
                    try {
                        var buffer = await sharp(origimage.Body).resize(width).toBuffer();

                    } catch (error) {
                        console.log(error);
                        return;
                    }

                    // Upload the thumbnail image to the destination bucket
                    try {
                        const destparams = {
                            Bucket: source_bucket_name,
                            Key: "Thumbnail/" + fileName,
                            Body: buffer,
                            ContentType: "image"
                        };

                        const putResult = await S3.putObject(destparams).promise();

                    } catch (error) {
                        console.log(error);
                        return;
                    }

                    console.log('Successfully resized ' + source_bucket_name + 'Thumbnail/' + fileName +
                        ' and uploaded to ' + source_bucket_name + 'Thumbnail/' + fileName);
                    
                }
            })
        }
    })
}