// warning-label-humans - make.fun entry for
// u-0xb3e689-warning-label-for-humans-one-line-big-laugh-40e31f85.
// Node 22, standard library only. Writes the single entry line to
// /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt when set).
// The entry is a fixed string: the program is deterministic and writes
// exactly this text, no trailing newline, so the gate sees 1-160
// characters of UTF-8 and nothing else.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The entry: a safety warning label for every human being — runs on
// caffeine and spite, must not be operated before coffee, insists it
// is fine while on fire, and starts projects at 2am only to abandon
// them by Tuesday.
const ENTRY = "WARNING: Runs on caffeine and spite. Do not operate before coffee. Says 'I'm fine' while on fire. Starts projects at 2am, abandons them by Tuesday.";

// Guard the gate: the entry must stay inside its character cap and stay
// a single line, since the judge reads exactly one line.
if (ENTRY.length < 1 || ENTRY.length > 160 || !ENTRY.trim() || ENTRY.includes('\n')) {
  throw new Error(`entry is ${ENTRY.length} characters, cap is 160`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const target = join(outDir, 'entry.txt');
writeFileSync(target, ENTRY, 'utf8');

// Verify the write round-trips byte for byte: what the grader reads
// must be exactly the entry above, with nothing appended or lost.
// Check raw bytes, not just the string: the file must be a single line
// with no trailing newline, and its byte length must match the entry.
const written = readFileSync(target);
if (written.length !== Buffer.byteLength(ENTRY, 'utf8') || written[written.length - 1] === 0x0a) {
  throw new Error('entry.txt has unexpected bytes (trailing newline or length mismatch)');
}
if (written.toString('utf8') !== ENTRY) {
  throw new Error('entry.txt does not match ENTRY after writing');
}
console.log(`wrote entry.txt: ${ENTRY.length} characters, ${written.length} bytes`);
