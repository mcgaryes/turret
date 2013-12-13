There are many generation tools out there... so what makes *Turret* any different? Turret doesn't rewrite or introduce a large number of new conventions. It uses npm directly for generator you'll want to install and use and the majority of generators you create will be a `template` directory and a `schema.js` configuration module. That's it, which is fairly simple.

The power of Turret comes from it's [underscore](http://underscorejs.org) templating implementation. Each file in your `template` folder will be run through a templating function. This way you can conditionally be altering the code that is generated with logic you or the user provides.

### Installation

	$ npm install turret -g

### Installing and running a Turret

	$ mkdir PROJECT_DIR && cd PROJECT_DIR
	$ turret install turret-webapp
	$ turret run turret-webapp

### Creating a Turret

	$ mkdir MY_TURRET_DIR && cd MY_TURRET_DIR
	$ turret init

Now you can work on your Turret before pushing it out to npm.

**The template folder...**

The template folder is the heart of every Turret you will create and/or use. The files within the directory will all be copied and moved into the newly created project.

Concider the following directory structure within a Turret's template directory:

	template
		-> index.html

*index.html*

	<html>
		<head>
			<? if (foo) { ?>
				<script src="http://www.example.com/some-script.js"></script>
			<? } ?>
		</head>
		<body></body>
	</html>

When the Turret is run `index.html` is run through a templating function where it can react to `foo`.

**So where do the variables passed to the templating method come from?**

Good question. There are two places where data passed to the templating function come from and they both (somewhat) come from the Turret's `schema.js` module.

**The schema module...**

Each Turret contains a `schema.js` module that sits next to it's template folder. The following is an example:

	module.exports = {
		prompt: {
			properties: {
				...
			}
		},
		template: {
			foo:"bar"
		}
	};

The prompt export contains items you wish to prompt the user for when they install and run the Turret. For a detailed list of the prompt properties see [https://github.com/flatiron/prompt](https://github.com/flatiron/prompt).

The template export contains any other data that you want to make available to the files as they are passed through the templating function during project generation.

### Turret Commands

	$ turret <command> [program]

### Commands:

***init***

	$ turret init

Create a new turret.

***run***

	$ turret run turret-webapp

Run an installed turret's generation.

***install***

	$ turret install turret-webapp

Install a turret from either npm or a git repo.

***uninstall***

	$ turret uninstall turret-webapp

Uninstall a turret from either npm or a git repo.

***update***

	$ turret update turret-webapp

Update a turret to the newest or a passed version.