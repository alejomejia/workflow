module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  var path = {
    config: 'grunt-config',
    source: 'src',
    dist: 'dist'
  };

  var pkg = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    path: path,
    pkg: pkg,

    /*Install Dependencies*/
    bowercopy: grunt.file.readJSON('grunt-config/dependencies.json'),
    less: {
      production:{
        options: {
             paths: ["<%= path.source %>/less"]
         },
         files: {"<%= path.dist %>/assets/css/style.css": "<%= path.source %>/less/style.less"}
      },
      development:{
        options: {
             paths: ["<%= path.source %>/less"]
         },
         files: {"<%= path.source %>/assets/css/style.css": "<%= path.source %>/less/style.less"}
      }
    },

    /*Concurrent Tasks*/
    concurrent:{
      options:{
        logConcurrentOutput: true
      },
      dev:{
        tasks: ['server','watch']
      }
    },

    jade:{
      production:{
        options: {
          basedir: '<%= path.source %>/html', 
          pretty: true,
          data: function(dest, src) {
            var data = {
              conf: require('./' +  path.source + '/production-conf.json')
            }
            return data;
          },
        },
        files: [{
          expand: true,
          cwd: '<%= path.source %>/html',
          src: [ '*.jade' ],
          dest: 'dist',
          ext: '.html'
        }]
      }
    },

    /*Dist copy files*/
    copy: {
      dist:{
        files:[
          {expand: true, src: ['**'], cwd: '<%= path.source %>/assets', dest: '<%= path.dist %>/assets' },
        ]
      }
    },
    watch: {
      options: {
        livereload: true,
      },
      compile: {
        files: ['<%= path.source %>/less/**/*.less'],
        tasks: ['less:production','notify:compile'],
      }
    },
    /*Notifications Task*/
    notify: {
      compile: {
        options: {
          title: 'Success!',  // optional
          message: 'CSS compiled!', //required
        }
      },
    }
  });

  //Create a Jade Server with express
  grunt.registerTask('server', function(){
    var done = this.async();
    grunt.log.writeln('Starting web server on port 8080.');
    require('./' + path.config + '/jade-server.js').listen(8080).on('close', done);
  });

  // Default task(s).
  grunt.registerTask('default', ['concurrent']);

  // Compile dist
  grunt.registerTask('dist', ['less:production','jade','copy:dist','notify:compile']);

  // Install dependencies
  grunt.registerTask('install', ['bowercopy']);

};