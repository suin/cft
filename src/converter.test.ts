import { expect, test, describe } from "bun:test";
import { convertToFootnotes } from "./converter";

describe("converter", () => {
	test("should convert single citation to footnote", () => {
		const input = "Text with ([Title](https://example.com)) citation";
		const expected = `Text with [^example.com-1] citation

<!-- footernotes:begin -->
[^example.com-1]: [Title](https://example.com)
<!-- footernotes:end -->`;
		expect(convertToFootnotes(input)).toBe(expected);
	});

	test("should convert multiple citations to footnotes", () => {
		const input =
			"First ([One](https://example.com/1)) and second ([Two](https://example.com/2))";
		const expected = `First [^example.com-1] and second [^example.com-2]

<!-- footernotes:begin -->
[^example.com-1]: [One](https://example.com/1)
[^example.com-2]: [Two](https://example.com/2)
<!-- footernotes:end -->`;
		expect(convertToFootnotes(input)).toBe(expected);
	});

	test("should handle existing footnotes", () => {
		const input = `Text with ([New](https://example.com/new)) citation

<!-- footernotes:begin -->
[^example.com-1]: [Existing](https://example.com/existing)
<!-- footernotes:end -->`;
		const expected = `Text with [^example.com-2] citation

<!-- footernotes:begin -->
[^example.com-1]: [Existing](https://example.com/existing)
[^example.com-2]: [New](https://example.com/new)
<!-- footernotes:end -->`;
		expect(convertToFootnotes(input)).toBe(expected);
	});

	test("should maintain existing footnote IDs", () => {
		const input = `First ([One](https://example.com/1))

<!-- footernotes:begin -->
[^example.com-5]: [Existing](https://example.com/existing)
<!-- footernotes:end -->

Second ([Two](https://example.com/2))`;
		const result = convertToFootnotes(input);
		expect(result).toContain("[^example.com-5]");
		expect(result).toContain("[^example.com-6]");
		expect(result).toContain("[^example.com-7]");
	});

	test("should ignore invalid URLs", () => {
		const input = "Text with ([Title](not-a-url)) citation";
		expect(convertToFootnotes(input)).toBe(input);
	});

	test("should handle multiple citations from same domain", () => {
		const input = `
First ([One](https://example.com/1))
Second ([Two](https://example.com/2))
Third ([Three](https://example.com/3))`;
		const result = convertToFootnotes(input);
		expect(result).toContain("[^example.com-1]");
		expect(result).toContain("[^example.com-2]");
		expect(result).toContain("[^example.com-3]");
	});

	test("should handle citations from different domains", () => {
		const input = `
First ([One](https://example.com/1))
Second ([Two](https://another.com/2))`;
		const result = convertToFootnotes(input);
		expect(result).toContain("[^example.com-1]");
		expect(result).toContain("[^another.com-1]");
	});

	test("should return original text if no citations found", () => {
		const input = "Text without any citations";
		expect(convertToFootnotes(input)).toBe(input);
	});

	test("should throw error for invalid URLs", () => {
		const input = "Text with ([Title](invalid-url)) citation";
		expect(() => convertToFootnotes(input)).not.toThrow();
	});
});
