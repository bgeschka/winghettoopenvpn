#!/bin/php
<?php

if(!$argv[1]) {
	echo "missing paramter <logfile>";
	exit(1);
}

$logfile = $argv[1];
echo "reading log file:$logfile\n";

$handle = fopen($logfile, "r");
if ($handle) {
	while (($line = fgets($handle)) !== false) {
		$jsoline = json_decode($line);
		if(!$jsoline) continue;
		$ts = $jsoline->date;
		$msg = $jsoline->msg;
		echo "$ts \t $msg\n";
	}

	fclose($handle);
} else {
	echo "could not open the file $logfile\n";
}

