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
  $id = '../picture/'.$_GET['id'];
  $mime = exec('file --brief --mime '.$id);
  header("content-type: $mime");
  header('Etag: "ETERNAL"');
  readfile($id);
} else {
  header('Not modified', true, 304);
}

?>
