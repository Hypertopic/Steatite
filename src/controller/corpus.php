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
include('../metadata.php');

preg_match('#(.+)/corpus/#', $_SERVER['REQUEST_URI'], $path);
$data = array(
  'corpus' => $_GET['corpus'],
  'service' =>  Metadata::getURI($path),
  'pictures' => array()
);
$db = new PDO('sqlite:../data/attributes');
$query = $db->prepare(
  "SELECT a1.source_id, a1.attribute_value FROM attributes a1, attributes a2 "
  ."WHERE a1.source_id=a2.source_id AND a1.attribute_name='name' "
  ."AND a2.attribute_name='corpus' AND a2.attribute_value=?"
);

$query->execute(array($_GET['corpus']));
while ($row = $query->fetch()) {
  $data['pictures'][] = array(
    'item' => $row[0],
    'name' => $row[1]
  );
}
$renderer = new Mustache();
header('content-type: application/json');
header('Access-Control-Allow-Origin: *');
echo $renderer->render(file_get_contents('../view/corpus.json'), $data);

?>
