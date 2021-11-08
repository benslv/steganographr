"use strict";

const MAPPINGS = {
	// Unicode Character 'WORD JOINER' (U+2060)
	" ": "\u2060",
	// Unicode Character 'ZERO WIDTH SPACE' (U+200B)
	0: "\u200B",
	//Unicode Character 'ZERO WIDTH NON-JOINER' (U+200C)
	1: "\u200C",
};

const wrap = (str) => `\uFEFF${str}\uFEFF`;

const unwrap = (str) => {
	const temp = str.split("\uFEFF");

	return temp.length == 1 ? false : temp[1];
};

const str2bin = (str) =>
	str
		.split("")
		.map((char) => char.charCodeAt(0).toString(2))
		.join(" ");

const bin2str = (bin) =>
	bin
		.split(" ")
		.map((char) => String.fromCharCode(parseInt(char, 2)))
		.join("");

const bin2hidden = (str) => {
	for (const [char, zeroWidth] of Object.entries(MAPPINGS)) {
		str = str.replaceAll(char, zeroWidth);
	}

	return str;
};

const hidden2bin = (str) => {
	for (const [char, zeroWidth] of Object.entries(MAPPINGS)) {
		str = str.replaceAll(zeroWidth, char);
	}

	return str;
};

const encode = (public, private) => {
	if (public.length < 2) {
		throw Error("Public message must consist of at least 2 characters.");
	}

	const half = Math.ceil(public.length / 2);

	const privateBin = str2bin(private);
	const privateZeroWidth = bin2hidden(privateBin);
	const privateWrapped = wrap(privateZeroWidth);

	const publicStenographised = [
		public.slice(0, half),
		privateWrapped,
		public.slice(half, public.length),
	].join("");

	return publicStenographised;
};

const decode = (public) => {
	const unwrapped = unwrap(public);

	const message = unwrapped
		? bin2str(hidden2bin(unwrapped))
		: bin2str(hidden2bin(public));

	if (message.length < 2) return false;

	return message;
};

module.exports = {
	encode,
	decode,
};
