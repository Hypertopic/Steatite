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
		"php"
	);

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

		eval('$metadata=' . `$cmd`);

		return self::conformResponse($metadata[0]);
	}

	/**
	 * Change keys name in order to be conform with DublinCore metadata namespace
	 */
	private static function conformResponse($res) {
		foreach ($res as $key => $value) {
			if(!empty($value) && array_key_exists($key, self::$_TAGS)) {
				$res[self::$_TAGS[$key]] = $res[$key];
			}

			// Unset all unused data
			unset($res[$key]);
		}

		return $res;
	}

}



?>