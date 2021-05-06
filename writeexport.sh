#!/bin/sh
#content="$(sed 's/\\/\\\\/g' "$1" | awk '{printf("%s\r\n",$0)}')"
#cat<<EOF > "$2" 
#module.exports = \`
#$content
#\`
#EOF

out="$1"
shift;
cat<<EOF > "$out" 
module.exports = [
EOF


for f in "$@"
do
	echo "[" >> "$out"

	sed -i 's/\\/\\\\/g' "$f"
	while read -r line ; do
		echo "\"$line\"," >> "$out"
	done < "$f"

	echo "]," >> "$out"
done




cat<<EOF >> "$out" 
]

EOF
