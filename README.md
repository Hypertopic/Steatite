## Functional features

The name of "Steatite" once was a French acronym for "*Serveur de traitement, d'émission et d'archivage de textes, images et épures*". Steatite is now an image processing service.

### Get the picture (in its original format)

API: */item/{corpus}/{hash}*

> Example: https://rzi0pem2eh.execute-api.eu-west-3.amazonaws.com/PE22-230522/item/Misc/c16b37e4788494ac224c63cfd8da55eecf0b74d5

The response will be:

```
{
  "rows": [
    {
      "key": [
        "Misc",
        "c16b37e4788494ac224c63cfd8da55eecf0b74d5"
      ],
      "value": {
        "hash": "c16b37e4788494ac224c63cfd8da55eecf0b74d5",
        "created": "2022-05-29",
        "thumbnail": "https://pe22-test.s3.eu-west-3.amazonaws.com/Thumbnail/Bleu_Orange_Insta.png",
        "name": "Bleu_Orange_Insta.png",
        "corpus": "Misc",
        "resource": "https://pe22-test.s3.eu-west-3.amazonaws.com/Misc/Bleu_Orange_Insta.png"
      }
    }
  ]
}
```
