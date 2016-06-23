/**
 * Copyright: (c) 2016 Max Klein
 * License: MIT
 */

(function () {
	"use strict";

	var table = document.getElementById("instructions");

	var instructions = Instructions.informations;
	var PTYPE = Instructions.PARAM_TYPE;

	function getParamTypeString(type) {
		switch(type) {
			case PTYPE.CONST: return "byte";
			case PTYPE.REGISTER: return "register";
			case PTYPE.ADDRESS: return "address";
			default: return "*";
		}
	}

	function getParamsHtml(params) {
		return params
			.map(function (param, index) {
				return (index + 1) + ". " + param[1] + " (" + getParamTypeString(param[0]) + ")";
			})
			.map(escapeHtml)
			.join("<br />");
	}

	function addInstruction(hexCode, instr) {
		var tr = document.createElement("tr");

		var tdHex = document.createElement("td");
		tdHex.innerHTML = escapeHtml(padStart(hexCode.toString(16).toUpperCase(), 2, "0"));
		tr.appendChild(tdHex);

		var tdMn = document.createElement("td");
		tdMn.innerHTML = escapeHtml(instr.mnemonic.toUpperCase());
		tr.appendChild(tdMn);

		var tdParams = document.createElement("td");
		tdParams.innerHTML = getParamsHtml(instr.params);
		tr.appendChild(tdParams);

		var tdDesc = document.createElement("td");
		tdDesc.innerHTML = escapeHtml(instr.desc);
		tr.appendChild(tdDesc);

		table.appendChild(tr);
	}

	for(var i = 0; i < instructions.length; i++) {
		addInstruction(i, instructions[i]);
	}

})();
