/**
 * Copyright: (c) 2016 Max Klein
 * License: MIT
 */

function downloadText(url, cb) {
	var req = new XMLHttpRequest();

	req.addEventListener("load", function () {
		if(req.status == 200) {
			cb(null, req.responseText);
		} else {
			cb(new Error("Server error: " + req.statusText + " (" + req.status + ")"));
		}
	});

	req.addEventListener("error", function () {
		cb(new Error("Client/network error"));
	});

	req.open("GET", url);

	req.send();
}

function downloadBinary(url, cb) {
	var req = new XMLHttpRequest();

	req.addEventListener("load", function () {
		if(req.status == 200) {
			var arrayBuffer = req.response;

			if(arrayBuffer) {
				var binary = new Uint8Array(arrayBuffer);
				cb(null, binary);
			} else {
				cb(new Error("Response empty"));
			}
		} else {
			cb(new Error("Server error: " + req.statusText + " (" + req.status + ")"));
		}
	});

	req.addEventListener("error", function () {
		cb(new Error("Client/network error"));
	});

	req.open("GET", url);

	req.responseType = "arraybuffer";

	req.send();
}

// var sourceUrl = "programs/test2.txt";
// document.getElementById("source-url").innerHTML = sourceUrl;
//
// downloadText(sourceUrl, function (err, source) {
// 	if(err) {
// 		console.error(err);
// 		return;
// 	}
//
// 	console.info("Source code downloaded.");
//
// 	document.getElementById("source").innerHTML = source;
//
// 	var parser = new Parser();
// 	parser.init(source).parse();
//
// 	console.info("Program parsed.");
//
// 	var binary = parser.compile();
//
// 	console.info("Program compiled.");
//
// 	console.info("Executing program...");
//
// 	var processor = new Processor();
// 	processor.load(binary);
// 	processor.execute();
//
// 	console.info("Program finished.");
// });

function binaryToBase64(binary) {
	var str = "";
	var len = binary.length;
	for(var i = 0; i < len; i++) {
		str += String.fromCharCode(binary[i]);
	}
	return btoa(str);
}

function downloadProgramToUser(data, name) {
	var a = document.createElement("a");
	a.href = "data:application/octet-stream;base64," + binaryToBase64(data);
	a.download = name;
	a.click()
}

function runProgram(program) {
	console.info("Executing program...");

	var processor = new Processor();
	processor.load(program);
	processor.execute();

	console.info("Program finished.");
}

function compileProgram(source) {
	var parser = new Parser();
	parser.init(source).parse();

	console.info("Program parsed.");

	var binary = parser.compile();

	console.info("Program compiled.");

	return binary;
}

var binInput = document.getElementById("file-bin");
var runBin = document.getElementById("run-bin");
runBin.addEventListener("click", function () {
	var files = binInput.files;

	if(files.length > 0) {
		var file = files[0];

		var reader = new FileReader();

		reader.onload = function () {
			console.info("Binary file loaded.");
			runProgram(new Uint8Array(reader.result));
		};

		reader.onerror = function () {
			console.error("Binary file failed to load");
		};

		reader.readAsArrayBuffer(file);
	}
});

var txtInput = document.getElementById("file-txt");
var runTxt = document.getElementById("run-txt");
runTxt.addEventListener("click", function () {
	var files = txtInput.files;

	if(files.length > 0) {
		var file = files[0];

		var reader = new FileReader();

		reader.onload = function () {
			console.info("Text file loaded.");
			var program = compileProgram(reader.result);
			runProgram(program);
		};

		reader.onerror = function () {
			console.error("Text file failed to load");
		};

		reader.readAsText(file);
	}
});
var downloadTxt = document.getElementById("download-txt");
downloadTxt.addEventListener("click", function () {
	var files = txtInput.files;

	if(files.length > 0) {
		var file = files[0];

		var reader = new FileReader();

		reader.onload = function () {
			console.info("Text file loaded.");
			var binary = compileProgram(reader.result);
			console.log("Starting dl");
			downloadProgramToUser(binary, "program.hex");
		};

		reader.onerror = function () {
			console.error("Text file failed to load");
		};

		reader.readAsText(file);
	}
});
