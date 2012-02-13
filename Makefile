# Makefile for GNU make

all: dev

release: dev
	echo "Optimizing with Closure compiler"
	closure --js tumblr_shortcuts.js --js_output_file tumblr_shortcuts.compiled.js --compilation_level SIMPLE_OPTIMIZATIONS
	mv tumblr_shortcuts.compiled.js tumblr_shortcuts.js

	echo "Cleaning old version"
	rm -f tumblr_shortcuts.zip

	echo "Compressing extension"
	zip tumblr_shortcuts.zip tumblr_shortcuts.js manifest.json 48.png 128.png


dev:
	echo "Compiling coffee script"
	coffee --compile --lint --join tumblr_shortcuts.js lib.coffee shortcuts.coffee tumblr.coffee help.coffee tumblr_shortcuts.coffee
