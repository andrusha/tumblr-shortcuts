# Makefile for GNU make

RELEASE_DIR = ./release

all: dev

release: dev
	echo "Optimizing with Closure compiler"
	closure-compiler --js $(RELEASE_DIR)/tumblr_shortcuts.js --js_output_file $(RELEASE_DIR)/tumblr_shortcuts.compiled.js --compilation_level SIMPLE_OPTIMIZATIONS
	mv $(RELEASE_DIR)/tumblr_shortcuts.compiled.js $(RELEASE_DIR)/tumblr_shortcuts.js

	echo "Cleaning old version"
	rm -f $(RELEASE_DIR)/tumblr_shortcuts.zip

	echo "Compressing extension"
	cd $(RELEASE_DIR) ; \
	zip tumblr_shortcuts.zip tumblr_shortcuts.js tumblr_shortcuts.css manifest.json 48.png 128.png


dev:
	echo "Compiling coffee script"
	coffee --compile --lint --join $(RELEASE_DIR)/tumblr_shortcuts.js lib.coffee shortcuts.coffee tumblr.coffee help.coffee tumblr_shortcuts.coffee 
