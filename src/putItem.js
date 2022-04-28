/**
 * Adds the info in DynamoDB of the file added in S3
 * 
 * The user puts the image in the bucket S3 "pe22-test"
 * The function adds its etag and its resource in dynamoDB
 * 
 **/

// Imports
const AWS = require("aws-sdk")
const DynamoDB = new AWS.DynamoDB();
const S3 = new AWS.S3();
const path = require('path');
const crypto = require('crypto')

// Name of the table in DynamoDB
const tableName = "picture"

exports.handler = (event) => {
    // Gets the info from the triggered event (= put in S3 bucket) : bucket name and file name

    const s3_object = event['Records'][0]['s3']
    const source_bucket_name = s3_object['bucket']['name']
    const pathFileName = s3_object['object']['key']
    
    const parsedPathInfos = path.parse(pathFileName) // Extract the infos of the path 
    // [DOC] : https://nodejs.org/api/path.html#pathparsepath
    
    const fileName = parsedPathInfos.base
    
    const corpus = parsedPathInfos.dir ? parsedPathInfos.dir : "Misc" // If the image is in a folder
    
    const paramsGetObject = {
        Bucket: source_bucket_name,
        Key: ((corpus !== "Misc") ? corpus + "/" : "")+ fileName
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

            const resource = "https://pe22-test.s3.eu-west-3.amazonaws.com/" + fileName
            
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
                    }
                },
                TableName: tableName
            }
            
            // Put the new item in DynamoDB
            DynamoDB.putItem(paramsPutItem, function(err) {
                if (err) {
                    console.log("[ERROR : putItem] :", err, err.stack); // an error occurred
                }
                else {
                    console.log("[SUCCESS] : item successfully added to the table ",tableName, " at the uri : ", resource)
                }
            })
        }
    })
}