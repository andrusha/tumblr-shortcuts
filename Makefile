# Makefile for GNU make

all:
	echo "Cleaning old version"
	rm tumblr_ext_nav.zip

	echo "Compressing extension"
	zip tumblr_ext_nav.zip content_script.js manifest.json 48.png 128.png
