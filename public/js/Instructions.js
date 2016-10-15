/**
 * Copyright: (c) 2016 Max Klein
 * License: MIT
 */

var Instructions = (function () {
	"use strict";

	var T_CONST = 1,
		T_REGISTER = 2,
		T_ADRESS = 3;

	var instructions = [
		{
			mnemonic: "nop",
			desc: "Does nothing",
			params: [],
			fn: function () {}
		},
		{
			mnemonic: "mov",
			desc: "Copy a register into another",
			params: [
				[T_REGISTER, "target register"],
				[T_REGISTER, "source register"]
			],
			fn: function (p) {
				var reg1 = p.nextByte(),
					reg2 = p.nextByte();

				p.registers[reg1] = p.registers[reg2];
			}
		},
		{
			mnemonic: "movc",
			desc: "Store a value in a register",
			params: [
				[T_REGISTER, "target register"],
				[T_CONST, "value to store"]
			],
			fn: function (p) {
				var reg = p.nextByte(),
					val = p.nextByte();

				p.registers[reg] = val;
			}
		},
		{
			mnemonic: "pr",
			desc: "Print the value of a register",
			params: [
				[T_REGISTER, "the register to print"]
			],
			fn: function (p) {
				var reg = p.nextByte();

				console.log("Register R" + reg + ": " + p.registers[reg]);
			}
		},
		{
			mnemonic: "inc",
			desc: "Increment a register",
			params: [
				[T_REGISTER, "the register to increment"]
			],
			fn: function (p) {
				var reg = p.nextByte();

				p.registers[reg]++;
			}
		},
		{
			mnemonic: "dec",
			desc: "Decrement a register",
			params: [
				[T_REGISTER, "the register to decrement"]
			],
			fn: function (p) {
				var reg = p.nextByte();

				p.registers[reg]--;
			}
		},
		{
			mnemonic: "jmp",
			desc: "Continue program execution at a specific adress",
			params: [
				[T_ADRESS, "the adress at which to continue execution"]
			],
			fn: function (p) {
				var addr = p.nextByte();

				p.addressPointer = addr;
			}
		},
		{
			mnemonic: "jmpne",
			desc: "Jump if the register does not equal the constant value",
			params: [
				[T_REGISTER, "the register"],
				[T_CONST, "constant value"],
				[T_ADRESS, "adress to jump to"]
			],
			fn: function (p) {
				var reg = p.nextByte(),
					val = p.nextByte(),
					addr = p.nextByte();

				if(p.registers[reg] !== val) {
					p.addressPointer = addr;
				}
			}
		}
	];

	var mnemonics = {};
	for(var i = 0; i < instructions.length; i++) {
		var mnemonic = instructions[i].mnemonic.toUpperCase();
		mnemonics[mnemonic] = i;
	}

	return {
		PARAM_TYPE: {
			CONST: T_CONST,
			REGISTER: T_REGISTER,
			ADRESS: T_ADRESS
		},
		informations: instructions.map(function (instr) {
			return {
				mnemonic: instr.mnemonic,
				desc: instr.desc,
				params: instr.params
			};
		}),
		functions: instructions.map(function (instr) {
			return instr.fn;
		}),
		mnemonics: mnemonics
	};

})();

// var _instructions = [
// 	function nop(p) {
// 		console.log("NOP");
// 	},
// 	function mov(p) {
// 		var reg1 = p.nextByte(),
// 			reg2 = p.nextByte();
//
// 		console.log("MOV r" + reg1 + ", r" + reg2);
//
// 		p.registers[reg1] = p.registers[reg2];
// 	},
// 	function movConstant(p) {
// 		var reg = p.nextByte(),
// 			val = p.nextByte();
//
// 		console.log("MOV r" + reg + ", #" + val);
//
// 		p.registers[reg] = val;
// 	},
// 	function printRegister(p) {
// 		var reg = p.nextByte();
//
// 		console.log("PRINT r" + reg + ": " + p.registers[reg]);
// 	},
// 	function increment(p) {
// 		var reg = p.nextByte();
//
// 		console.log("INC r" + reg);
//
// 		p.registers[reg]++;
// 	},
// 	function decrement(p) {
// 		var reg = p.nextByte();
//
// 		console.log("DEC r" + reg);
//
// 		p.registers[reg]--;
// 	},
// 	function jmp(p) {
// 		var addr = p.nextByte();
//
// 		console.log("JMP @" + hex(addr));
//
// 		p.addressPointer = addr;
// 	},
// 	function jmpNotEquals(p) {
// 		var reg = p.nextByte(),
// 			val = p.nextByte(),
// 			addr = p.nextByte();
//
// 		console.log("JMPNE r" + reg + ", #" + val + ", @" + hex(addr));
//
// 		if(p.registers[reg] !== val) {
// 			p.addressPointer = addr;
// 		}
// 	}
// ];
