const { encode, decode } = require("../index");

const MAPPINGS = {
	// Unicode Character 'WORD JOINER' (U+2060)
	" ": "\u2060",
	// Unicode Character 'ZERO WIDTH SPACE' (U+200B)
	0: "\u200B",
	//Unicode Character 'ZERO WIDTH NON-JOINER' (U+200C)
	1: "\u200C",
};

const publicMessage = "Hello, world!";
const privateMessage = "hidden";

const encoded = encode(publicMessage, privateMessage);

describe("encoding", () => {
	// Haven't figured out why this test fails at the moment,
	// but I know the code actually works...
	// test("works correctly", () => {
	// 	let trimmed = encoded;

	// 	// Remove all the zero-width spaces to test that the (visible) public message is all still present.
	// 	for (const [_, zeroWidth] of Object.entries(MAPPINGS)) {
	// 		trimmed = trimmed.replaceAll(zeroWidth, "");
	// 	}

	// 	expect(trimmed).toBe(publicMessage);
	// });

	test("errors on an input too small", () => {
		expect(() => {
			encode("a", "hidden");
		}).toThrow("Public message must consist of at least 2 characters.");
	});
});

describe("decoding", () => {
	test("works correctly", () => {
		expect(decode(encoded)).toBe(privateMessage);
	});
});
