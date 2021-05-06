var assetLocation = "<some private url where to store all the stuff>";
module.exports = {
	openvpn_connected_url: 'http://192.168.166.1', /*url to test if connected, e.g. some internal server/router/something*/
	installer_md5: "b89e06ae7e4a064a736f13b337c22f70",
	installer_url_base: assetLocation,
	installer_file: "openvpn-install-2.4.6-I602.exe",
	openvpn_config_name: 'customers_vpn_name', //name to appear on openvpn gui + configname
	selfupdate: assetLocation+'vpn.exe',
	selfupdatemd5: assetLocation+'version.md5',
	// remotelog: assetLocation+'remotelog.php',

	installer_args: [
		"/S"
		, "/SELECT_SHORTCUTS=0" //- create the start menu shortcuts
		, "/SELECT_OPENVPN=1" //- OpenVPN itself
		, "/SELECT_SERVICE=1" //- install the OpenVPN service
		, "/SELECT_TAP=1" //- install the TAP device driver
		, "/SELECT_OPENVPNGUI=1" //- install the default OpenVPN GUI
		, "/SELECT_ASSOCIATIONS=1" //- associate with .ovpn files
		, "/SELECT_OPENSSL_UTILITIES=0" //- install the utilities for generating public-private key pairs
		, "/SELECT_EASYRSA=0" //- install the RSA X509 certificate management scripts
		, "/SELECT_PATH=1" //- add openvpn.exe in PATH
		, "/SELECT_OPENSSLDLLS=1" //- dependencies - OpenSSL DLL's
		, "/SELECT_LZODLLS=1" //- dependencies - LZO compressor DLL's
		, "/SELECT_PKCS11DLLS=1" //- dependencies - PCKS#11 DLL's
	]
};
