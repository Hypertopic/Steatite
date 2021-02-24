<?php

class Metadata {

	/**
	 * Extracted TAGS from metadata associated with DublinCore namespace standards
	 */
	private static $_TAGS = array(
		"DateTimeOriginal" 	=> "created",
		"GPSPosition" 		=> "spatial"
	);

	/**
	 * exiftool options
	 */
	private static $_OPTIONS = array(
		"d %Y-%m-%d",
		"q",
    "s2"
	);

  private static $_SECURE = TRUE; // TODO configuration file or environment variable

	public static function getMetadata($resource) {
		$cmd = "exiftool";

		// Put needed TAG
		foreach(self::$_TAGS as $tag => $value) {
			$cmd .= " -" . $tag;
		}

		// Put needed options
		foreach(self::$_OPTIONS as $opt) {
			$cmd .= " -" . $opt;
		}

		$cmd .= " " . $resource;

    exec($cmd, $exif);
    $dublin_core = array();
    foreach ($exif as $attribute) {
      $key_value = explode(": ", $attribute, 2);
      $dublin_core[self::$_TAGS[$key_value[0]]] =
        str_replace('"', '\"', $key_value[1]);
    }
		return $dublin_core;
	}

	public static function getURI($path) {
    return 'http'
      .(self::$_SECURE ? 's' : '')
      .'://'
      .$_SERVER['HTTP_HOST']
      .$path[1];
  }
}

?>
