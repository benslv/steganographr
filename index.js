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

const encode = (pub, priv) => {
	if (pub.length < 2) {
		throw Error("Public message must consist of at least 2 characters.");
	}

	const half = Math.ceil(pub.length / 2);

	const privateBin = str2bin(priv);
	const privateZeroWidth = bin2hidden(privateBin);
	const privateWrapped = wrap(privateZeroWidth);

	const publicStenographised = [
		pub.slice(0, half),
		privateWrapped,
		pub.slice(half, pub.length),
	].join("");

	return publicStenographised;
};

const decode = (pub) => {
	const unwrapped = unwrap(pub);

	const message = unwrapped
		? bin2str(hidden2bin(unwrapped))
		: bin2str(hidden2bin(pub));

	if (message.length < 2) return false;

	return message;
};

module.exports = {
	encode,
	decode,
};
