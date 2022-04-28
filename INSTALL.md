## Requirements

AWS Account with access to :
* [Amazon S3 (**S**imple **S**torage **S**ervice)](https://aws.amazon.com/fr/s3/)
* [Lambda](https://aws.amazon.com/fr/lambda/)
* [API Gateway](https://aws.amazon.com/fr/api-gateway/)
* [DynamoDB](https://aws.amazon.com/fr/dynamodb/)



## Installation procedure

### Brief presentation of the AWS components
In this project, we use 4 AWS components :
* Amazon S3 : It enables us to stock the items of the project (photos).
* Lambda : It is used to link the different components used in this project.
* API Gateway : The API that enables to make requests and get the information.
* DynamoDB : The database that stock the information of the items (we use S3 and DynamoDB in order to facilitate the modification of the S3 bucket and the request paths).

To better understand the links between the different entities, here is a schema of what happens when one makes a request to have information used in this project :

<img src="./images/schema_lambda.png" alt="isolated" width="auto"/>

### Configuration

> For all the configurations, we recommend using the AWS region closest to you (*in our case, eu-west-3 | Europe Paris*)

We are going to start by configurating all the aws elements of the project and finish with the lambda. Every lambda function represents a functional feature that we want to implement.

#### **S3 Configuration**

For this project, we only need to create a S3 bucket. To do so: 
* Go to your AWS console (https://s3.console.aws.amazon.com/s3/buckets?region=eu-west-3)
* Click on create a bucket
* Configurate your bucket: 
    * Give a name.
    * Make sure the region is the one you want to use.
	* Make sur all the accesses are blocked (we will modify them after).
 	* Click on create a bucket.

> Your bucket is ready!

#### **Lambda configuration**
##### *1. Put an item*
Create the lambda function:
* Go to the AWS console: https://eu-west-3.console.aws.amazon.com/lambda/home?region=eu-west-3#/functions
* Click on "*Create function*"
* Configure the function: 
    * Click on "*Author from scratch*" to create it from scratch.
    * Name your function.
	* You want your code to be in node.js, you can choose the "*Node.js 14.x*" version, the one we chose.
	* Make sure that you are going to create a new role for your function under "*Change default execution role*".
    * Click on "*Create function*"

<img src="./images/put_item.png" alt="put item" width="auto"/>

Give the adequate role to your lambda function (in this case, we want our lambda function to be able to put an item in our database):
* Go in your Lambda function.
* Click on "*Configuration*".
* Click on "*Permissions*".
* Click on your role. 
 
<img src="./images/online_politic_put_item.png" alt="politic put item" width="auto"/>

You can now see the roles that your function has.
* Click on create an online politic
* Indicate that it is for DynamoDB and for the action put item.
 
<img src="./images/action_put_item.png" alt="action put item" width="auto"/>

* Add an ARN to make sur that the function can only modify the database you’ve just created

 
<img src="./images/arn_put_item.png" alt="arn put item" width="auto"/>

* Click on examine the strategy
* Name your strategy
* Click on create the strategy
* Do the same for access to S3 with the action GetObject

In the code section, add this and modify the name of the database and the URI of the bucket: 

```
const AWS = require("aws-sdk")
const S3 = new AWS.S3();
// Connection to the table
const DynamoDB = new AWS.DynamoDB();
const tableName = "DYNAMODB_TABLE_NAME"

let crypto = require('crypto')
let finalEtag = crypto.createHash('sha1')

exports.handler = (event) => {
    //gets the info from the triggered event (= put in S3 bucket) : bucket name and file name

    const s3_object = event['Records'][0]['s3']
    const source_bucket_name = s3_object['bucket']['name']
    const file_name = s3_object['object']['key']

    const paramsGetObject = {
        Bucket: source_bucket_name,
        Key: file_name
    }

    S3.getObject(paramsGetObject, function(err, data) {
        if (err) {
            console.log("[ERROR : getObject] :", err, err.stack); // an error occurred
        }
        else {
            // if the object is added,creates the new item
            const file_content = data['Body']
            console.log(data)
            let etag = data['ETag'].replace(/"/gi, '')
            
            // create the final etag encrypted
            finalEtag.update(etag)
            etag = finalEtag.digest('hex')
            
            // set the creation date
            var creationDate = new Date().toISOString().slice(0, 10);

            const resource = "BUCKET_URI/" + file_name
            const paramsPutItem = {
                Item: {
                    hash: {
                        S: etag 
                    },
                    resource: {
                        S: resource
                    },
                    name: {
                        S: file_name  
                    },
                    created: {
                        S: creationDate
                    }
                },
                TableName: tableName
            }
            //Put the new item in DynamoDB
            DynamoDB.putItem(paramsPutItem, function(err, data) {
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
```

* Click on "*Deploy*"

Then, we can test it :
* Click on the arrow on the button "*Test*".
* Click on "*Create new event*".
* Name your event.
* Chose the S3 model and change the data according to your information (region, bucket name, object). 
  Here is an example of a test (before doing this test, you should add an element in your S3 bucket): 

```
{
  "Records": [
    {
      "eventVersion": "2.0",
      "eventSource": "aws:s3",
      "awsRegion": "eu-west-3",
      "eventTime": "1970-01-01T00:00:00.000Z",
      "eventName": "ObjectCreated:Put",
      "userIdentity": {
        "principalId": "EXAMPLE"
      },
      "requestParameters": {
        "sourceIPAddress": "127.0.0.1"
      },
      "responseElements": {
        "x-amz-request-id": "EXAMPLE123456789",
        "x-amz-id-2": "EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH"
      },
      "s3": {
        "s3SchemaVersion": "1.0",
        "configurationId": "testConfigRule",
        "bucket": {
          "name": "BUCKET_NAME",
          "ownerIdentity": {
            "principalId": "EXAMPLE"
          },
          "arn": "arn:aws:s3:::BUCKET_NAME"
        },
        "object": {
          "key": "ADDED_OBJECT’S_ NAME “,
          “size”: 1024,
          “eTag”: “0123456789abcdef0123456789abcdef”,
          “sequencer”: “0A1B2C3D4E5F678901”
        }
      }
    }
  ]
}
```

Now, make sure that the element is well added into the database when you upload an element into your S3 bucket.

##### *2. Get an item*

Create the lambda function:
* Go to the AWS console: https://eu-west-3.console.aws.amazon.com/lambda/home?region=eu-west-3#/functions
* Click on "*Create function*"
* Configure the function: 
    * Click on "*Author from scratch*" to create it from scratch.
    * Name your function.
	* You want your code to be in node.js, you can choose the "*Node.js 14.x*" version, the one we chose.
	* Make sure that you are going to create a new role for your function under "*Change default execution role*".
    * Click on "*Create function*"

 
<img src="./images/get_item.png" alt="get item" width="auto"/>

Give the adequate role to your lambda function (in this case, we want our lambda function to be able to put an item in our database):
* Go in your Lambda function.
* Click on "*Configuration*".
* Click on "*Permissions*".
* Click on your role. 

 <img src="./images/online_politic_put_item.png" alt="politic put item" width="auto"/>

You can now see the roles that your function has.
* Click on create an online politic
* Indicate that it is for DynamoDB and for the action get item.
* Add an ARN to make sur that the function can only modify the database you’ve just created.
* Click on examine the strategy
* Name your strategy
* Click on create the strategy
* Do the same for access to S3 with the action GetObject

In the code section, add this and modify the name of the database: 

```
const AWS = require("aws-sdk");
const S3 = new AWS.S3();
var DynamoDB = new AWS.DynamoDB();
const tableName = "TABLE_NAME";
let responseObject = {};

exports.lambda_handler = async (event, context) => {
   // 1. Parse out query string parameters
   console.log("event : ",event)
   console.log("context : ",context)
   const imageEtag = event['pathParameters']['hash']
   
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
         // Construct the body of the response object
         let imageResponse = {}
         imageResponse['hash'] = imageEtag;
         imageResponse['resource'] = data['Item']['resource']
         
         const uriImage = data['Item']['resource']['S']
         console.log(uriImage)

         const htmlResponse = 
            `<html style="height: 100%;">

            <head>
                <meta name="viewport" content="width=device-width, minimum-scale=0.1">
                <title>`+imageEtag+`</title>
            </head>
            
            <body style="margin: 0px; 
                  background: #0e0e0e; 
                  height: 100vh;
                  display: flex;
                  align-items: 'center';
                  justify-content: 'center';"
            >
               <img 
                  style="
                     -webkit-user-select: none;
                     margin: auto;
                     cursor: zoom-in;
                     background-color: hsl(0, 0%, 90%);
                     transition: background-color 300ms;
                     height: 100vh;
                     
                  " 
                  src="`+uriImage+`" 
               >
               <div id="forest-ext-shadow-host"></div>
            </body>
            
            </html>`
            
         // 4. Construct http repsonse object
         responseObject['statusCode'] = 200
         responseObject['headers'] = {}
         responseObject['headers']['Content-Type'] = 'text/html'
         responseObject['body'] = htmlResponse

         //5. Return the response object
         console.log("****** response *******")
         console.log(responseObject)
         //return responseObject;
         return responseObject
       
     }
   }).promise();
   
   return responseObject;
};
```

In the API gateway : 
* Create a GET method on the Hash resource : check that it is a proxy from a lambda function, the region and add the lambda function.
* Click on "*Action*" > "*Deploy*" the API and add a name. 
* Click on "*Deploy*"

![deploy_api]()

In the S3 bucket : 
* Choose "*Permissions*".
* Under "*Block public access (bucket settings)*", choose "*Edit*".
* Clear "*Block all public access*", and choose "*Save changes*".
* Under "*Bucket Policy*", choose "*Edit*".
* Copy the following bucket policy, paste it in the "*Bucket policy editor*" and modify the bucket name.
```
 {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::Bucket-Name/*"
            ]
        }
    ]
}
```
* Update the "*Resource*" to your bucket name.
* Choose "*Save changes*".

#### **API Gateway configuration**

Create the API:
* Go to the AWS console: https://eu-west-3.console.aws.amazon.com/apigateway/main/apis?region=eu-west-3.
* Click on "*Create API*".
* Click on "*Build*" in the REST API block.
* Make sure you configurate it well : 

<img src="./images/deploy_api.png" alt="deploy api" width="auto"/>

* Name your API
* Click on "*Create API*"

When the API is created, you can access its paramaters, if you want to create a resource :
* Click on "*Resources*".
* Click on "*Actions*" > "*Create Resource*".
* Give the resource a name :

<img src="./images/give_ressource_api.png" alt="give ressource name api" width="auto"/>

* Click on "*Create Resource*".

> The resource is created !

* If you want to create a sub resource under the one created, here *picture*, click on it. 
* Click on "*Actions*" > "*Create Resource*".
    * Check the proxy resource :

        > *Checking the proxy will allow to get and treat all the demands made to the sub resource, for exemple, a hash that could be use to get an image.*

    * Give a name: {hash+}

<img src="./images/give_ressource_api_proxy.png" alt="give ressource name api with proxy" width="auto"/>

        > ⚠️️️ *Do not forget to add the "+" at the end of the resource's name as it is showed in the exemple* ⚠️️️
 
    * Click on "*Create Resource*".

We will finalise the configuration later. The tree should look like this:

<img src="./images/tree_conf.png" alt="tree configuration" width="auto"/>

#### **DynamoDB configuration**

* Go to the AWS console : https://eu-west-3.console.aws.amazon.com/dynamodbv2/home?region=eu-west-3#service.
* Click on "*Tables*" to go go into your tables on the left sidebar.
* Click on "*Create table*".
* Configurate our table : 
    * Give a name.
    * Give a name to you partition key : hash.
    * Click on "*Create table*"

> Your table is ready!