# sgrep - Split & Grep

A command-line tool that splits text by regex patterns and filters results by search queries.

## Installation

```bash
npm install -g split-grep
```

## Usage

```bash
<input> | sgrep -r <regex> -s <search_query>
```

### Options

- `-r <regex>` - Regular expression pattern to split the input text
- `-s <search_query>` - Search query to filter the split items (case-insensitive)

## Examples

### Basic Log Filtering

Given a log file with entries starting with `[WARN]` or `[ERROR]`:

```bash
cat logs.txt | sgrep -r "\n\[" -s "WARN"
```

This splits the input by newlines followed by `[`, then returns only items containing "WARN".

### Multi-line Entry Filtering

```bash
cat logs.txt | sgrep -r "\n\[" -s "someolderror"
```

Returns complete log entries (including stack traces) that contain the search term anywhere within the entry.

## How it Works

1. **Split**: The input text is split using the provided regex pattern
2. **Filter**: Each split item is searched for the query string (case-insensitive)
3. **Output**: Matching items are printed, preserving their original formatting

## Use Cases

- Parse and filter log files by log level or error messages
- Extract specific sections from structured text
- Filter multi-line records based on content anywhere in the record

## License

MIT
