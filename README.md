Steatite – Pictures archive for qualitative analysis
====================================================

Contact: <aurelien.benel@utt.fr>

Home page: <https://github.com/Hypertopic/Steatite>

## Features

The name of "Steatite" once was a French acronym for "*Serveur de traitement, d'émission et d'archivage de textes, images et épures*". Steatite is now an image processing service.

### Get an optimized picture

API: `/optimized/{hash}`

Example: https://vogwuoualf.execute-api.eu-west-3.amazonaws.com/Steatite/optimized/b852cfdb04a89b0e7483a6d6d6b3315675cb4aa8

![b852cfdb04a89b0e7483a6d6d6b3315675cb4aa8](https://user-images.githubusercontent.com/45626870/175082351-8d980d2f-7be9-4306-8bd4-b67a692f757a.jpeg)


### Get a JPEG thumbnail (efficiently)

API: `/thumbnail/{hash}`

Example: https://vogwuoualf.execute-api.eu-west-3.amazonaws.com/Steatite/optimized/b852cfdb04a89b0e7483a6d6d6b3315675cb4aa8![b852cfdb04a89b0e7483a6d6d6b3315675cb4aa8]

![b852cfdb04a89b0e7483a6d6d6b3315675cb4aa8 (1)](https://user-images.githubusercontent.com/45626870/175082581-ecdd6aeb-319d-4927-a365-bc73d5f64a94.jpeg)

### Get attributes related to a picture in JSON

URI: `/item/{corpus}/{hash}`

In addition to the name of the item, and its related URIs,
you will get the shooting date if it is present in the EXIF metadata of the picture file.

For example, if you request the following URI:
https://vogwuoualf.execute-api.eu-west-3.amazonaws.com/Steatite/item/Test/b852cfdb04a89b0e7483a6d6d6b3315675cb4aa8

The response will be:

```yaml
{
  "rows": [
    {
      "key": [
        "Test",
        "b852cfdb04a89b0e7483a6d6d6b3315675cb4aa8"
      ],
      "value": {
        "created": "2020-02-05",
        "baseUrlAWS": "https://steatitebucket.s3.eu-west-3.amazonaws.com/",
        "name": "2000_18-25_0021_LET_R_A.jpg",
        "corpus": "Test",
        "response": "https://steatitebucket.s3.eu-west-3.amazonaws.com/Test/2000_18-25_0021_LET_R_A.jpg",
        "optimized": "https://vogwuoualf.execute-api.eu-west-3.amazonaws.com/Steatite/optimized/b852cfdb04a89b0e7483a6d6d6b3315675cb4aa8",
        "thumbnail": "https://vogwuoualf.execute-api.eu-west-3.amazonaws.com/Steatite/thumbnail/b852cfdb04a89b0e7483a6d6d6b3315675cb4aa8"
      }
    }
  ]
}
```
This part of the API is compliant with the [Hypertopic protocol](https://github.com/Hypertopic/Protocol/#item-1).


