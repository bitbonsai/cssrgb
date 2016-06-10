#!/usr/local/bin/node

var fs = require('fs');
var hexrgb = require('hex-rgb');
var parker = require('parker/lib/Parker');
var metrics = require('parker/metrics/All');
var argv = require('minimist-argv');
var request = require('request');
var csv = require('ya-csv');

if (argv['_'].length < 1) {
	console.log('\nERROR: Provide at least 1 css URL to the prompt\nie: cssrgb http://example.com/url_of_css_file.css\n')
	process.exit();
}

// Main function. Get's css urls from arguments and give'em to 
// TODO: add proper validation. Right now, it will consider any parameter as a valid URL
init(argv['_']);


// functions where the magic happens
init(css_urls) {
	css_urls.forEach(function (css_url) {

		// Create csv filename that will be used for this css url
		var csv_filename = createFileName(css_url);

		request(css_url, function(err, res, body){
			var hexas;

			if (err) throw err;
		 
			var park = new parker(metrics);
			var results = park.run(body.toString());
		 
			hexas = results['unique-colours'];
			convertToRGB(hexas, csv_filename);
		});
	});
}

// TODO: make it more generic. Right now depends on certain number of params 
// that suits my needs
function createFileName(url) {
	var parts = url.split('/');

	// In my URL structure, this will give me the path and 8 chars of the hash
	return parts['5'] + '-' +  parts['6'].substr(0,8) + '.csv';
}

function convertToRGB(hexas, csv_filename) {
	var total_len = hexas.length -1;

	// creates stream to write CSV. flag w overwrites previous instances, "a" for append
	var writer = csv.createCsvStreamWriter(fs.createWriteStream(csv_filename, {'flags': 'w'}));
	
	// first line of csv file contains headers
	writer.writeRecord(['r', 'g', 'b']);

	hexas.forEach(function (hexa, index) {
		writer.writeRecord(hexrgb(hexa));
		
		// if it's the last element of hexas array, display message and gettoutahere
		if (index === (total_len)) {
			console.log('csv file written to %s', csv_filename);
		}
	});
}