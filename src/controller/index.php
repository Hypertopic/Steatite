<?php
/*
STEATITE - Pictures archive for qualitative analysis

Copyright (C) 2012 Aurelien Benel

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

if ('application/json'==$_SERVER['HTTP_ACCEPT']) {
  header('content-type: application/json');
  echo('{"service":"Steatite", "revision":"6.2016.01.26"}');
} else {
  $db = new PDO('sqlite:../data/attributes');
  $row = 
    $db->query(
      "SELECT count(distinct source_id), max(source_id) FROM attributes "
      ."WHERE source_id NOT IN "
      ."(SELECT source_id FROM attributes WHERE attribute_name='corpus')"
    )->fetch();
  $data = array(
    'count' => $row[0],
    'sample' => $row[1]
  );
  $result = $db->query(
    "SELECT attribute_value, count(1), max(source_id) FROM attributes "
    ."WHERE attribute_name='corpus' GROUP BY attribute_value"
  );
  foreach ($result as $row) {
    $data['corpora'][] = array(
      'id' => str_replace("'", "&apos;", $row[0]),
      'count' => $row[1],
      'sample' => $row[2]
    );
  }
  $renderer = new Mustache();
  echo $renderer->render(file_get_contents('../view/index.html'), $data);
}

?>
