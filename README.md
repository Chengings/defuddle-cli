# Defuddle CLI

A command‑line tool that extracts the main content from web pages using **[Defuddle](https://github.com/kepano/defuddle)**.

## Installation

### Local development (Bun)

```shell
bun install
bun run build
bun link
```

Running the commands above will:

1. Install the project’s dependencies.
2. Build the TypeScript source.
3. Link the package globally, making the `defuddle-cli` command available in the shell.

### Stand‑alone binary (Just)

If you use **[just](https://github.com/casey/just)**, you can build and install a native binary with a single command:

```sh
just install
```

This does the following:

1. Runs `bun run build-exe` to create the native `defuddle-cli` binary.
2. Copies the binary to `/usr/local/bin/defuddle-cli` and sets the appropriate executable permissions.

**Note:** The `just install` target requires `sudo` privileges because it writes to `/usr/local/bin`.

## Usage

```shell
defuddle-cli [options] <url>
```

When you are still working from the source tree (i.e., before linking), invoke the script with Bun:

```shell
bun defuddle-cli.ts [options] <url>
```

### Options

| Flag | Alias | Description |
|------|-------|-------------|
| `-h` | `--help` | Show the help message and exit. |
| `--html` | – | Output the extracted content as HTML (default is Markdown). |
| `-d` | `--debug` | Enable debug mode (extra logging). |
| `-q` | `--quiet` | Quiet mode – suppress error messages. |
| `-o` | `--output FILE` | Write the result to *FILE* instead of `stdout`. |

## Examples

Extract the main content as **Markdown** (default):

```sh
defuddle-cli https://example.com
```

Extract the content as **HTML**:

```sh
defuddle-cli --html https://example.com
```

Suppress error output and save the result to a file:

```sh
defuddle-cli -q -o content.md https://example.com
```

Run the script directly with Bun (useful while developing):

```sh
bun defuddle-cli.ts https://example.com
```
