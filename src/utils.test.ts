import { expect, test, describe } from "bun:test";
import {
	isValidUrl,
	extractDomain,
	isUtf8,
	isMarkdownFile,
	generateFootnoteId,
	extractTextFragment,
	convertNewlinesToBrTags,
	createBlockquote,
} from "./utils";

describe("utils", () => {
	describe("isValidUrl", () => {
		test("should return true for valid http URLs", () => {
			expect(isValidUrl("http://example.com")).toBe(true);
		});

		test("should return true for valid https URLs", () => {
			expect(isValidUrl("https://example.com/page")).toBe(true);
		});

		test("should return false for invalid URLs", () => {
			expect(isValidUrl("not-a-url")).toBe(false);
		});

		test("should return false for non-http(s) protocols", () => {
			expect(isValidUrl("ftp://example.com")).toBe(false);
		});
	});

	describe("extractDomain", () => {
		test("should extract domain from valid URLs", () => {
			expect(extractDomain("https://example.com/page")).toBe("example.com");
		});

		test("should return null for invalid URLs", () => {
			expect(extractDomain("not-a-url")).toBe(null);
		});
	});

	describe("isUtf8", () => {
		test("should return true for UTF-8 content", () => {
			const content = Buffer.from("Hello, 世界!");
			expect(isUtf8(content)).toBe(true);
		});
	});

	describe("isMarkdownFile", () => {
		test("should return true for .md files", () => {
			expect(isMarkdownFile("document.md")).toBe(true);
		});

		test("should return true for .MD files", () => {
			expect(isMarkdownFile("document.MD")).toBe(true);
		});

		test("should return false for non-markdown files", () => {
			expect(isMarkdownFile("document.txt")).toBe(false);
		});
	});

	describe("generateFootnoteId", () => {
		test("should generate correct footnote ID format", () => {
			expect(generateFootnoteId("example.com", 1)).toBe("[^example.com-1]");
		});
	});

	describe("extractTextFragment", () => {
		test("should extract and decode text fragment from URL", () => {
			const url = "https://example.com/page#:~:text=Hello%20World";
			expect(extractTextFragment(url)).toBe("Hello World");
		});

		test("should handle URLs without text fragment", () => {
			const url = "https://example.com/page#section1";
			expect(extractTextFragment(url)).toBe(null);
		});

		test("should handle invalid URLs", () => {
			expect(extractTextFragment("not-a-url")).toBe(null);
		});

		test("should escape HTML in text fragment", () => {
			const url =
				"https://example.com/page#:~:text=Text%20with%20<strong>HTML</strong>";
			expect(extractTextFragment(url)).toBe(
				"Text with &lt;strong&gt;HTML&lt;/strong&gt;",
			);
		});

		test("should handle multiple HTML entities", () => {
			const url = "https://example.com/page#:~:text=A%20&%20B%20<%20C%20>%20D";
			expect(extractTextFragment(url)).toBe("A &amp; B &lt; C &gt; D");
		});
	});

	describe("convertNewlinesToBrTags", () => {
		test("should convert newlines to <br> tags", () => {
			const input = "Line 1\nLine 2\nLine 3";
			expect(convertNewlinesToBrTags(input)).toBe("Line 1<br>Line 2<br>Line 3");
		});

		test("should handle text without newlines", () => {
			const input = "Single line text";
			expect(convertNewlinesToBrTags(input)).toBe("Single line text");
		});
	});

	describe("createBlockquote", () => {
		test("should create blockquote with text", () => {
			const input = "Sample text";
			expect(createBlockquote(input)).toBe(
				"<blockquote>Sample text</blockquote>",
			);
		});

		test("should handle text with newlines", () => {
			const input = "Line 1\nLine 2";
			expect(createBlockquote(input)).toBe(
				"<blockquote>Line 1<br>Line 2</blockquote>",
			);
		});
	});
});
