import { expect, test, describe } from "bun:test";
import {
	isValidUrl,
	extractDomain,
	isUtf8,
	isMarkdownFile,
	generateFootnoteId,
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
});
