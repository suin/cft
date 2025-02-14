/**
 * Utility functions for the cft (Citation to FootnoTe) tool
 */

/**
 * Checks if the given URL is valid
 * Supports only http/https protocols
 * @param url URL to validate
 * @returns boolean indicating if the URL is valid
 */
export function isValidUrl(url: string): boolean {
	try {
		const urlObj = new URL(url);
		return urlObj.protocol === "http:" || urlObj.protocol === "https:";
	} catch {
		return false;
	}
}

/**
 * Extracts domain from a URL
 * @param url URL to extract domain from
 * @returns domain string or null if URL is invalid
 */
export function extractDomain(url: string): string | null {
	try {
		const urlObj = new URL(url);
		return urlObj.hostname;
	} catch {
		return null;
	}
}

/**
 * Checks if a file has UTF-8 encoding
 * @param content File content to check
 * @returns boolean indicating if the content is UTF-8 encoded
 */
export function isUtf8(content: Buffer): boolean {
	try {
		content.toString("utf-8");
		return true;
	} catch {
		return false;
	}
}

/**
 * Generates a footnote ID based on domain and counter
 * @param domain Domain extracted from URL
 * @param counter Sequential number for the domain
 * @returns Formatted footnote ID
 */
export function generateFootnoteId(domain: string, counter: number): string {
	return `[^${domain}-${counter}]`;
}

/**
 * Checks if a file is a Markdown file
 * @param filename Filename to check
 * @returns boolean indicating if the file is a Markdown file
 */
export function isMarkdownFile(filename: string): boolean {
	return filename.toLowerCase().endsWith(".md");
}
