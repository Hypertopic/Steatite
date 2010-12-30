<?php
/*
STEATITE - Web service for getting different views of archived documents

Copyright (C) 2010 Aurelien Benel

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

function sendRow($item, $attribute, $value, &$isFirst) {
	if ($isFirst) {
		$isFirst = false;
	} else {
		echo ",\n";
	}
	echo '{"key":["00","', $item, '"], "value":{"', $attribute, '":"',
		$value, '"}}';
}

header('content-type: application/json;charset=utf-8');
echo '{"rows":[', "\n";
$id = $_GET['id'];
if (file_exists("picture/$id"))  {
	$url_prefix = 'http://'.$_SERVER['HTTP_HOST'];//TODO https and non root

	$db = new PDO('sqlite:attribute/database');
	$query = $db->prepare(
		'SELECT * FROM attributes WHERE source_id=?'
	);
	$query->execute(array($id));

	$isFirst = true;
	foreach ($query->fetchAll() as $row) {
		sendRow($id, $row[1], $row[2], $isFirst); 
	}
	sendRow($id, 'resource', $url_prefix.'/picture/'.$id, $isFirst);
	sendRow($id, 'thumbnail', $url_prefix.'/thumbnail/'.$id, $isFirst);
}
echo "]}";

?>
