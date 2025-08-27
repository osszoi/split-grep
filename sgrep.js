#!/usr/bin/env node

const fs = require('fs');

function parseArgs() {
    const args = process.argv.slice(2);
    let regex = null;
    let searchQuery = null;
    
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-r' && i + 1 < args.length) {
            regex = args[i + 1];
            i++;
        } else if (args[i] === '-s' && i + 1 < args.length) {
            searchQuery = args[i + 1];
            i++;
        }
    }
    
    if (!regex || !searchQuery) {
        console.error('Usage: sgrep -r <regex> -s <search_query>');
        process.exit(1);
    }
    
    return { regex, searchQuery };
}

function readStdin() {
    return new Promise((resolve, reject) => {
        let input = '';
        process.stdin.setEncoding('utf8');
        
        process.stdin.on('data', (chunk) => {
            input += chunk;
        });
        
        process.stdin.on('end', () => {
            resolve(input);
        });
        
        process.stdin.on('error', reject);
    });
}

async function main() {
    try {
        const { regex, searchQuery } = parseArgs();
        const input = await readStdin();
        
        if (!input.trim()) {
            return;
        }
        
        // Create regex object for splitting
        const splitRegex = new RegExp(regex);
        
        // Split the input by the regex
        const items = input.split(splitRegex);
        
        // Filter items that contain the search query (case insensitive)
        const searchLower = searchQuery.toLowerCase();
        const matchingItems = items.filter(item => 
            item.toLowerCase().includes(searchLower)
        );
        
        // Output matching items
        // For items after the first split, we need to add back the split pattern
        // (except for the first item which doesn't need it)
        for (let i = 0; i < matchingItems.length; i++) {
            const item = matchingItems[i];
            // Add the split pattern back if this item was split
            // (we need to check if this item was originally after a split)
            if (item.trim()) {
                // Find if this item needs the regex pattern prepended
                const originalIndex = items.indexOf(item);
                if (originalIndex > 0) {
                    // Add back the pattern that was used to split
                    const pattern = regex.replace(/\\n/g, '\n').replace(/\\\[/g, '[');
                    console.log(pattern + item);
                } else {
                    console.log(item);
                }
            }
        }
        
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();