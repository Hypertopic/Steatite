<?php
/*
STEATITE - Pictures archive for qualitative analysis

Copyright (C) 2004-2012 Aurelien Benel

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

if (!isset($_SERVER['HTTP_IF_NONE_MATCH'])) { 
  $id = $_GET['id'];
  $source = "../data/$id";
  if (file_exists($source)) {
    $mime = exec('file --brief --mime '.$source);
    header("content-type: $mime");
    header('Etag: "ETERNAL"');
    readfile($source);
  } else {
    header('Not found', true, 404);
    echo("Picture '$id' not found.");
  }
} else {
  header('Not modified', true, 304);
}

?>
