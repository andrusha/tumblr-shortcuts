# Makefile for GNU make

all:
	echo "Compiling coffee script"
	coffee --compile --lint content_script.coffee

	echo "Optimizing with Closure compiler"
	closure --js content_script.js --js_output_file content_script.compiled.js --compilation_level ADVANCED_OPTIMIZATIONS
	mv content_script.compiled.js content_script.js

	echo "Cleaning old version"
	rm tumblr_ext_nav.zip

	echo "Compressing extension"
	zip tumblr_ext_nav.zip content_script.js manifest.json 48.png 128.png
