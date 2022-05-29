## Functional features

The name of "Steatite" once was a French acronym for "*Serveur de traitement, d'émission et d'archivage de textes, images et épures*". Steatite is now an image processing service.

### Get the picture (in its original format)

API: */item/{corpus}/{hash}*

> Example: https://taqz1u2kf4.execute-api.eu-west-3.amazonaws.com/testPE22/item/Misc/93c50bd082f83683c9de8904f7102b3de2823b9f

The response will be:

```
{
  "rows": [
    {
      "key": [
        "Misc",
        "93c50bd082f83683c9de8904f7102b3de2823b9f"
      ],
      "value": {
        "created": "2022-05-13"
      }
    },
    {
      "key": [
        "Misc",
        "93c50bd082f83683c9de8904f7102b3de2823b9f"
      ],
      "value": {
        "hash": "93c50bd082f83683c9de8904f7102b3de2823b9f"
      }
    },
    {
      "key": [
        "Misc",
        "93c50bd082f83683c9de8904f7102b3de2823b9f"
      ],
      "value": {
        "name": "testMettreDansMisc.JPG"
      }
    },
    {
      "key": [
        "Misc",
        "93c50bd082f83683c9de8904f7102b3de2823b9f"
      ],
      "value": {
        "corpus": "Misc"
      }
    },
    {
      "key": [
        "Misc",
        "93c50bd082f83683c9de8904f7102b3de2823b9f"
      ],
      "value": {
        "resource": "https://pe22-test.s3.eu-west-3.amazonaws.com/Misc/testMettreDansMisc.JPG"
      }
    }
  ]
}
```
