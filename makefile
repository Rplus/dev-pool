# name options(--ip --https)
init:
	cp -r app/x-template app/p-$(name)
	gulp html -p p-$(name)
	gulp css -p p-$(name)
	gulp js -p p-$(name)
	gulp dev -p p-$(name) $(options)
