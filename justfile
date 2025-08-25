# https://just.systems

# Build and install standalone binary
install:
    bun install
    bun run build-exe
    sudo install -m 755 ./dist/defuddle-cli /usr/local/bin/defuddle-cli
