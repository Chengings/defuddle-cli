#!/usr/bin/env bun

import { JSDOM } from "jsdom";

// Import defuddle dynamically since it needs to be imported as ES module
const { Defuddle } = await import("defuddle/node");

interface CliOptions {
  url?: string;
  html?: boolean;
  debug?: boolean;
  output?: string;
  help?: boolean;
  quiet?: boolean;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "-h":
      case "--help":
        options.help = true;
        break;
      case "--html":
        options.html = true;
        break;
      case "-d":
      case "--debug":
        options.debug = true;
        break;
      case "-q":
      case "--quiet":
        options.quiet = true;
        break;
      case "-o":
      case "--output":
        if (i + 1 < args.length) {
          options.output = args[i + 1];
          i++;
        }
        break;
      default:
        if (!arg.startsWith("-") && !options.url) {
          options.url = arg;
        }
        break;
    }
  }

  return options;
}

function logError(message: string, options: CliOptions) {
  if (!options.quiet) {
    console.error(message);
  }
}

function showHelp() {
  console.log(`
Defuddle CLI - Extract main content from web pages

Usage: bun defuddle-cli.ts [options] <url>

Options:
  -h, --help         Show this help message
  --html             Output as HTML (default is markdown)
  -d, --debug        Enable debug mode
  -q, --quiet        Quiet mode (suppress error messages)
  -o, --output FILE  Output to file instead of stdout

Examples:
  bun defuddle-cli.ts https://example.com/article
  bun defuddle-cli.ts --html https://example.com/article
  bun defuddle-cli.ts -q -o content.md https://example.com/article
  defuddle-cli https://example.com/article
`);
}

async function extractContent(url: string, options: CliOptions) {
  try {
    logError(`Fetching content from: ${url}`, options);

    const dom = await JSDOM.fromURL(url);

    const defuddleOptions = {
      debug: options.debug || false,
      markdown: !options.html, // Default to markdown unless --html is specified
      url,
    };

    const result = await Defuddle(dom, url, defuddleOptions);

    if (options.debug) {
      logError(`Parsed in ${result.parseTime}ms`, options);
      logError(`Word count: ${result.wordCount}`, options);
      logError(`Title: ${result.title}`, options);
      logError(`Author: ${result.author || "Unknown"}`, options);
      logError("---", options);
    }

    const content = result.content;

    if (options.output) {
      await Bun.write(options.output, content);
      logError(`Content saved to: ${options.output}`, options);
    } else {
      console.log(content);
    }
  } catch (error) {
    logError(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      options,
    );
    process.exit(1);
  }
}

async function main() {
  const options = parseArgs();

  if (options.help || !options.url) {
    showHelp();
    process.exit(options.help ? 0 : 1);
  }

  await extractContent(options.url, options);
}

// Check if URL is valid
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

// Validate URL before processing
const options = parseArgs();
if (options.url && !isValidUrl(options.url)) {
  if (!options.quiet) {
    console.error(`Error: Invalid URL format: ${options.url}`);
  }
  process.exit(1);
}

main().catch(console.error);
