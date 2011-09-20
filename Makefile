# Makefile for GNU make

all:
	echo "Compiling coffee script"
	coffee --compile --lint tumblr_shortcuts.coffee

	echo "Optimizing with Closure compiler"
	closure --js tumblr_shortcuts.js --js_output_file tumblr_shortcuts.compiled.js --compilation_level SIMPLE_OPTIMIZATIONS
	mv tumblr_shortcuts.compiled.js tumblr_shortcuts.js

	echo "Cleaning old version"
	rm -f tumblr_shortcuts.zip

	echo "Compressing extension"
	zip tumblr_shortcuts.zip tumblr_shortcuts.js manifest.json 48.png 128.png
