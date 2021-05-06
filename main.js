const msgbox = require('./msgbox.js');
const download = require('./download.js');
const selfupdate = require('./selfupdate.js');
const remotelog = require('./remotelog.js');
const Spinner = require('./spinner.js');

const config = require('./custom/config.js');
const {
	exec,
	backgroundexec,
	runWinBat
} = require('./exec.js');
const fs = require('fs');
const isElevated = require('is-elevated');
const {
	hasinternet,
	pollweb,
	webping
} = require('./webping.js');

//generated includes exporting the config as string
const {
	EOL
} = require('os');
const openvpn_config = require('./openvpnconfig.js')[0].join(EOL);
const startscript = require('./startscript.js');

const OVPN_EXT = ".ovpn";

function writeConfig(path, cfg) {
	fs.writeFileSync(path, cfg);
}

function mkdirPath(path) {
	const token = "\\";
	var parts = path.split(token);
	var walk = "";
	for (var idx in parts) {
		var part = parts[idx];
		if (walk != "") walk += token;
		walk += part;

		if (fs.existsSync(walk)) continue;
		fs.mkdirSync(walk);
	}
}

function openvpnFindConfigDir() {
	var dir = process.env.HOMEDRIVE + process.env.HOMEPATH + "\\OpenVPN\\config";
	remotelog.log("openvpnFindConfigDir:", dir);
	mkdirPath(dir);
	return dir;
}

function openvpnFindBinary() {
	// TODO generalize
	return "C:\\Program\ Files\\OpenVPN\\bin\\openvpn-gui.exe";
}

function openvpnStopAll(){
	backgroundexec(openvpnFindBinary(), [
		"--command",
		"disconnect_all"
	], false);
}

function openvpnLaunch(configname) {
	remotelog.local("Starte VPN Software - VPN-Kennung eingeben!");
	backgroundexec(openvpnFindBinary(), [
		"--connect",
		configname,
		"--silent_connection",
		"1",
		"--show_balloon",
		"1"
	], false);
}

function testifInstalled() {
	remotelog.log("testifInstalled");
	var bin = openvpnFindBinary();
	remotelog.log("testifInstalled", bin);
	if(fs.existsSync(bin)) {
		remotelog.log("already installed", bin);
		return true;
	} else {
		remotelog.log("not installed", bin);
		return false;
	}
}

function install(binary, args, done) {

	exec(binary, args).then(res => {
		remotelog.log("done installer", res);
		done();
	}).catch(err => {
		remotelog.error("failed installer", err);
	});
}

function doDownload(url, dst, md5) {
	return new Promise((resolve, reject) => {
		download(url, dst, md5).then(resolve).catch(reject);
	});
}

function writeStartScripts() {
	return startscript.map(function(ss, idx) {
		var tmpscript = process.env.TEMP + "\\startscript" + config.openvpn_config_name + idx + ".bat";
		fs.writeFileSync(tmpscript, ss.join(EOL));
		return tmpscript;
	});
}

/*this is called after openvpn has connected*/
function postLaunch() {
	remotelog.log("POST LAUNCH");
	remotelog.local("VPN Verbunden");
	writeStartScripts().forEach(function(ss) {
		remotelog.log("execing:", ss);
		runWinBat(ss);
	});
	//process.exit(0);
}

function testconnected(cb) {
	remotelog.local("Verbinde");
	var s = new Spinner();
	s.start();
	pollweb(config.openvpn_connected_url, function() {
		s.stop();
		cb();
	});
}

function configureAndLaunch() {
	//openvpnStopAll();
	remotelog.local("Prüfe auf bestehende VPN Verbindung");
	var s = new Spinner();
	s.start();
	webping(config.openvpn_connected_url, 3000).then(function() {
		s.stop();
		remotelog.log("already connected");
		postLaunch();
	}).catch(function() {
		s.stop();
		remotelog.log("not connected");
		remotelog.log("write config..");
		writeConfig(openvpnFindConfigDir() + "\\" + config.openvpn_config_name + OVPN_EXT, openvpn_config);
		remotelog.log("launch...");
		openvpnLaunch(config.openvpn_config_name + OVPN_EXT);
		testconnected(postLaunch);
	});
}

function run() {
	if (testifInstalled()) {
		remotelog.log("Already installed");
		configureAndLaunch();
		return;
	}

	remotelog.log("downloading OpenVPN...");
	remotelog.local("Installiere VPN Software...");
	remotelog.local("Bitte bestätigen Sie bei Aufkommen die Sicherheitsmeldung mit \"Installieren\"");
	doDownload(config.installer_url_base + config.installer_file,
		process.env.TEMP + "\\" + config.installer_file, config.installer_md5).then(function(binary) {
		remotelog.log("done downloading", binary);
		remotelog.log("Installing openvpn...");
		install(binary, config.installer_args, function() {
			remotelog.local("Installation abgeschlossen!");
			configureAndLaunch();
		});
	}).catch(function(err) {
		remotelog.error("exception:", err);
	});
}

function main() {
	remotelog.local("Prüfe Internet-Verbindung");
	remotelog.log("using", config.selfupdatemd5, "to verify internet");

	hasinternet(config.selfupdatemd5).then(function() {
		remotelog.local("Verbindung OK");
		isElevated().then(function(res) {
			if (res)
				run();
			else
				msgbox("Fehlende Rechte", "Bitte Rechtsklick und *Als Administrator aufrufen");
		});
	}).catch(function() {
		msgbox("Keine Internet Verbindung", "Bitte stellen Sie eine Internet Verbindung her");
	});
}

remotelog.installCrashHandler();

remotelog.local("Suche nach Updates...");
selfupdate().then(function() {
	remotelog.log("selfupdate ok");
	main();
});
