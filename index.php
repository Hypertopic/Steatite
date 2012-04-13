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

$db = new PDO('sqlite:attribute/database');

echo "<html>\n",
  "<head>\n<title>Steatite</title>\n</head>\n",
  "<body>\n",
  "<header>\n<nav>\n",
  "<b>Corpora</b>\n", //TODO i18n
  "</nav>\n</header>\n";

$count = 
  $db->query("SELECT count(distinct source_id) FROM attributes")->fetch();
echo "<a href='picture/'> All pictures ($count[0])</a>"; //TODO first img

$result = $db->query(
  "SELECT attribute_value, count(1) FROM attributes "
  ."WHERE attribute_name='corpus' GROUP BY attribute_value"
);
foreach ($result as $row) {
  echo "<a href='picture/?corpus=$row[0]'>",
    //TODO first img
    "$row[0] ($row[1])", 
    "</a>";
}

echo "<footer><form method='get' action='picture/'>\n",
  "<input type='text' name='corpus' size='12' placeholder='New corpus' />\n", //TODO i18n
  "<input type='submit' value='Add'/>\n", //TODO i18n
  "</form>\n</footer>\n",
	"</body>\n</html>\n";

?>
