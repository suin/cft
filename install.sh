#!/bin/sh
set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Default installation directory
INSTALL_DIR="/usr/local/bin"

# Print error message and exit
error() {
    echo "${RED}Error: $1${NC}" >&2
    exit 1
}

# Print info message
info() {
    echo "${GREEN}$1${NC}"
}

# Print warning message
warn() {
    echo "${YELLOW}Warning: $1${NC}"
}

# Detect OS and architecture
detect_platform() {
    OS="$(uname -s)"
    ARCH="$(uname -m)"
    
    case "$OS" in
        Linux)
            case "$ARCH" in
                x86_64)
                    # Check for older CPU compatibility
                    if grep -q "avx2" /proc/cpuinfo; then
                        PLATFORM="linux"
                    else
                        PLATFORM="linux-baseline"
                    fi
                    ;;
                *)
                    error "Unsupported Linux architecture: $ARCH"
                    ;;
            esac
            ;;
        Darwin)
            case "$ARCH" in
                x86_64)
                    PLATFORM="macos"
                    ;;
                arm64)
                    PLATFORM="macos-arm64"
                    ;;
                *)
                    error "Unsupported macOS architecture: $ARCH"
                    ;;
            esac
            ;;
        *)
            error "Unsupported operating system: $OS"
            ;;
    esac
}

# Get the latest release version
get_latest_version() {
    LATEST_RELEASE=$(curl -s https://api.github.com/repos/suin/cft/releases/latest)
    if [ $? -ne 0 ]; then
        error "Failed to fetch latest release information"
    fi
    
    VERSION=$(echo "$LATEST_RELEASE" | grep -o '"tag_name": "v[^"]*"' | cut -d'"' -f4)
    if [ -z "$VERSION" ]; then
        error "Failed to determine latest version"
    fi
}

# Download and install the binary
install_binary() {
    BINARY_URL="https://github.com/suin/cft/releases/download/${VERSION}/cft-${PLATFORM}"
    TMP_DIR=$(mktemp -d)
    TMP_FILE="${TMP_DIR}/cft"
    
    info "Downloading cft ${VERSION} for ${PLATFORM}..."
    if ! curl -fsSL "$BINARY_URL" -o "$TMP_FILE"; then
        rm -rf "$TMP_DIR"
        error "Failed to download binary"
    fi
    
    info "Installing to ${INSTALL_DIR}..."
    chmod +x "$TMP_FILE"
    
    # Use sudo if needed
    if [ -w "$INSTALL_DIR" ]; then
        mv "$TMP_FILE" "${INSTALL_DIR}/cft"
    else
        if ! command -v sudo >/dev/null 2>&1; then
            error "${INSTALL_DIR} is not writable and sudo is not available"
        fi
        sudo mv "$TMP_FILE" "${INSTALL_DIR}/cft"
    fi
    
    rm -rf "$TMP_DIR"
}

# Verify installation
verify_installation() {
    if ! command -v cft >/dev/null 2>&1; then
        warn "Installation completed, but cft is not in PATH"
        info "You may need to add ${INSTALL_DIR} to your PATH"
        return
    fi
    
    info "Successfully installed cft ${VERSION}"
    info "Run 'cft --help' to get started"
}

# Main installation process
main() {
    info "Installing cft..."
    detect_platform
    get_latest_version
    install_binary
    verify_installation
}

main
