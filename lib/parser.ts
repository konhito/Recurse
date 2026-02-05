import { Difficulty } from "./types";

interface ParsedProblem {
    title: string;
    url: string;
    difficulty: Difficulty;
    slug: string;
    source: 'LeetCode' | 'NeetCode' | 'TakeUForward' | 'Unknown';
}

/**
 * Extracts a title-cased string from a slug.
 */
function titleFromSlug(slug: string): string {
    return slug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Parses URLs from supported DSA platforms.
 */
export async function parseProblemUrl(url: string): Promise<ParsedProblem | null> {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        let slug = "";
        let source: ParsedProblem['source'] = 'Unknown';

        // 1. LeetCode
        // https://leetcode.com/problems/two-sum/
        if (hostname.includes("leetcode.com")) {
            const parts = urlObj.pathname.split("/").filter(Boolean);
            const problemIndex = parts.indexOf("problems");
            if (problemIndex !== -1 && problemIndex + 1 < parts.length) {
                slug = parts[problemIndex + 1];
                source = 'LeetCode';
            }
        }

        // 2. NeetCode
        // https://neetcode.io/problems/maximum-subarray/question
        else if (hostname.includes("neetcode.io")) {
            const parts = urlObj.pathname.split("/").filter(Boolean);
            // Expected: ['problems', 'slug', 'question'] or similar
            const problemIndex = parts.indexOf("problems");
            if (problemIndex !== -1 && problemIndex + 1 < parts.length) {
                slug = parts[problemIndex + 1];
                source = 'NeetCode';
            }
        }

        // 3. TakeUForward
        // https://takeuforward.org/plus/dsa/problems/minimum-cost-to-cut-the-stick
        else if (hostname.includes("takeuforward.org")) {
            const parts = urlObj.pathname.split("/").filter(Boolean);
            // "problems" usually precedes the slug
            const problemIndex = parts.indexOf("problems");
            if (problemIndex !== -1 && problemIndex + 1 < parts.length) {
                slug = parts[problemIndex + 1];
                source = 'TakeUForward';
            }
        }

        if (!slug) return null;

        return {
            title: titleFromSlug(slug),
            url: urlObj.toString(),
            difficulty: 'Medium', // Default
            slug,
            source
        };

    } catch (e) {
        console.error("Failed to parse URL", e);
        return null;
    }
}
