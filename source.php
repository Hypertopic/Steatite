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

$id = $_GET['id'];
$url_prefix = 'http://'.$_SERVER['HTTP_HOST'];//TODO https and non root

$db = new PDO('sqlite:attribute/database');
$query = $db->prepare(
	'SELECT * FROM attributes WHERE source_id=?'
);
$query->execute(array($id));

header('content-type: text/xml');
echo "<?xml version='1.0' ?>\n",
	"<entity>\n";
foreach ($query->fetchAll() as $row) {
	echo "<attribute name='$row[1]' value='$row[2]'/>\n";
}
echo "<attribute name='type' value='source'/>\n",
	"<resource name='thumbnail' href='$url_prefix/thumbnail/$id'/>\n",
	"<resource name='source' href='$url_prefix/picture/$id'/>\n",
	"</entity>\n";

?>
