<?php
/*
STEATITE - Pictures archive for qualitative analysis

Copyright (C) 2010-2012 Aurelien Benel

OFFICIAL WEB SITE
https://hypertopic.org/steatite

LEGAL ISSUES
This program is free software; you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free 
Software Foundation.
This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details:
http://www.gnu.org/licenses/agpl.html
*/

include('../lib/Mustache.php');

$db = new PDO('sqlite:../data/attributes');
$query = $db->prepare(
  "SELECT attribute_value FROM attributes "
  ."WHERE source_id=? AND attribute_name='name'"
);
$query->execute(array($_GET['id']));
$result = $query->fetch();
preg_match('#(.+)/entity/#', $_SERVER['REQUEST_URI'], $path);
$data = array(
  'item' => $_GET['id'],
  'service' => 'http://'.$_SERVER['HTTP_HOST'].$path[1],
  'name' => $result[0]
);
$renderer = new Mustache();
header('content-type: text/xml');
echo $renderer->render(file_get_contents('../view/entity.xml'), $data);

?>
