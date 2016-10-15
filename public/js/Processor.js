/**
 * Copyright: (c) 2016 Max Klein
 * License: MIT
 */

var Processor = (function () {
	"use strict";

	var instructions = Instructions.functions;
	var instructionCount = instructions.length;

	function Processor() {
		this.romSize = 256;
		this.rom = new Uint8Array(this.romSize);
		this.programSize = 0;
		this.addressPointer = 0;
		this.registerCount = 256;
		this.registers = new Uint8Array(this.registerCount);
	}

	/**
	 *
	 * @param {Uint8Array} program
	 */
	Processor.prototype.load = function (program) {
		if(program.length > this.romSize) {
			throw new Error("Program size exceeds ROM size");
		}

		this.programSize = program.length;
		this.rom.set(program);
	};

	Processor.prototype.nextByte = function () {
		return this.rom[this.addressPointer++];
	};

	Processor.prototype.execute = function () {
		this.registers.fill(0);
		this.addressPointer = 0;

		while(this.addressPointer < this.programSize) {
			var currentInstruction = this.nextByte();

			if(currentInstruction < instructionCount) {
				instructions[currentInstruction](this);
			} else {
				throw new Error("Illegal instruction " + hex(currentInstruction) + " @ " + hex(this.addressPointer, 4));
			}
		}
	};

	return Processor;

})();
