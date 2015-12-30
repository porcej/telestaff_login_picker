module.exports = function(grunt) {
	
	//var autoprefixer = require('autoprefixer');
  	//require('load-grunt-tasks')(grunt);
    
    var working_dir, target_dir, static_files, prod_files;
    var path = require('path');
    working_dir = 'src';
    target_dir = 'www';

    prod_files = [];
    static_files = [
        /* ---- HTML Forms ---- */
        {src: '**/*.htm', dest: target_dir },

        /* ---- XSL Transforms ---- */
        {src: '**/*.xsl', dest: target_dir + '/assets/xsl'},

        /* ---- CSS Files ---- */
        // {src: '**/*.css', dest: target_dir + '/assets/css'},

        /* ---- JS Files ---- */
        {src: '**/*.js', dest: target_dir + '/assets/js/vend'},
        
        /* ---- Image Files ---- */
        {
        	src: ['**/*.tif', '**/*.tiff', '**/*.gif', '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.ico', '**/*.bmp'], 
        	dest: target_dir + '/assets/img'
        },

        /* ---- Config XML File ---- */
        {src: '**/*.xml', dest: target_dir }
    ];
    for (var idx = 0; idx < static_files.length; idx++) {
        static_files[idx]['cwd'] = working_dir;
    }


grunt.initConfig({
	/* FTP Up some fun times */
	'sftp-deploy': {
		build: {
    		auth: {
    			host: 'dev.porcej.com',
      			port: 22,
      			authKey: 'porcej'
    		},
    		cache: false,
    		src: '/www/webstaff/www',
    		//dest: '/',
    		dest: 'dev.porcej.com/webstaff',
    		exclusions: ['/www/webstaff/www/**/.*'],
    		serverSep: '/',
    		concurrency: 4,
    		progress: true
		}
	},

	/* Lets autoprefix our CSS */
	autoprefixer: {
    	options: {
        	//browsers: ['last 2 versions', 'ie 8', 'ie 9', '> 0.25%']
        	browsers: '> 1%'
    	},
    	main: {
        	expand: true,
        	flatten: true,
        	src: 'src/**/*.css',
        	dest: target_dir + '/assets/css/'
    	}
	},

    /* Sync HTML Files to local copy */
    sync: {
      main: {
        files: static_files,
        verbose: true // Display log messages when copying files
      }
    },
    watch: {
        sync : {
			files: ['src/**/*', '!src/**/*.css'],
            tasks: ['sync']
        },
        autoprefixer: {
            files: ['src/**/*.css'],
            tasks: ['autoprefixer']
        },
        cool: {
        	files: ['src/**/*'],
        	tasks: ['sftp-deploy']
        }

    }

  });

  grunt.loadNpmTasks('grunt-sftp-deploy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-sync');
  //grunt.loadNpmTasks('grunt-contrib-coffee');
  //grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.registerTask('ftp', 'sftp-deploy');
  grunt.registerTask('default', 'watch');
  //grunt.registerTask('compileBare', ''
};