module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    filename: 'angular-drag-drop',
    
    commons: {
      banner: '/*\n' +
              ' * <%= pkg.name %> v<%= pkg.version %> [https://github.com/redaemn/angular-drag-drop]\n' +
              ' * <%= grunt.template.today("yyyy-mm-dd") %>\n' +
              ' *\n' +
              ' * This software is licensed under The MIT License (MIT)\n' +
              ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> [<%= pkg.author.url %>]\n' +
              ' * [https://github.com/redaemn/angular-drag-drop/blob/master/LICENSE]\n' +
              ' *\n' +
              ' * Some code is taken from the AngularUI Bootstrap project [http://angular-ui.github.io/bootstrap/]\n' +
              ' * Copyright (c) 2012-2014 the AngularUI Team [https://github.com/angular-ui/bootstrap/blob/master/LICENSE]\n' +
              ' */\n\n'
    },
    
    concat: {
      dist: {
        options: {
          banner: '<%= commons.banner %>'
        },
        files: {
          'dist/<%= filename %>-<%= pkg.version %>.js': ['src/module.prefix', 'src/angular-drag-drop.js', 'src/**/*.js', 'src/module.suffix']
        }
      }
    },
    
    jshint: {
      chore: ['package.json', 'Gruntfile.js', 'karma.conf.js'],
      dist: ['src/**/*.js', 'test/**/*.js']
    },
    
    uglify: {
      options: {
        report: 'min'
      },
      dist: {
        options: {
          banner: '<%= commons.banner %>'
        },
        files: {
          'dist/<%= filename %>-<%= pkg.version %>.min.js': ['dist/<%= filename %>-<%= pkg.version %>.js']
        }
      }
    },
    
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      singleRun: {
        singleRun: true
      },
      travis: {
        singleRun: true,
        browsers: ['PhantomJS']
      },
      coverage: {
        singleRun: true,
        preprocessors: {
          'src/**/*.js': 'coverage'
        },
        reporters: ['progress', 'coverage'],
        coverageReporter: {
          type : 'html',
          dir : 'coverage/'
        }
      },
      watch: {
        autoWatch: true
      }
    },
    
    clean: {
      dist: ['dist/*.js'],
      demoSite: ['dist/**/*', '!dist/*.js']
    },
    
    copy: {
      demoSite: {
        options: {
          processContent: grunt.template.process
        },
        files: [{
          expand: true,
          cwd: "misc/demoSite",
          src: ["index.html", "sitemap.xml", "resources/*"],
          dest: "dist/"
        }]
      }
    }
    
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  /****************************************
   * Default task
   ****************************************/

  grunt.registerTask('default',
    'Lint JS files, run tests and then build',
    ['clean:dist', 'jshint:chore', 'jshint:dist', 'karma:singleRun', 'concat:dist', 'uglify:dist']
  );
  
  /****************************************
   * Build Task
   ****************************************/
   
   grunt.registerTask('build',
    'Lint JS files and then minify',
    ['clean:dist', 'jshint:chore', 'jshint:dist', 'concat:dist', 'uglify:dist']
   );
   
   grunt.registerTask('demoSite',
    'Update the demo site',
    ['clean:demoSite', 'copy:demoSite']
  );
};
