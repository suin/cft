/**
 * Converter module for transforming inline citations to footnotes
 */

import {
	findInlineCitations,
	findExistingFootnotes,
	hasFootnotesSection,
	getFootnotesInsertPosition,
	createFootnotesSection,
} from "./parser";
import { extractDomain, generateFootnoteId } from "./utils";

/**
 * Represents a domain counter for generating unique footnote IDs
 */
interface DomainCounter {
	[domain: string]: number;
}

/**
 * Converts inline citations to footnotes in the given text
 * @param text Markdown text to convert
 * @returns Converted text with footnotes
 */
export function convertToFootnotes(text: string): string {
	// Find all citations and existing footnotes
	const citations = findInlineCitations(text);
	const existingFootnotes = findExistingFootnotes(text);

	if (citations.length === 0) {
		return text;
	}

	// Initialize domain counters from existing footnotes
	const domainCounters: DomainCounter = {};
	for (const footnote of existingFootnotes) {
		const domain = extractDomain(footnote.url);
		if (domain) {
			const match = footnote.id.match(/\[\^(.*?)-(\d+)\]/);
			if (match?.[2]) {
				const counter = Number.parseInt(match[2], 10);
				domainCounters[domain] = Math.max(domainCounters[domain] ?? 0, counter);
			}
		}
	}

	// Generate new footnotes
	const newFootnotes = citations.map((citation) => {
		const domain = extractDomain(citation.url);
		if (!domain) {
			throw new Error(`Invalid URL: ${citation.url}`);
		}

		domainCounters[domain] = (domainCounters[domain] || 0) + 1;
		const id = generateFootnoteId(domain, domainCounters[domain]);

		return {
			id,
			title: citation.title,
			url: citation.url,
			originalText: citation.fullMatch,
		};
	});

	// Replace citations with footnote references
	let result = text;
	for (let i = newFootnotes.length - 1; i >= 0; i--) {
		const footnote = newFootnotes[i];
		const citation = citations[i];
		if (!footnote || !citation) continue;
		result = `${result.slice(0, citation.start)}${footnote.id}${result.slice(citation.end)}`;
	}

	// Add or update footnotes section
	const allFootnotes = [...existingFootnotes, ...newFootnotes];
	const footnotesSection = createFootnotesSection(allFootnotes);

	if (hasFootnotesSection(result)) {
		const insertPosition = getFootnotesInsertPosition(result);
		const endMarkerPosition = result.indexOf("<!-- footernotes:end -->");
		result = `${result.slice(0, insertPosition)}
${allFootnotes.map((fn) => `${fn.id}: [${fn.title}](${fn.url})`).join("\n")}
${result.slice(endMarkerPosition)}`;
	} else {
		result = `${result.trim()}\n\n${footnotesSection}`;
	}

	return result;
}
