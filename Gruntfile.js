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
              ' */\n\n'
    },
    
    jshint: {
      chore: ['package.json', 'Gruntfile.js', 'karma.conf.js'],
      dist: ['Gruntfile.js','src/**/*.js', 'test/**/*.js']
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
          'dist/<%= filename %>-<%= pkg.version %>.min.js': ['src/**/*.js']
        }
      }
    },
    
    karma: {
      singleRun: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      coverage: {
        configFile: 'karma.conf.js',
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
        configFile: 'karma.conf.js',
        autoWatch: true
      }
    },
    
    clean: {
      dist: ['dist/*.js'],
      demoSite: ['dist/resources/', 'dist/index.html']
    },
    
    copy: {
      demoSite: {
        options: {
          processContent: grunt.template.process
        },
        files: [{
          expand: true,
          cwd: "misc/demoSite",
          src: ["index.html", "resources/*"],
          dest: "dist/"
        }]
      }
    }
    
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  /****************************************
   * Default task
   ****************************************/

  grunt.registerTask('default',
    'Lint JS files, run tests and then build',
    ['jshint:chore', 'jshint:dist', 'karma:singleRun', 'uglify:dist']
  );
  
  /****************************************
   * Build Task
   ****************************************/
   
   grunt.registerTask('build',
    'Lint JS files and then minify',
    ['clean:dist', 'jshint:chore', 'jshint:dist', 'uglify:dist']
   );
   
   grunt.registerTask('demoSite',
    'Update the demo site',
    ['clean:demoSite', 'copy:demoSite']
  );
};
