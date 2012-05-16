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

include('../lib/Mustache.php');

$db = new PDO('sqlite:../attribute/database');
$data = array(
  'corpus' => $_GET['corpus'],
  'service' => 'http://'.$_SERVER['HTTP_HOST'], //TODO non root or with port
  'pictures' => array()
);
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
echo $renderer->render(file_get_contents('../template/corpus.json'), $data);

?>
