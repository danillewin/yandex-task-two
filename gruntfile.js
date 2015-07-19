module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            combine: {
                files: {
                    'style.min.css': ['style/*.css']
                }
            }
        },
        csscomb: {
            options: {
                config: '.csscomb.json'
            },
            files: {
                expand: true,
                cwd: 'style',
                src: ['*.css'],
                dest: 'style',
            }
        },
        uglify: {
            bundle:{
                options: {
                    sourceMap: true,
                    sourceMapName: 'script.map'
                },
                files: {
                    'script.min.js': ['script/app/**/*.js']
                }
            }
        },
        watch: {
            scripts: {
                files: 'script/app/**/*.js',
                tasks: ['script'],
                options: {
                    debounceDelay: 250,
                },
            },
            style: {
                files: 'style/*.css',
                tasks: ['style'],
                options: {
                  debounceDelay: 250,
                },
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-csscomb');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('style', ['csscomb', 'cssmin']);
    grunt.registerTask('script', ['uglify:bundle']);
    grunt.registerTask('default');
};
