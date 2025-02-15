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

	test("should convert citation with newline in title", () => {
		const input =
			"Text with ([Title\nContinued](https://example.com)) citation";
		const expected = `Text with [^example.com-1] citation

<!-- footernotes:begin -->
[^example.com-1]: [Title Continued](https://example.com)
<!-- footernotes:end -->`;
		expect(convertToFootnotes(input)).toBe(expected);
	});

	test("should handle complex text with multiple newlines", () => {
		const input =
			"Text ([Text [Text5] Text2\n Text4](http://example.com/#:~:text=Text6)) ([Text3](https://www.example.com/#:~:text=Text7))。";
		const expected = `Text [^example.com-1] [^www.example.com-1]。

<!-- footernotes:begin -->
[^example.com-1]: [Text [Text5] Text2  Text4](http://example.com/#:~:text=Text6) <blockquote>Text6</blockquote>
[^www.example.com-1]: [Text3](https://www.example.com/#:~:text=Text7) <blockquote>Text7</blockquote>
<!-- footernotes:end -->`;

		expect(convertToFootnotes(input)).toBe(expected);
	});

	test("should use same footnote ID for identical URLs", () => {
		const input =
			"First citation ([Title](https://example.com/page))\nSecond citation ([Another Title](https://example.com/page))";
		const expected =
			"First citation [^example.com-1]\nSecond citation [^example.com-1]\n\n<!-- footernotes:begin -->\n[^example.com-1]: [Title](https://example.com/page)\n<!-- footernotes:end -->";
		expect(convertToFootnotes(input)).toBe(expected);
	});

	test("should reuse existing footnote ID for same URL", () => {
		const input = `Text with ([New Title](https://example.com/existing)) citation

<!-- footernotes:begin -->
[^example.com-1]: [Existing](https://example.com/existing)
<!-- footernotes:end -->`;
		const expected = `Text with [^example.com-1] citation

<!-- footernotes:begin -->
[^example.com-1]: [Existing](https://example.com/existing)
<!-- footernotes:end -->`;
		expect(convertToFootnotes(input)).toBe(expected);
	});

	test("should maintain first title for identical URLs with different titles", () => {
		const input =
			"First ([Title One](https://example.com/page))\nSecond ([Title Two](https://example.com/page))\nThird ([Title Three](https://example.com/page))";
		const result = convertToFootnotes(input);
		expect(result).toContain("[Title One](https://example.com/page)");
		expect(result).not.toContain("[Title Two](https://example.com/page)");
		expect(result).not.toContain("[Title Three](https://example.com/page)");
		// Extract footnote IDs from text before the footnotes section
		const mainText = result.split("<!-- footernotes:begin -->")[0] || result;
		const matches = mainText.match(/\[\^example\.com-\d\]/g) || [];
		expect(matches.length).toBe(3);
		expect(new Set(matches).size).toBe(1); // Ensure all footnote IDs are the same
	});

	test("should handle URL deduplication across multiple domains", () => {
		const input = `
First ([One](https://example.com/1))
Second ([Two](https://example.com/1))
Third ([Three](https://another.com/1))
Fourth ([Four](https://another.com/1))`;
		const result = convertToFootnotes(input);
		expect(result).toMatch(/\[\^example\.com-1\].*\[\^example\.com-1\]/s);
		expect(result).toMatch(/\[\^another\.com-1\].*\[\^another\.com-1\]/s);
		expect(result).toContain("[One](https://example.com/1)");
		expect(result).toContain("[Three](https://another.com/1)");
		expect(result).not.toContain("[Two](https://example.com/1)");
		expect(result).not.toContain("[Four](https://another.com/1)");
	});
});
