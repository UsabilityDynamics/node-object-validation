/**
 * Node.js Module Build
 *
 * @author potanin@UD
 * @version 0.0.2
 * @param grunt
 */
module.exports = function( grunt ) {

  grunt.initConfig( {

    pkg: grunt.file.readJSON( 'package.json' ),

    mochacli: {
      options: {
        require: [ 'should' ],
        reporter: 'list',
        ui: 'exports'
      },
      all: [ './test/*.js' ]
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        logo: 'http://media.usabilitydynamics.com/logo.png',
        options: {
          paths: [ "./lib" ],
          outdir: './static/codex'
        }
      }
    },

    jscoverage: {
      options: {
        inputDirectory: 'lib',
        outputDirectory: './static/lib-cov',
        highlight: false
      }
    },

    watch: {
      options: {
        interval: 1000,
        debounceDelay: 500
      },
      docs: {
        files: [ 'readme.md' ],
        tasks: [ 'markdown' ]
      }
    },

    markdown: {
      all: {
        files: [ {
          expand: true,
          src: 'readme.md',
          dest: 'static/',
          ext: '.html'
        }
        ],
        options: {
          templateContext: {},
          markdownOptions: {
            highlight: 'manual',
            gfm: true,
            codeLines: {
              before: '<span>',
              after: '</span>'
            }
          }
        }
      }
    },

  });

  // Load tasks
  grunt.loadNpmTasks( 'grunt-markdown' );
  grunt.loadNpmTasks( 'grunt-mocha-cli' );
  grunt.loadNpmTasks( 'grunt-jscoverage' );
  grunt.loadNpmTasks( 'grunt-contrib-yuidoc' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-contrib-clean' );

  // Build Assets
  grunt.registerTask( 'default', [ 'jscoverage', 'yuidoc' ] );

  // Prepare distribution
  grunt.registerTask( 'dist', [ 'clean', 'yuidoc', 'markdown'  ] );

  // Update Documentation
  grunt.registerTask( 'doc', [ 'yuidoc', 'markdown' ] );

  // Run Tests
  grunt.registerTask( 'test', [ 'jscoverage', 'mochacli' ] );

  // Developer Mode
  grunt.registerTask( 'dev', [ 'watch' ] );

};