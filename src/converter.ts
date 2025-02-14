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
import {
	extractDomain,
	generateFootnoteId,
	extractTextFragment,
} from "./utils";

/**
 * Represents a domain counter for generating unique footnote IDs
 */
interface DomainCounter {
	[domain: string]: number;
}

/**
 * Maps URLs to their corresponding footnote IDs
 */
interface UrlToFootnoteMap {
	[url: string]: string;
}

/**
 * Converts inline citations to footnotes in the given text
 * @param text Markdown text to convert
 * @returns Converted text with footnotes
 */
export function convertToFootnotes(text: string): string {
	// Find all citations and existing footnotes in the text
	const citations = findInlineCitations(text);
	const existingFootnotes = findExistingFootnotes(text);

	if (citations.length === 0) {
		return text;
	}

	// Initialize domain counters and URL mapping from existing footnotes
	// This maintains the counter state for generating unique footnote IDs
	const domainCounters: DomainCounter = {};
	const urlToFootnote: UrlToFootnoteMap = {};
	for (const footnote of existingFootnotes) {
		const domain = extractDomain(footnote.url);
		if (domain) {
			const match = footnote.id.match(/\[\^(.*?)-(\d+)\]/);
			if (match?.[2]) {
				const counter = Number.parseInt(match[2], 10);
				domainCounters[domain] = Math.max(domainCounters[domain] ?? 0, counter);
			}
			urlToFootnote[footnote.url] = footnote.id;
		}
	}

	// Define structure for footnotes
	interface Footnote {
		id: string;
		title: string;
		url: string;
		originalText: string;
	}

	// Track processed URLs and store first citations
	const processedUrls = new Set<string>();
	const urlToFirstCitation = new Map<
		string,
		NonNullable<(typeof citations)[0]>
	>();
	const newFootnotes: Footnote[] = [];

	// First pass: collect first citations for each unique URL
	for (const citation of citations) {
		if (!urlToFirstCitation.has(citation.url)) {
			urlToFirstCitation.set(citation.url, citation);
		}
	}

	// Second pass: generate footnotes and prepare replacements
	let result = text;

	// Generate footnote IDs for all citations
	for (const citation of citations) {
		if (!urlToFootnote[citation.url]) {
			const domain = extractDomain(citation.url);
			if (!domain) {
				throw new Error(`Invalid URL: ${citation.url}`);
			}

			domainCounters[domain] = (domainCounters[domain] || 0) + 1;
			const id = generateFootnoteId(domain, domainCounters[domain]);
			urlToFootnote[citation.url] = id;
		}
	}

	// Collect replacements for all citations
	const replacements: Array<{ start: number; end: number; id: string }> = [];
	for (const citation of citations) {
		const footnoteId = urlToFootnote[citation.url];
		if (!footnoteId) continue;

		// Only add to newFootnotes if this is the first occurrence of the URL
		if (!processedUrls.has(citation.url)) {
			const firstCitation = urlToFirstCitation.get(citation.url);
			if (firstCitation) {
				newFootnotes.push({
					id: footnoteId,
					title: firstCitation.title,
					url: citation.url,
					originalText: firstCitation.fullMatch,
				});
				processedUrls.add(citation.url);
			}
		}

		// Add replacement for this citation
		replacements.push({
			start: citation.start,
			end: citation.end,
			id: footnoteId,
		});
	}

	// Apply replacements from end to start to maintain text positions
	replacements.sort((a, b) => b.start - a.start);
	for (const { start, end, id } of replacements) {
		result = `${result.slice(0, start)}${id}${result.slice(end)}`;
	}

	// Combine existing and new footnotes, avoiding duplicates
	const allFootnotes = [...existingFootnotes];
	for (const footnote of newFootnotes) {
		if (!allFootnotes.some((f) => f.url === footnote.url)) {
			allFootnotes.push(footnote);
		}
	}
	const footnotesSection = createFootnotesSection(allFootnotes);

	// Update or create footnotes section
	if (hasFootnotesSection(result)) {
		const insertPosition = getFootnotesInsertPosition(result);
		const endMarkerPosition = result.indexOf("<!-- footernotes:end -->");
		result = `${result.slice(0, insertPosition)}
${allFootnotes
	.map((fn) => {
		const fragment = extractTextFragment(fn.url);
		return fragment
			? `${fn.id}: [${fn.title}](${fn.url}) <blockquote>${fragment}</blockquote>`
			: `${fn.id}: [${fn.title}](${fn.url})`;
	})
	.join("\n")}
${result.slice(endMarkerPosition)}`;
	} else {
		result = `${result.trim()}\n\n${footnotesSection}`;
	}

	return result;
}
