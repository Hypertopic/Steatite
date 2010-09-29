<?php
/*
STEATITE - Web service for getting different views of archived documents

Copyright (C) 2004-2010 Aurelien Benel

OFFICIAL WEB SITE
http://www.hypertopic.org/index.php/Steatite

LEGAL ISSUES
This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License (version 3) as published by the
Free Software Foundation.
This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details:
http://www.gnu.org/licenses/gpl.html
*/

$dir = opendir('picture');
pg_connect('dbname=steatite');
$result = pg_query('SELECT * FROM attributes');
pg_close();
$row = array();
while ($row = pg_fetch_row($result)) {
	$name[$row[0]] = $row[2];
}

header('content-type: application/json;charset=utf-8');
echo '{"rows":[', "\n", '{"key":["00"], "value":{"name":"Pictures"}}';
while ($file=readdir($dir)) {
	if (substr($file, 0, 1)!='.') {
		echo ",\n", '{"key":["00","', $file, '"], "value":{"name":"', 
			$name[$file], '"}}';
	}
}
echo "\n]}";

?>
