/**
 * Parser module for handling Markdown content
 */

import { isValidUrl, extractTextFragment } from "./utils";

/**
 * Represents a citation found in the text
 */
interface Citation {
	/** The full match including brackets */
	fullMatch: string;
	/** Citation title */
	title: string;
	/** Citation URL */
	url: string;
	/** Start position in text */
	start: number;
	/** End position in text */
	end: number;
}

/**
 * Represents an existing footnote in the text
 */
interface Footnote {
	/** Footnote ID */
	id: string;
	/** Citation title */
	title: string;
	/** Citation URL */
	url: string;
}

/**
 * Finds all inline citations in the given text
 * @param text Markdown text to parse
 * @returns Array of Citation objects
 */
export function findInlineCitations(text: string): Citation[] {
	const citations: Citation[] = [];
	const regex = /\(\[(.*?)\]\((.*?)\)\)/gs;
	let match: RegExpExecArray | null;

	while (true) {
		match = regex.exec(text);
		if (!match) break;
		const [fullMatch, title, url] = match;
		if (title && url && isValidUrl(url)) {
			citations.push({
				fullMatch,
				title: title.replace(/\n/g, " "),
				url,
				start: match.index,
				end: match.index + fullMatch.length,
			});
		}
	}

	return citations;
}

/**
 * Finds all existing footnotes in the text
 * @param text Markdown text to parse
 * @returns Array of Footnote objects
 */
export function findExistingFootnotes(text: string): Footnote[] {
	const footnotes: Footnote[] = [];
	const regex =
		/\[\^(.*?)\]:\s*\[(.*?)\]\((.*?)\)(?:\s*<blockquote>.*?<\/blockquote>)?/g;
	let match: RegExpExecArray | null;

	while (true) {
		match = regex.exec(text);
		if (!match) break;
		const [, id, title, url] = match;
		if (id && title && url && isValidUrl(url)) {
			footnotes.push({
				id: `[^${id}]`,
				title,
				url,
			});
		}
	}

	return footnotes;
}

/**
 * Checks if the text contains a footnotes section
 * @param text Markdown text to check
 * @returns boolean indicating if footnotes section exists
 */
export function hasFootnotesSection(text: string): boolean {
	return (
		text.includes("<!-- footernotes:begin -->") &&
		text.includes("<!-- footernotes:end -->")
	);
}

/**
 * Gets the position to insert footnotes section
 * If section exists, returns the position after begin marker
 * If no section exists, returns the end of the file
 * @param text Markdown text to analyze
 * @returns Position to insert footnotes
 */
export function getFootnotesInsertPosition(text: string): number {
	const beginMarker = "<!-- footernotes:begin -->";
	const beginIndex = text.indexOf(beginMarker);

	if (beginIndex !== -1) {
		return beginIndex + beginMarker.length;
	}

	return text.length;
}

/**
 * Creates a footnotes section with the given footnotes
 * @param footnotes Array of footnotes to include
 * @returns Formatted footnotes section
 */
export function createFootnotesSection(footnotes: Footnote[]): string {
	const content = footnotes
		.map((fn) => {
			const fragment = extractTextFragment(fn.url);
			return fragment
				? `${fn.id}: [${fn.title}](${fn.url}) <blockquote>${fragment}</blockquote>`
				: `${fn.id}: [${fn.title}](${fn.url})`;
		})
		.join("\n");

	return `<!-- footernotes:begin -->
${content}
<!-- footernotes:end -->`;
}
