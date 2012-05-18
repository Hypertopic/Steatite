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

if (!isset($_SERVER['HTTP_IF_NONE_MATCH'])) { 
  $id = $_GET['id'];
  $x1 = $_GET['x1'];
  $y1 = $_GET['y1'];
  $x2 = $_GET['x2'];
  $y2 = $_GET['y2'];
  $destination = "../thumbnail/$id.$x1.$y1.$x2.$y2";
  if (!file_exists($destination) || filesize($destination)==0) {
    $cmd = "anytopnm ../picture/$id";
    if (
      is_numeric($x1) && is_numeric($y1) 
      && is_numeric($x2) && is_numeric($y2)) 
    {
      $cmd .= "| pamcut -left=$x1 -top=$y1 -right=$x2 -bottom=$y2";
    }
    $cmd .= '| pnmscale -height 100'
      . '| pnmtojpeg >'.$destination;
    system($cmd, $error);
    if ($error) {
      exit("<p>Cannot execute the following command:</p><p>$cmd</p>");
    }
  }
  header('content-type: image/jpeg');
  header('Etag: "ETERNAL"');
  readfile($destination);
} else {
  header('Not modified', true, 304);
}

?>
