Steatite – Pictures archive for qualitative analysis
====================================================

Contact: <aurelien.benel@utt.fr>

Home page: <https://github.com/Hypertopic/Steatite>


## Requirements

* [Docker Engine](https://docs.docker.com/install/)


## Installation procedure

    docker-compose up -d steatite

Steatite (API endpoint and user interface) is now available at <http://localhost/>.


## Functional features

The name of "Steatite" once was a french acronym for "Serveur de traitement, d'émission et d'archivage de textes, images et épures".
Steatite is now an image processing service.
It also complies with the [Hypertopic protocol](https://github.com/Hypertopic/Protocol) and hence is compatible with [Porphyry](https://github.com/Hypertopic/Porphyry).

### Get the picture (in its original format)

API: `/picture/{hash}`

Example: <https://steatite.utt.fr/picture/c4ced98095164137e2df8ab7aa6e9e3740b12a96>

### Get an optimized picture

API: `/optimized/{hash}`

Example: <https://steatite.utt.fr/optimized/c4ced98095164137e2df8ab7aa6e9e3740b12a96>

![thumbnail-example](https://steatite.utt.fr/optimized/c4ced98095164137e2df8ab7aa6e9e3740b12a96)

### Get an optimized picture of a fragment

API: `/optimized/{hash}/{x1}+{y1}+{x2}+{y2}`

You can display only a fragment of a picture by adding four coordinates, each separated with a  `+`  at the end of your request. The four digits `(\d+)` are coordinates - in pixels - that represents two points in the original image and create a rectangle that will be the displayed fragment.
The two first digits are the coordinates of the first point, respectively the abscissa and ordinate. The third and fourth digits are respectively the abscissa and ordinate of the second point.

For example if you want to display only the face of the character at the left of the picture, you can type this:
<https://steatite.utt.fr/optimized/c4ced98095164137e2df8ab7aa6e9e3740b12a96/300+450+850+1000>

And you will get this:

![fragment-example](https://steatite.utt.fr/optimized/c4ced98095164137e2df8ab7aa6e9e3740b12a96/300+450+850+1000)

### Get a JPEG thumbnail (efficiently)

API: `/thumbnail/{hash}`

Example: <https://steatite.utt.fr/thumbnail/c4ced98095164137e2df8ab7aa6e9e3740b12a96>

![thumbnail-example](https://steatite.utt.fr/thumbnail/c4ced98095164137e2df8ab7aa6e9e3740b12a96)

### Get a JPEG thumbnail of a fragment (efficiently)

API: `/thumbnail/{hash}/{x1}+{y1}+{x2}+{y2}`

You can display only a fragment of a picture by adding four coordinates, each separated with a  `+`  at the end of your request. The four digits `(\d+)` are coordinates - in pixels - that represents two points in the original image and create a rectangle that will be the displayed fragment.
The two first digits are the coordinates of the first point, respectively the abscissa and ordinate. The third and fourth digits are respectively the abscissa and ordinate of the second point.

For example if you want to display only the face of the character at the left of the picture, you can type this:
<https://steatite.utt.fr/thumbnail/c4ced98095164137e2df8ab7aa6e9e3740b12a96/300+450+850+1000>

And you will get this:

![fragment-example](https://steatite.utt.fr/thumbnail/c4ced98095164137e2df8ab7aa6e9e3740b12a96/300+450+850+1000)

### Get attributes related to a picture in JSON (Hypertopic v2)

URI: `/item/{corpus}/{hash}`

In addition to the name of the item, and its related URIs,
you will get the shooting date and the geolocation if they are present in the EXIF metadata of the picture file.
Please note that the name is the original filename but it can be changed through the user interface.

For example, if you request the following URI:
<https://steatite.utt.fr/item/Vitraux+-+Bénel/1f3fe412f1042cbb6d42841123cf6c7e7fac309f>

The response will be:

```yaml
{"rows":[
  {"key":["Vitraux - Bénel", "1f3fe412f1042cbb6d42841123cf6c7e7fac309f"], "value":{"name":"GRD 002"}},
  {"key":["Vitraux - Bénel", "1f3fe412f1042cbb6d42841123cf6c7e7fac309f"], "value":{"resource":"https://steatite.utt.fr/picture/1f3fe412f1042cbb6d42841123cf6c7e7fac309f"}},
  {"key":["Vitraux - Bénel", "1f3fe412f1042cbb6d42841123cf6c7e7fac309f"], "value":{"thumbnail":"https://steatite.utt.fr/thumbnail/1f3fe412f1042cbb6d42841123cf6c7e7fac309f"}},
  {"key":["Vitraux - Bénel", "1f3fe412f1042cbb6d42841123cf6c7e7fac309f"], "value":{"created":"2019-02-24"}},
  {"key":["Vitraux - Bénel", "1f3fe412f1042cbb6d42841123cf6c7e7fac309f"], "value":{"spatial":"48 deg 18' 26.88\" N, 4 deg 19' 18.32\" E"}}
]}
```

### Get attributes related to a picture in XML (Hypertopic v1)

URI: `/entity/{hash}`

For example, if you request the following URI:
<https://steatite.utt.fr/entity/1f3fe412f1042cbb6d42841123cf6c7e7fac309f>

The response will be:

```xml
<entity>
  <attribute name="type" value="source"/>
  <attribute name="name" value="GRD 002"/>
  <resource name="thumbnail" href="https://steatite.utt.fr/thumbnail/1f3fe412f1042cbb6d42841123cf6c7e7fac309f"/>
  <resource name="source" href="https://steatite.utt.fr/picture/1f3fe412f1042cbb6d42841123cf6c7e7fac309f"/>
</entity>
```

### Get attributes related to all pictures in a given corpus (Hypertopic v2)

URI: `/corpus/{corpus}`

For example, if you request the following URI:
<https://steatite.utt.fr/corpus/Vitraux+-+Bénel>

The response will be:

```yaml
{"rows":[
  {
    "key":["Vitraux - Bénel"],
    "value":{"name":"Vitraux - Bénel"}
  }, {
    "key":["Vitraux - Bénel", "e40b04e31b74f8ebb32a63525cc0efe7e7278193"],
    "value":{
      "name":"SNC",
      "resource":"https://steatite.utt.fr/picture/e40b04e31b74f8ebb32a63525cc0efe7e7278193",
      "thumbnail":"https://steatite.utt.fr/thumbnail/e40b04e31b74f8ebb32a63525cc0efe7e7278193"
    }
  }, {
    "key":["Vitraux - Bénel", "7b0006e98ec564021778cf585cae3adec07f4389"],
    "value":{
      "name":"SJ",
      "resource":"https://steatite.utt.fr/picture/7b0006e98ec564021778cf585cae3adec07f4389",
      "thumbnail":"https://steatite.utt.fr/thumbnail/7b0006e98ec564021778cf585cae3adec07f4389"
    }
  }
  ...
}
```

## Technical features

- Compatible with Hypertopic v1 and v2 protocols.
- Compatible with about [100](http://netpbm.sourceforge.net/doc/directory.html#converters) raster image formats.
