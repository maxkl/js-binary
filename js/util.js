/**
 * Copyright: (c) 2016 Max Klein
 * License: MIT
 */

function padStart(str, targetLen, padChar) {
	var padding = "";

	var n = targetLen - str.length;
	while(n--) {
		padding += padChar;
	}

	return padding + str;
}

function hex(n, width) {
	width = width || 2;

	return "0x" + padStart(n.toString(16).toUpperCase(), width, "0");
}

var escapeHtml = (function () {
	var rEntitities = /[<>&]/g;
	var replacementMap = {
		"<": "&lt;",
		">": "&gt;",
		"&": "&amp;"
	};

	return function escapeHtml(str) {
		return str.replace(rEntitities, function (entity) {
			return replacementMap[entity];
		});
	}
})();
