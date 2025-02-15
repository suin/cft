import { expect, test, describe } from "bun:test";
import {
	findInlineCitations,
	findExistingFootnotes,
	hasFootnotesSection,
	getFootnotesInsertPosition,
	createFootnotesSection,
} from "./parser";

describe("parser", () => {
	describe("findInlineCitations", () => {
		test("should find single citation", () => {
			const text = "Text with ([Title](https://example.com)) citation";
			const citations = findInlineCitations(text);
			expect(citations).toHaveLength(1);
			expect(citations[0]).toEqual({
				fullMatch: "([Title](https://example.com))",
				title: "Title",
				url: "https://example.com",
				start: text.indexOf("(["),
				end: text.indexOf("))") + 2,
			});
		});

		test("should find multiple citations", () => {
			const text =
				"First ([One](https://example.com/1)) and second ([Two](https://example.com/2))";
			const citations = findInlineCitations(text);
			expect(citations).toHaveLength(2);
		});

		test("should ignore invalid URLs", () => {
			const text = "Invalid ([Title](not-a-url)) citation";
			const citations = findInlineCitations(text);
			expect(citations).toHaveLength(0);
		});

		test("should find citation with newline in title", () => {
			const text =
				"Text with ([Title\nContinued](https://example.com)) citation";
			const citations = findInlineCitations(text);
			expect(citations).toHaveLength(1);
			expect(citations[0]).toEqual({
				fullMatch: "([Title\nContinued](https://example.com))",
				title: "Title Continued",
				url: "https://example.com",
				start: text.indexOf("(["),
				end: text.indexOf("))") + 2,
			});
		});
	});

	describe("findExistingFootnotes", () => {
		test("should find single footnote", () => {
			const text = "[^example.com-1]: [Title](https://example.com)";
			const footnotes = findExistingFootnotes(text);
			expect(footnotes).toHaveLength(1);
			expect(footnotes[0]).toEqual({
				id: "[^example.com-1]",
				title: "Title",
				url: "https://example.com",
			});
		});

		test("should find multiple footnotes", () => {
			const text = `
[^example.com-1]: [One](https://example.com/1)
[^example.com-2]: [Two](https://example.com/2)
			`;
			const footnotes = findExistingFootnotes(text);
			expect(footnotes).toHaveLength(2);
		});

		test("should find footnotes with blockquotes", () => {
			const text = `
[^example.com-1]: [Title](https://example.com#:~:text=Quote) <blockquote>Quoted text</blockquote>
[^example.com-2]: [Another](https://example.com/page)
			`;
			const footnotes = findExistingFootnotes(text);
			expect(footnotes).toHaveLength(2);
			expect(footnotes[0]).toEqual({
				id: "[^example.com-1]",
				title: "Title",
				url: "https://example.com#:~:text=Quote",
			});
		});

		test("should ignore invalid URLs", () => {
			const text = "[^example-1]: [Title](not-a-url)";
			const footnotes = findExistingFootnotes(text);
			expect(footnotes).toHaveLength(0);
		});
	});

	describe("hasFootnotesSection", () => {
		test("should return true when section exists", () => {
			const text = `
Some text
<!-- footernotes:begin -->
[^1]: Note
<!-- footernotes:end -->
			`;
			expect(hasFootnotesSection(text)).toBe(true);
		});

		test("should return false when section does not exist", () => {
			const text = "Some text without footnotes section";
			expect(hasFootnotesSection(text)).toBe(false);
		});
	});

	describe("getFootnotesInsertPosition", () => {
		test("should return position after begin marker", () => {
			const text = "<!-- footernotes:begin -->content<!-- footernotes:end -->";
			const position = getFootnotesInsertPosition(text);
			expect(position).toBe("<!-- footernotes:begin -->".length);
		});

		test("should return end of text when no section exists", () => {
			const text = "Some text";
			const position = getFootnotesInsertPosition(text);
			expect(position).toBe(text.length);
		});
	});

	describe("createFootnotesSection", () => {
		test("should create properly formatted section", () => {
			const footnotes = [
				{
					id: "[^example.com-1]",
					title: "Title",
					url: "https://example.com",
				},
			];
			const section = createFootnotesSection(footnotes);
			expect(section).toContain("<!-- footernotes:begin -->");
			expect(section).toContain(
				"[^example.com-1]: [Title](https://example.com)",
			);
			expect(section).toContain("<!-- footernotes:end -->");
		});

		test("should handle multiple footnotes", () => {
			const footnotes = [
				{
					id: "[^example.com-1]",
					title: "One",
					url: "https://example.com/1",
				},
				{
					id: "[^example.com-2]",
					title: "Two",
					url: "https://example.com/2",
				},
			];
			const section = createFootnotesSection(footnotes);
			expect(section).toContain(
				"[^example.com-1]: [One](https://example.com/1)",
			);
			expect(section).toContain(
				"[^example.com-2]: [Two](https://example.com/2)",
			);
		});

		test("should handle footnotes with text fragments", () => {
			const footnotes = [
				{
					id: "[^example.com-1]",
					title: "Title",
					url: "https://example.com#:~:text=Hello%20World",
				},
			];
			const section = createFootnotesSection(footnotes);
			expect(section).toContain(
				"[^example.com-1]: [Title](https://example.com#:~:text=Hello%20World) <blockquote>Hello World</blockquote>",
			);
		});

		test("should handle footnotes with HTML in text fragments", () => {
			const footnotes = [
				{
					id: "[^example.com-1]",
					title: "Title",
					url: "https://example.com#:~:text=Text%20with%20<strong>HTML</strong>",
				},
			];
			const section = createFootnotesSection(footnotes);
			expect(section).toContain(
				"[^example.com-1]: [Title](https://example.com#:~:text=Text%20with%20<strong>HTML</strong>) <blockquote>Text with &lt;strong&gt;HTML&lt;/strong&gt;</blockquote>",
			);
		});
	});
});
