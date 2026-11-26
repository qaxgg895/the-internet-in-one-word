// The Internet in One Word — make.fun entry
// Writes one word describing the whole internet to
// /output/entry.txt.
//
// The word: "Doomscrolling".
//
// The internet's defining modern behaviour is not searching,
// chatting, or shopping — it is the endless thumb-flick through
// bad news at 2 a.m. that nobody planned and nobody enjoys and
// everybody does anyway. "Doomscrolling" names the whole internet
// in a single verb because the feed never ends, the news never
// improves, and we never stop scrolling — and because the word
// itself is the punchline: doom plus scrolling, the product and
// the habit in one. It is funny because it is true and
// self-incriminating: every judge reading it has done exactly
// this, probably today. It needs no explanation — one word and
// the whole internet, its business model and its users, is in
// the room.

import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";

const WORD = "Doomscrolling";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 30
// characters, not only white space. Refuse to write anything that
// does not meet it, so a bad edit can never ship an invalid entry.
const chars = [...WORD];
if (chars.length < 1 || chars.length > 30) {
  throw new Error(`word is ${chars.length} characters, must be 1-30`);
}
if (WORD.trim().length === 0) {
  throw new Error("word must not be only white space");
}
// One word: no spaces, no punctuation, no line breaks.
if (/\s/.test(WORD)) {
  throw new Error("word must contain no white space");
}
if (/[^A-Za-z]/.test(WORD)) {
  throw new Error("word must be plain letters only");
}

const OUTPUT_PATH = "/output/entry.txt";

mkdirSync("/output", { recursive: true });
// Write to a temp file in the same directory and rename it into
// place, so a crash or a kill mid-write can never leave a half-written
// entry.txt behind: the gate reads either the old file or the new one,
// never a torn one.
const TEMP_PATH = "/output/.entry.txt.tmp";
writeFileSync(TEMP_PATH, WORD + "\n", "utf8");
renameSync(TEMP_PATH, OUTPUT_PATH);

// Write verification: read the file back and confirm its bytes match
// exactly what was written, so a partial or failed write is caught
// instead of silently shipping a broken entry. The output is fully
// deterministic: the same word, byte for byte, on every run.
const written = readFileSync(OUTPUT_PATH, "utf8");
if (written !== WORD + "\n") {
  throw new Error("written entry does not match the expected word");
}
