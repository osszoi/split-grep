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
        
        // Use split with capturing groups to preserve the delimiters
        const splitRegex = new RegExp(`(${regex})`, 'gm');
        const parts = input.split(splitRegex);
        
        // Reconstruct segments by combining parts back together
        const segments = [];
        let currentSegment = '';
        
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            
            // Check if this part matches the split regex
            const testRegex = new RegExp(regex, 'gm');
            if (testRegex.test(part)) {
                // This is a delimiter - start a new segment if we have content
                if (currentSegment.trim()) {
                    segments.push(currentSegment.trim());
                }
                // Start new segment with just the captured character (skip the \n)
                const capturedChar = part.replace(/^\n/, '');
                currentSegment = capturedChar;
            } else {
                // This is content - add to current segment
                currentSegment += part;
            }
        }
        
        // Add the last segment
        if (currentSegment.trim()) {
            segments.push(currentSegment.trim());
        }
        
        // Filter segments that contain the search query (case insensitive)
        const searchLower = searchQuery.toLowerCase();
        const matchingSegments = segments.filter(segment => 
            segment.toLowerCase().includes(searchLower)
        );
        
        // Output matching segments
        matchingSegments.forEach(segment => {
            console.log(segment);
        });
        
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();