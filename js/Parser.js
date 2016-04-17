/**
 * Copyright: (c) 2016 Max Klein
 * License: MIT
 */

var Parser = (function () {
	"use strict";

	var mnemonics = Instructions.mnemonics;

	/**
	 *
	 * @param {string} str
	 * @param {string} search
	 */
	function indexOf(str, search) {
		var searchLen = search.length;
		if(searchLen === 0) {
			return 0;
		}

		var len = str.length;
		if(len === 0) {
			return -1;
		}

		var matchStart = 0;
		var matchLen = 0;
		for(var i = 0; i < len; i++) {
			var char = str[i];

			if(char === search[matchLen]) {
				if(matchLen === 0) {
					matchStart = i;
				}

				matchLen++;
			} else if(char === search[0]) {
				matchStart = i;

				matchLen = 1;
			} else if(matchLen > 0) {
				matchLen = 0;
			}

			if(matchLen >= searchLen) {
				return matchStart;
			}
		}

		return -1;
	}

	var rSplitTokens = /\S+/g;

	var TOKEN_OPCODE = 1,
		TOKEN_NUMBER = 2,
		TOKEN_LABEL = 3,
		TOKEN_LABEL_REFERENCE = 4;

	/**
	 *
	 * @param {int} type
	 * @param {*} value
	 * @param {int} lineNumber
	 * @constructor
	 */
	function Token(type, value, lineNumber) {
		this.type = type;
		this.value = value;
		this.lineNumber = lineNumber;
	}


	function getOpcodeFromMnemonic(mnemonic) {
		mnemonic = mnemonic.toUpperCase();

		if(!mnemonics.hasOwnProperty(mnemonic)) {
			return null;
		}

		return mnemonics[mnemonic];
	}

	/**
	 *
	 * @param {string} source
	 * @return {Token[]}
	 */
	function tokenize(source) {
		var tokens = [];

		var lines = source.split("\n"),
			lineCount = lines.length;

		for(var i = 0; i < lineCount; i++) {
			var line = lines[i];
			var lineNumber = i + 1;

			var commentStartIndex = indexOf(line, "//");
			if(commentStartIndex !== -1) {
				line = line.substring(0, commentStartIndex);
			}

			var instrStarted = false;

			var matches = line.match(rSplitTokens);
			if(matches !== null) {
				var matchCount = matches.length;

				for(var j = 0; j < matchCount; j++) {
					var match = matches[j];
					var matchLen = match.length;

					if(match[matchLen - 1] === ":") {
						tokens.push(new Token(
							TOKEN_LABEL,
							match.substring(0, matchLen - 1),
							lineNumber
						));
					} else if(!instrStarted) {
						var opcode = getOpcodeFromMnemonic(match);
						if(opcode === null) {
							throw new Error("Line " + lineNumber + ": Invalid mnemonic '" + match + "'");
						}
						tokens.push(new Token(
							TOKEN_OPCODE,
							opcode,
							lineNumber
						));

						instrStarted = true;
					} else if(match[0] === "@") {
						tokens.push(new Token(
							TOKEN_LABEL_REFERENCE,
							match.substring(1),
							lineNumber
						));
					} else {
						tokens.push(new Token(
							TOKEN_NUMBER,
							parseInt(matches[j]),
							lineNumber
						));
					}
				}
			}
		}

		return tokens;
	}

	/**
	 *
	 * @param {Token[]} tokens
	 * @return {Uint8Array}
	 */
	function compile(tokens) {
		var buffer = [];

		var labels = {};

		var tokenCount = tokens.length;

		var i, token;

		// Store label adresses
		var adress = 0;
		for(i = 0; i < tokenCount; i++) {
			token = tokens[i];

			if(token.type === TOKEN_LABEL) {
				if(labels.hasOwnProperty(token.value)) {
					throw new Error("Line " + token.lineNumber + ": Label '" + token.value + "' already defined");
				}
				labels[token.value] = adress;
			} else {
				adress++;
			}
		}

		for(i = 0; i < tokenCount; i++) {
			token = tokens[i];

			switch(token.type) {
				case TOKEN_OPCODE:
				case TOKEN_NUMBER:
					buffer.push(token.value);
					break;
				case TOKEN_LABEL_REFERENCE:
					if(!labels.hasOwnProperty(token.value)) {
						throw new Error("Line " + token.lineNumber + ": Undefined label '" + token.value + "'");
					}

					buffer.push(labels[token.value]);
			}
		}

		return new Uint8Array(buffer);
	}

	/**
	 *
	 * @constructor
	 */
	function Parser() {
		this.source = null;
		this.tokens = null;
		this.binary = null;
	}

	/**
	 *
	 * @param {string} source
	 * @return {Parser}
	 */
	Parser.prototype.init = function (source) {
		this.source = source;
		this.tokens = null;
		this.binary = null;

		return this;
	};

	/**
	 *
	 * @return {Parser}
	 */
	Parser.prototype.parse = function () {
		if(this.source === null) {
			throw new Error("Not initialized");
		}

		this.tokens = tokenize(this.source);

		return this;
	};

	Parser.prototype.compile = function () {
		if(this.tokens === null) {
			throw new Error("Not parsed");
		}

		this.binary = compile(this.tokens);

		return this.binary;
	};

	return Parser;
})();
