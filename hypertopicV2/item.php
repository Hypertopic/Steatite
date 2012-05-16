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

include('../lib/Mustache.php');

$db = new PDO('sqlite:../attribute/database');
$query = $db->prepare(
  "SELECT attribute_value FROM attributes "
  ."WHERE source_id=? AND attribute_name='name'"
);
$query->execute(array($_GET['item']));
$result = $query->fetch();
$data = array(
  'corpus' => $_GET['corpus'],
  'item' => $_GET['item'],
  'service' => 'http://'.$_SERVER['HTTP_HOST'], //TODO non root or with port
  'name' => $result[0]
);
$renderer = new Mustache();
header('content-type: application/json');
echo $renderer->render(file_get_contents('../template/item.json'), $data);

?>
