<?php
/*
STEATITE - Web service for getting different views of archived documents

Copyright (C) 2004-2009 Aurelien Benel

OFFICIAL WEB SITE
http://www.hypertopic.org/index.php/Steatite

LEGAL ISSUES
This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License (version 2) as published by the
Free Software Foundation.
This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details:
http://www.gnu.org/licenses/gpl.html
*/

$root = 'http://'.$_SERVER['HTTP_HOST'];

switch ($_SERVER['REQUEST_METHOD']) {

	case 'GET':
	$dir = opendir('resource');
	echo "<html>\n",
		"<head>\n<title>Steatite</title>\n</head>\n",
		"<body>\n";
	while ($file=readdir($dir)) {
		if (substr($file, 0, 1)!='.') {
			echo "<a href='$root/resource/$file'>",
				"<img border='0' src='$root/thumbnail/$file'/>",
				"</a>\n";
		}
	}
	echo "<form method='post' ",
		"enctype='multipart/form-data'>\n",
		"<input type='file' name='source' size='40'/>\n",
		"<input type='submit' value='UPLOAD'/>\n", //TODO i18n
		"</form>\n";
	echo "</body>\n</html>\n";
	break;

	case 'POST':
	$old_path = $_FILES['source']['tmp_name'];
	$new_path = 'resource/'.sha1_file($old_path);
	move_uploaded_file($old_path, $new_path);
	header("Location: $root/$new_path");//TODO 
	break;
}

?>
