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

$db = new PDO('sqlite:attribute/database');

switch ($_SERVER['REQUEST_METHOD']) {

	case 'GET':
  $hasCorpus = isset($_GET['corpus']);
  $corpusName = ($hasCorpus)? $_GET['corpus'] : 'All pictures';
	echo "<html>\n",
		"<head>\n<title>Steatite</title>\n</head>\n",
		"<body>\n",
    "<header>\n<nav>\n",
    "<a href='..'>Corpora</a> > <b>$corpusName</b>\n", //TODO i18n
    "</nav>\n</header>\n",
    "<form>\n";
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
    echo "<div>\n",
      "<a href='$row[0]'><img border='0' src='../thumbnail/$row[0]' /></a>\n",
      "<input type='checkbox' value='false' />\n",
      "<input type='text' value='$row[1]' />\n",
      "</div>\n";
  }
  echo "</form>\n",
    "</body>\n",
    "</html>";
	break;

	case 'POST':
	$old_path = $_FILES['source']['tmp_name'];
	$id = sha1_file($old_path);
	$new_path = 'picture/'.$id;
	move_uploaded_file($old_path, $new_path);
	$statement = $db->prepare(
		'INSERT INTO attributes(source_id, attribute_name, attribute_value) VALUES (?, \'name\', ?)'
	);
	$statement->execute(array(
		$id, 
		$_FILES['source']['name'])
	); 
  $root = 'http://'.$_SERVER['HTTP_HOST'];
	header("Location: $root/$new_path");
}

?>
