# cft (Citation to FootnoTe)

A CLI tool that converts inline citations in ChatGPT Deep Research reports to footnotes for improved readability.

## Background

ChatGPT Deep Research generates Markdown reports with inline citations in the format `([Title](URL))`. This format significantly reduces readability, especially when:
- Multiple citations appear consecutively
- URLs are lengthy
- Citations break the flow of text

cft automatically processes these reports and converts inline citations to footnotes, making the content more readable.

## Installation

### Using curl (recommended)
```bash
curl -fsSL https://raw.githubusercontent.com/suin/cft/main/install.sh | sh
```
This will automatically:
- Detect your OS and architecture
- Download the appropriate binary
- Install it to `/usr/local/bin`
- Set the required permissions

### Manual Installation
Download the appropriate binary for your platform from [GitHub Releases](https://github.com/suin/cft/releases):
- Linux (x64)
- Linux (x64, older CPUs)
- macOS (x64)
- macOS (ARM64)

After downloading:
1. Make the binary executable: `chmod +x cft-*`
2. Move it to a directory in your PATH: `sudo mv cft-* /usr/local/bin/cft`

### Building from source
```bash
# Install Devbox (if not installed)
curl -fsSL https://get.jetpack.io/devbox | bash

# Clone the repository
git clone https://github.com/suin/cft.git
cd cft

# Build
devbox run build

# The binaries will be available in the dist/ directory
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

## Platform Support

- Linux x64 (modern CPUs)
- Linux x64 (baseline, for older CPUs)
- macOS x64
- macOS ARM64 (Apple Silicon)

## Development

### Requirements
- Bun
- Devbox
- VSCode (recommended)

### Setup
```bash
# Install dependencies
devbox shell
bun install
```

### Build
```bash
# Build for all platforms
devbox run build
```

### Release
```bash
# Create and push a new version tag
git tag v1.0.0
git push origin v1.0.0
```
GitHub Actions will automatically build and deploy the binaries to GitHub Releases.

## Limitations
- UTF-8 encoded files only
- Markdown (.md) files only
- http/https URLs only
