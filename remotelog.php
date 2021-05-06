<?php
$LOGDEST = dirname(__FILE__) . "/vpn_logs";

if(!file_exists($LOGDEST)) mkdir($LOGDEST);
$MSG = json_decode(file_get_contents("php://input"),true);
$logfilename = $MSG['hostname']."_".$MSG['username'].'.log';
$targetfile = $LOGDEST . "/" . $logfilename . ".log";
if(!file_put_contents($targetfile, json_encode($MSG) . "\n" , FILE_APPEND))
	echo "failed to write log";
