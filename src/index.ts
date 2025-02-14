#!/usr/bin/env bun
/**
 * CLI entry point for the cft (Citation to FootnoTe) tool
 */

import { readFileSync, writeFileSync } from "node:fs";
import { isMarkdownFile, isUtf8 } from "./utils";
import { convertToFootnotes } from "./converter";

/**
 * Main function that handles the conversion process
 * @param filePath Path to the Markdown file
 */
async function main(filePath: string) {
	try {
		// Validate input file
		if (!filePath) {
			console.error("Error: No input file specified");
			console.error("Usage: cft <file.md>");
			process.exit(1);
		}

		if (!isMarkdownFile(filePath)) {
			console.error("Error: Input file must be a Markdown file (.md)");
			process.exit(1);
		}

		// Read and validate file content
		const content = readFileSync(filePath);
		if (!isUtf8(content)) {
			console.error("Error: Input file must be UTF-8 encoded");
			process.exit(1);
		}

		// Convert citations to footnotes
		const text = content.toString("utf-8");
		const result = convertToFootnotes(text);

		// Write the result back to the file
		writeFileSync(filePath, result, "utf-8");
		console.log("Successfully converted citations to footnotes");
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error: ${error.message}`);
		} else {
			console.error("An unexpected error occurred");
		}
		process.exit(1);
	}
}

// Get the input file path from command line arguments
const filePath = process.argv[2];
if (filePath === undefined) {
	console.error("Error: No input file specified");
	console.error("Usage: cft <file.md>");
	process.exit(1);
}
main(filePath);
