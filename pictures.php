<?php
/*
STEATITE - Pictures archive for qualitative analysis

Copyright (C) 2004-2012 Aurelien Benel

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

include('lib/Mustache.php');
$db = new PDO('sqlite:attribute/database');
$hasCorpus = isset($_GET['corpus']);
switch ($_SERVER['REQUEST_METHOD']) {

	case 'GET':
  $corpusName = ($hasCorpus)? $_GET['corpus'] : 'All pictures';
  $data = array(
    'corpus' => $corpusName
  );
  $statement = $db->prepare(
    ($hasCorpus)?
      "SELECT a1.source_id, a1.attribute_value "
      ."FROM attributes a1, attributes a2 "
      ."WHERE a1.source_id=a2.source_id AND a1.attribute_name='name' "
      ."AND a2.attribute_name='corpus' AND a2.attribute_value=?"
    : "SELECT source_id, attribute_value "
      ."FROM attributes "
      ."WHERE attribute_name='name'"
  );
  $statement->execute(($hasCorpus)?array($_GET['corpus']):null);
  while ($row = $statement->fetch()) {
    $data['pictures'][] = array(
      'id' => $row[0],
      'name' => $row[1]
    );
  }
  $renderer = new Mustache();
  echo $renderer->render(file_get_contents('./template/pictures.html'), $data);
	break;

	case 'POST':
  $uploads = $_FILES['sources'];
  $statement =  $db->prepare(
    'INSERT INTO attributes(source_id, attribute_name, attribute_value) VALUES (?, ?, ?)'
  );
  for ($i=0; $i<count($uploads['name']); $i++) {
    $oldPath = $uploads['tmp_name'][$i];
    $id = sha1_file($oldPath);
    move_uploaded_file($oldPath, 'picture/'.$id);
    $statement->execute(array($id, 'name', $uploads['name'][$i])); 
    if ($hasCorpus) {
      $statement->execute(array($id, 'corpus', $_GET['corpus'])); 
    }
  }
  header('Location: '.$_SERVER['REQUEST_URI']);
}

?>
