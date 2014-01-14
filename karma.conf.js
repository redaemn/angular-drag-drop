module.exports = function(config) {
  config.set({
    
    // base path, that will be used to resolve files and exclude
    basePath: '.',
    
    frameworks: ['jasmine'],
    
    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular/angular.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min.js',
      'bower_components/jquery/jquery.min.js',
      'src/angular-drag-drop.js',
      'src/**/*.js',
      'test/**/*.js'
    ],

    // list of files to exclude
    exclude: [
      
    ],

    preprocessors: {
      
    },

    // use dots reporter, as travis terminal does not support escaping sequences
    // possible values: 'dots', 'progress'
    // CLI --reporters progress
    reporters: ['progress'],
    
    hostname: process.env.IP ? process.env.IP : 'localhost',
    
    // web server port
    // CLI --port 9876
    port: process.env.IP ? process.env.PORT : 9018,
    
    // enable / disable colors in the output (reporters and logs)
    // CLI --colors --no-colors
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    // CLI --log-level debug
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    // CLI --auto-watch --no-auto-watch
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // CLI --browsers Chrome,Firefox,Safari
    browsers: process.env.IP ? [] : [
      'Chrome'
    ],
    
    // If browser does not capture in given timeout [ms], kill it
    // CLI --capture-timeout 5000
    captureTimeout: 20000,

    // Auto run tests on start (when browsers are captured) and exit
    // CLI --single-run --no-single-run
    singleRun: false,

    // report which specs are slower than 500ms
    // CLI --report-slower-than 500
    reportSlowerThan: 500,

    // plugins: [
    //   'karma-jasmine',
    //   'karma-chrome-launcher',
    //   'karma-firefox-launcher',
    //   'karma-junit-reporter',
    //   'karma-commonjs'
    // ]
    
  });
};
