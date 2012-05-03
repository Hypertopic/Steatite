<?php
/*
STEATITE - Pictures archive for qualitative analysis

Copyright (C) 2012 Aurelien Benel

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

if ($_SERVER['REQUEST_METHOD']=='POST') {
  $item = $_GET['source_id'];
  $attribute = $_GET['attribute_name'];
  $value = $_GET['attribute_value'];

  $db = new PDO('sqlite:attribute/database');
  $deleteStatement =  $db->prepare(
    'DELETE FROM attributes WHERE source_id=? AND attribute_name=?'
  );
  $insertStatement =  $db->prepare(
    'INSERT INTO attributes(source_id, attribute_name, attribute_value) VALUES (?, ?, ?)'
  );
  $deleteStatement->execute(array($item, $attribute));
  $insertStatement->execute(array($item, $attribute, $value));
} else {
  header('Method not allowed', true, 405);
}

?>
