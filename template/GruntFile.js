module.exports = function(grunt) {

    "use strict";

    var RELEASE_DIRECTORY = ".release";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bower: {
            all: {
                dest: "./source/app/libs",
                options: {}
            }
        },
        clean: {
            all: [
                RELEASE_DIRECTORY + "/*",
                RELEASE_DIRECTORY + "/!.git"
            ]
        },
        copy: {
            all: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: "source",
                    dest: RELEASE_DIRECTORY,
                    src: [
                        <% if (requirejs.slice(0,1) !== "y") { %>
                        "app/**",
                        <% } else { %>
                        "app/libs/requirejs.js",
                        <% } %>
                        "*.{ico,txt,html,js,json}",
                        "assets/**/*",
                        "assets/**/*",
                        "Procfile"
                    ]
                }]
            },
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            all: ["source/app/**/*.js", "!source/app/libs/*"]
        },
        <% if (requirejs.slice(0,1) === "y") { %>
        requirejs: {
            all: {
                options: {
                    baseUrl: "source/app",
                    optimize: "uglify",
                    mainConfigFile: "source/app/main.js",
                    name: "main",
                    out: RELEASE_DIRECTORY + "/app/main.js",
                }
            }
        },
        <% } %>
        sass: {
            all: {
                files: {
                    "source/assets/css/main.css": "source/styles/main.scss"
                }
            }
        },
        shell: {
            deploy: {
                command: [
                    "cd " + RELEASE_DIRECTORY,
                    "git commit -am '" + new Date().getTime() + "' --allow-empty",
                    "git push origin master"
                ].join("&&")
            },
            setup: {
                command: [
                    "mkdir " + RELEASE_DIRECTORY,
                    "cd " + RELEASE_DIRECTORY,
                    "git clone git@heroku.com:rlab-sandbox.git ./"
                ].join("&&"),
                options:{
                    callback:function(err, stdout, stderr, cb) {
                        console.info(err);
                        cb();
                    }
                }
            }
        },
        watch: {
            all: {
                files: ["source/sass/**/*.scss"],
                tasks: ["compile"],
                options: {
                    interrupt: true,
                    forever: true
                }
            },
        }
    });

    grunt.registerTask("compile", "Compiling application...", function() {
        grunt.loadNpmTasks("grunt-contrib-sass");
        grunt.task.run(["sass"]);
    });

    grunt.registerTask("build", "Building project...", function() {
        grunt.loadNpmTasks("grunt-contrib-jshint");
        grunt.loadNpmTasks("grunt-contrib-clean");
        grunt.loadNpmTasks("grunt-contrib-copy");
        <% if (requirejs.slice(0,1) === "y") { %>
        grunt.loadNpmTasks("grunt-contrib-requirejs");
        grunt.task.run(["jshint", "clean", "compile", "requirejs", "copy"]);
        <% } else { %>
        grunt.task.run(["jshint", "clean", "compile", "copy"]);
        <% } %>
    });

    grunt.registerTask("install", "Installing application dependencies...", function() {
        grunt.loadNpmTasks("grunt-bower");
        grunt.task.run(["bower"]);
    });

    grunt.registerTask("develop", "Testing application...", function() {
        grunt.loadNpmTasks("grunt-contrib-watch");
        grunt.task.run(["compile", "watch"]);
    });

    grunt.registerTask("setup", "Setting up project...", function() {
        grunt.loadNpmTasks("grunt-shell");
        grunt.task.run(["shell:setup"]);
    });

    grunt.registerTask("deploy", "Deploying project...", function() {
        grunt.loadNpmTasks("grunt-shell");
        grunt.task.run(["shell:setup", "build", "shell:deploy"]);
    });

};