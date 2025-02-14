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

/**
 * Extracts and decodes text fragment from URL
 * @param url URL containing text fragment
 * @returns Decoded text fragment or null if not found
 */
export function extractTextFragment(url: string): string | null {
	try {
		const urlObj = new URL(url);
		// hashは常に文字列だが、TypeScriptの型定義を満たすために空文字列をデフォルト値として使用
		const hash = urlObj.hash || "";
		if (!hash.startsWith("#:~:text=")) {
			return null;
		}
		const encodedText = hash.slice("#:~:text=".length);
		const decodedText = decodeURIComponent(encodedText);
		return escapeHtml(decodedText);
	} catch {
		return null;
	}
}

/**
 * Converts newlines in text to <br> tags
 * @param text Text to process
 * @returns Text with newlines converted to <br> tags
 */
export function convertNewlinesToBrTags(text: string): string {
	return text.replace(/\n/g, "<br>");
}

/**
 * Creates a blockquote with the given text
 * @param text Text to wrap in blockquote
 * @returns Text wrapped in blockquote tags with newlines converted to <br>
 */
/**
 * Escapes HTML special characters in text
 * @param text Text to escape
 * @returns Escaped text with HTML entities
 */
export function escapeHtml(text: string): string {
	const htmlEntities: { [key: string]: string } = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#39;",
	};
	return text.replace(/[&<>"']/g, (char) => htmlEntities[char] as string);
}

export function createBlockquote(text: string): string {
	const processedText = convertNewlinesToBrTags(escapeHtml(text));
	return `<blockquote>${processedText}</blockquote>`;
}
