Steatite – Pictures archive for qualitative analysis
====================================================

Contact: <aurelien.benel@utt.fr>

Home page: <https://github.com/Hypertopic/Steatite>

## Features

The name of "Steatite" once was a French acronym for "*Serveur de traitement, d'émission et d'archivage de textes, images et épures*". Steatite is now an image processing service.

### Get the attributes related to an uploaded picture

API: */item/{corpus}/{hash}*

> Example: https://rzi0pem2eh.execute-api.eu-west-3.amazonaws.com/PE22-230522/item/Misc/edb559800ae39b4c9c09c9e975b4736947049543

The response will be:

```
{
  "rows": [
    {
      "key": [
        "Misc",
        "edb559800ae39b4c9c09c9e975b4736947049543"
      ],
      "value": {
        "hash": "edb559800ae39b4c9c09c9e975b4736947049543",
        "created": "2022-05-30",
        "thumbnail": "https://pe22-test.s3.eu-west-3.amazonaws.com/Thumbnail/flute_logo.png",
        "optimized": "https://pe22-test.s3.eu-west-3.amazonaws.com/Optimized/flute_logo.jpeg",
        "name": "flute_logo.png",
        "corpus": "Misc",
        "resource": "https://pe22-test.s3.eu-west-3.amazonaws.com/Misc/flute_logo.png"
      }
    }
  ]
}
```

This part of the API is compliant with the [Hypertopic protocol](https://github.com/Hypertopic/Protocol/#item-1).
