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

preg_match('#/optimized/(.+)$#', $_GET['resource'], $matches);
$id = $matches[1];
$db = new PDO('sqlite:../data/attributes');
$query = $db->prepare(
  "SELECT attribute_value FROM attributes "
  ."WHERE source_id=? AND attribute_name='corpus'"
);
$query->execute(array($id));
$result = $query->fetch();
$data = array(
  'corpus' => $result[0],
  'item' => $id,
  'resource' => $_GET['resource']
);
$renderer = new Mustache();
header('content-type: application/json');
header('Access-Control-Allow-Origin: *');
echo $renderer->render(file_get_contents('../view/resource.json'), $data);

?>
