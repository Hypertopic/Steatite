
Steatite – Pictures archive for qualitative analysis
====================================================

License: [GNU Affero General Public License](http://www.gnu.org/licenses/agpl.html)

Contact: <aurelien.benel@utt.fr>

Home page: <https://github.com/Hypertopic/Steatite>

Notice
------

Steatite is a server software. There is no need to install it on your own computer to use it. The usual way is to be "hosted" by one's own institution (ask your system administrator). If your use cases meet our research interests, we can also host your data on our community server.

Installation requirements
-------------------------

- Git client
- Apache HTTP server with PHP and rewrite module
- Netpbm (Linux, MacOS X, Mingw32)
- ExifTool
- SQLite 3

Installation procedure
----------------------

- In a Web folder:

        git clone git@github.com:Hypertopic/Steatite.git
        cd Steatite
        mkdir -m 755 picture thumbnail attribute
        sqlite3 attribute/database <schema.sql
        chown -R www-data picture thumbnail attribute

- If the last command threw an error, your system may use a different username for Apache-owned files. Change it accordingly.

- Set Apache PATH environment to include `mkdir`, `file` and `anytopnm` (see wiki for OS-dependent procedures). 

- In `/etc/php5/apache2/php.ini` (or equivalent), set `upload_max_filesize`, `max_file_uploads` and `post_max_size` high enough for your mass uploading needs.

Features
------------------------

Steatite is a service of image analysis designed in accordance with the Hypertopic protocol. Thus for compatibily reasons, some services had to be implemented but does not have really interest for Steatite. That's why some services are implemented but will return an empty JSON table. See [Hypertopic Protocol](https://github.com/Hypertopic/Protocol) for more informations.
Here's a description of the features offered by Steatite. For each features, you have the pattern of the request followed with an example. 

__• To display a picture__ 

The picture will be displayed in the format it was initially upload.

`^picture/(.+)$`

[Picture Example](http://steatite.hypertopic.org/picture/c4ced98095164137e2df8ab7aa6e9e3740b12a96)


__• To display a thumbnail__
 
Type `thumbnail` instead of `picture` in your request. 

`^thumbnail/(.+)$`

[![thumbnail-example](http://steatite.hypertopic.org/thumbnail/c4ced98095164137e2df8ab7aa6e9e3740b12a96)](http://steatite.hypertopic.org/thumbnail/c4ced98095164137e2df8ab7aa6e9e3740b12a96)

__• To display a fragment__

You can display only a fragment of a picture by adding four coordinates, each separated with a  `+`  at the end of your request. The four digits `(\d+)` are coordinates - in pixels - that represents two points in the original image and create a rectangle that will be the diplayed fragment. 
The two first digits are the coordinates of the first point, respectively the abscissa and ordinate. The third and fourth digits are respectively the abscissa and ordinate of the second point. 

`^thumbnail/(.+)/(\d+)\+(\d+)\+(\d+)\+(\d+)$`

For example if you want to display only the face of the character at the left of the picture, you can type this : 
<http://steatite.hypertopic.org/thumbnail/c4ced98095164137e2df8ab7aa6e9e3740b12a96/300+450+850+1000>

Here's what you will get : 

[![fragment-example](http://steatite.hypertopic.org/thumbnail/c4ced98095164137e2df8ab7aa6e9e3740b12a96/300+450+850+1000)](http://steatite.hypertopic.org/thumbnail/c4ced98095164137e2df8ab7aa6e9e3740b12a96/300+450+850+1000)

__• To display attributes related to a picture in JSON format__

You can access to the metadatas related to a picture or thumbnail by typing `item` in your request. Thus, you will access to the picture or thumbnail id, name, the date on which the picture was taken and possibly the localisation of the picture if this attribute is available for the picture.
`^item/picture/(.+)$`
   
Here's what will display with this request : 
<http://steatite.hypertopic.org/item/picture/c4ced98095164137e2df8ab7aa6e9e3740b12a96>
   
```json
  {
    "rows":[
        {"key":["picture", "0f9fa45500958406f667075d66180582d735d6c1"], "value":{"name":"Amp15b.jpg"}},
        {"key":["picture", "0f9fa45500958406f667075d66180582d735d6c1"], "value":{"resource":"http://steatite.hypertopic.org/picture/0f9fa45500958406f667075d66180582d735d6c1"}},
      {"key":["picture", "0f9fa45500958406f667075d66180582d735d6c1"], "value":{"thumbnail":"http://steatite.hypertopic.org/thumbnail/0f9fa45500958406f667075d66180582d735d6c1"}},
      {"key":["picture", "0f9fa45500958406f667075d66180582d735d6c1"], "value":{"created":"2007-04-20"}}
      ]
  }
```

__• To display attributes related to a thumbnail in JSON format__

You can also display the attributed related to a thumbnail. 
`^item/thumbnail/(.+)$`
   
Here's what will display with this request : 
<http://steatite.hypertopic.org/item/thumbnail/c4ced98095164137e2df8ab7aa6e9e3740b12a96>

```json
  {
    "rows":[
        {"key":["thumbnail", "0f9fa45500958406f667075d66180582d735d6c1"], "value":{"name":"Amp15b.jpg"}},
        {"key":["thumbnail", "0f9fa45500958406f667075d66180582d735d6c1"], "value":{"resource":"http://steatite.hypertopic.org/picture/0f9fa45500958406f667075d66180582d735d6c1"}},
        {"key":["thumbnail", "0f9fa45500958406f667075d66180582d735d6c1"], "value":{"thumbnail":"http://steatite.hypertopic.org/thumbnail/0f9fa45500958406f667075d66180582d735d6c1"}},
        {"key":["thumbnail", "0f9fa45500958406f667075d66180582d735d6c1"], "value":{"created":"2007-04-20"}}
      ]
  }
```

__• To display attributes in XML format__
  
`^entity/(.+)$`

Here's what will display with this request : 
<http://steatite.hypertopic.org/entity/c4ced98095164137e2df8ab7aa6e9e3740b12a96>

```xml
  <entity>
    <attribute name="type" value="source"/>
    <attribute name="name" value="Amp15b.jpg"/>
    <resource name="thumbnail" href="http://steatite.hypertopic.org/thumbnail/0f9fa45500958406f667075d66180582d735d6c1"/>
    <resource name="source" href="http://steatite.hypertopic.org/picture/0f9fa45500958406f667075d66180582d735d6c1"/>
  </entity>
```

__• To access all the items of a corpus__

You can access to the list of all pictures contained in a corpus.
`^corpus/(.+)$` 
   
Here's what will display with this request : 

<http://steatite.hypertopic.org/corpus/Vitraux%20-%20Bénel>
   
```json
  {
    "rows":[
      {"key":["Vitraux - BÃ©nel"], "value":{"name":"Vitraux - BÃ©nel"}}, 
        {"key":["Vitraux - BÃ©nel", "e40b04e31b74f8ebb32a63525cc0efe7e7278193"], "value":{"name":"SNC"}},
        {"key":["Vitraux - BÃ©nel", "e40b04e31b74f8ebb32a63525cc0efe7e7278193"], "value":{"resource":"http://steatite.hypertopic.org/picture/e40b04e31b74f8ebb32a63525cc0efe7e7278193"}},
        {"key":["Vitraux - BÃ©nel", "e40b04e31b74f8ebb32a63525cc0efe7e7278193"], "value":{"thumbnail":"http://steatite.hypertopic.org/thumbnail/e40b04e31b74f8ebb32a63525cc0efe7e7278193"}}, 
        {"key":["Vitraux - BÃ©nel", "7b0006e98ec564021778cf585cae3adec07f4389"], "value":{"name":"SJ"}},
        {"key":["Vitraux - BÃ©nel", "7b0006e98ec564021778cf585cae3adec07f4389"], "value":{"resource":"http://steatite.hypertopic.org/picture/7b0006e98ec564021778cf585cae3adec07f4389"}},
        {"key":["Vitraux - BÃ©nel", "7b0006e98ec564021778cf585cae3adec07f4389"], "value":{"thumbnail":"http://steatite.hypertopic.org/thumbnail/7b0006e98ec564021778cf585cae3adec07f4389"}}, 
        {"key":["Vitraux - BÃ©nel", "1b0283c79d33afd06eed5abb46a836b4c235e4b3"], "value":{"name":"SNZ"}},
        {"key":["Vitraux - BÃ©nel", "1b0283c79d33afd06eed5abb46a836b4c235e4b3"], "value":{"resource":"http://steatite.hypertopic.org/picture/1b0283c79d33afd06eed5abb46a836b4c235e4b3"}},
        {"key":["Vitraux - BÃ©nel", "1b0283c79d33afd06eed5abb46a836b4c235e4b3"], "value":{"thumbnail":"http://steatite.hypertopic.org/thumbnail/1b0283c79d33afd06eed5abb46a836b4c235e4b3"}}
      // ...
    ]
  }
```










