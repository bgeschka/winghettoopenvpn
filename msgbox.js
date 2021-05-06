const fs = require('fs');
const { backgroundexec } = require('./exec.js');
		//"SET msgboxTitle=This is my Message Title",
		//"SET msgboxBody=This is my Message Body",
		//"SET tmpmsgbox=%temp%\\~tmpmsgbox.vbs",
		//"IF EXIST \"%tmpmsgbox%\" DEL /F /Q \"%tmpmsgbox%\"",
		//"ECHO msgbox \"%msgboxBody%\",0,\"%msgboxTitle%">"%tmpmsgbox%\"",

function msgbox(title, body){
	var file = process.env.TEMP+"\\~tmpmsgbox.vbs";
	fs.writeFileSync(file, 'msgbox "'+body+'",0,"'+title+'"');
	backgroundexec("WSCRIPT", [file]);
}

module.exports = msgbox;

