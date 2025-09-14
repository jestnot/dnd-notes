// quartz/util/fileCache.ts
import * as fs from "fs";
import * as path from "path";

let sortSpecLinesCache: string[] | null = null;

export function readSortSpecLines(): string[] {
  if (sortSpecLinesCache !== null) {
    console.log("Using cached SortSpec lines:", sortSpecLinesCache);
    return sortSpecLinesCache;
  }

  const repoRoot = process.cwd(); // Run quartz build from project root
  const sortSpecPath = path.resolve(repoRoot, "content", "sortspec.md");

  if (!fs.existsSync(sortSpecPath)) {
    console.warn(`SortSpec file not found at ${sortSpecPath}`);
    sortSpecLinesCache = [];
    return sortSpecLinesCache;
  }

  console.log(`Reading SortSpec file at: ${sortSpecPath}`);

  const fileContents = fs.readFileSync(sortSpecPath, "utf-8");

  // Filter out empty lines, YAML frontmatter, comments, and key-value pairs
  sortSpecLinesCache = fileContents
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => 
      line.length > 0 &&       // ignore empty
      !line.startsWith("//") && // ignore comments
      line !== "---"            // ignore frontmatter delimiters
    );

  console.log("SortSpec lines after filtering:", sortSpecLinesCache);

  return sortSpecLinesCache;
}