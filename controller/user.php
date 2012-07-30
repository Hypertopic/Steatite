<?php
/*
STEATITE - Pictures archive for qualitative analysis

Copyright (C) 2010-2012 Aurelien Benel

OFFICIAL WEB SITE
http://www.hypertopic.org/

LEGAL ISSUES
This program is free software; you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free 
Software Foundation.
This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details:
http://www.gnu.org/licenses/agpl.html
*/

$db = new PDO('sqlite:../attribute/database');
$user = $_GET['id'];
$data = array('rows' => array());
$result = $db->query(
  "SELECT attribute_value, count(1) FROM attributes "
  ."WHERE attribute_name='corpus' GROUP BY attribute_value"
);
foreach ($result as $row) {
  $id = $row[0];
  $count = $row[1];
  $data['rows'][] = array(
    'key' => array($user),
    'value' => array(
      'corpus' => array(
        'id' => $id,
        'name' => "$id ($count)"
      )
    )
  );
}
header('content-type: application/json');
echo json_encode($data);

?>
