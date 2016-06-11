#!/usr/local/bin/node

var fs = require('fs');
var request = require('request');
var argv = require('minimist-argv');
var err = 0;
var colors = [];
var color_stats = [];

if (!validateArgs) {
	console.log('\nERROR: Provide at least 1 css URL to the prompt\nie: cssrgb http://example.com/url_of_css_file.css\n')
	process.exit();
}


// Main function. Get's css urls from arguments and give'em to 
// TODO: add proper validation. Right now, it will consider any parameter as a valid URL
init(argv['_']);

function init(urls) {
	var page;
	var css_urls = [];

	urls.forEach(function (url) {
		if (!validateURL(url)) {
			console.log('\nERROR: %s is not a valid url\n', url)
			err++;
		} else {
			page = request(url, function (err, res, bod) {
				// get all css links
				css_urls = getCSSLinks(bod);

				// get each link and save the colorz in global colors
				colors = parseColors(css_urls);

				// TODO: this gotta be sync, or use promisses, or what?...  :(
			});
		}
	});	
}

function parseColors(css_urls) {
	var counter = 0;

	css_urls.forEach(function (css_url, idx) {
		var x = y = ret = [],
			len = (css_urls.length);

		var cols = request(css_url, function (err, ret, bod) {
			x.push(getHexColors(bod));
			y.push(getRgbaColors(bod));
		}).on('response', function () {
			ret.push({
				url: css_url,
				hex: x,
				rgba: y
			});
			counter++;
			console.log('processed %s', css_url);

			if (counter === len) {
				console.log('all colors captured!');

				console.log(ret);
			}

			return ret;

		});
	});
}

function getHexColors(css_content) {
	var m,
		ret = [],
		re = /(#[abcdf0-9]+)[,;!)}']/gi;

	while ((m = re.exec(css_content)) !== null) {
		if (m.index === re.lastIndex) {
			re.lastIndex++;
		}
		if (m[1]) {
			ret.push(m[1]);
		}
	}
	// console.log(ret);
	return ret;
}
function getRgbaColors(css_content) {
	var m,
		ret = [],
		re = /(rgba?\([\d,.]+\))/g;

	while ((m = re.exec(css_content)) !== null) {
		if (m.index === re.lastIndex) {
			re.lastIndex++;
		}
		if (m[1]) {
			ret.push(m[1]);
		}
	}
	// console.log(ret)
	return ret;
}

function getCSSLinks(html) {
	var re = /<link rel="stylesheet" href="([a-z0-9_.-\/:]+.css)"/g;
	var m;
	ret = [];
	
	while ((m = re.exec(html)) !== null) {
		if (m.index === re.lastIndex) {
			re.lastIndex++;
		}
		if (m[1]) {
			ret.push(m[1]);
		}
	}
	return ret;
}

function validateArgs(args) {

	return (argv['_'].length < 1);

}

function validateURL(url) {

	return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);

}