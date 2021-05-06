#!/bin/sh
SRCDIR="$PWD"
BUILDDIR="/tmp/ovpn_$(date +%s)"
mkdir -p "$BUILDDIR"
cp -r ./* "$BUILDDIR"
cd "$BUILDDIR" || exit 1
./writeexport.sh startscript.js custom/*.exec 
./writeexport.sh openvpnconfig.js custom/openvpn.conf 
npm install
pkg -t node8-win main.js -o /tmp/main_windows
node ./setwinopts.js /tmp/main_windows.exe "$BUILDDIR/custom"/*.ico

echo "built into /tmp/main_windows.exe"
MD5="$(md5sum /tmp/main_windows.exe| awk '{print $1}')"

ASSETS="/tmp/windows_openvpn_build"
[ -d "$ASSETS" ] && rm -rf "$ASSETS"
mkdir -p "$ASSETS"
mv /tmp/main_windows.exe "${ASSETS}/vpn.exe"
cp "${SRCDIR}/openvpn-install-2.4.6-I602.exe" "${ASSETS}/openvpn-install-2.4.6-I602.exe"
cp "${SRCDIR}/remotelog.php" "${ASSETS}/remotelog.php"
echo "$MD5" > "${ASSETS}/version.md5"


echo "finished build in $BUILDDIR"
echo "$ASSETS"
