# cft (Citation to FootnoTe)

A CLI tool that converts inline citations in ChatGPT Deep Research reports to footnotes for improved readability.

## Background

ChatGPT Deep Research generates Markdown reports with inline citations in the format `([Title](URL))`. This format significantly reduces readability, especially when:
- Multiple citations appear consecutively
- URLs are lengthy
- Citations break the flow of text

cft automatically processes these reports and converts inline citations to footnotes, making the content more readable.

## Installation

```bash
# Install Bun (if not installed)
curl -fsSL https://bun.sh/install | bash

# Install cft
bun install cft
```

## Usage

```bash
cft <file.md>
```

## Example

Input:
```markdown
According to recent research ([Title](https://example.com/page)), the findings suggest...
```

Output:
```markdown
According to recent research [^example.com-1], the findings suggest...

[^example.com-1]: [Title](https://example.com/page)
```

## Limitations
- UTF-8 encoded files only
- Markdown (.md) files only
- http/https URLs only
