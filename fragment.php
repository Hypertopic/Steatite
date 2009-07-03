<?php
/*
STEATITE - Web service for getting different views of archived documents

Copyright (C) 2004-2009 Aurelien Benel

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

$id = $_GET['id'];
$x1 = $_GET['x1'];
$y1 = $_GET['y1'];
$x2 = $_GET['x2'];
$y2 = $_GET['y2'];
$url_prefix = 'http://'.$_SERVER['HTTP_HOST'];//TODO https and non root

header('content-type: text/xml');

echo "<?xml version='1.0' ?>\n"
	."<entity>\n"
	."<attribute name='type' value='fragment'/>\n"
	."<resource name='thumbnail' href='$url_prefix/thumbnail/$id/$x1+$x2+$y1+$y2'/>\n"
	."<resource name='highlight' href='$url_prefix/resource/$id#$x1+$x2+$y1+$y2'/>\n"
	."</entity>\n";

?>
