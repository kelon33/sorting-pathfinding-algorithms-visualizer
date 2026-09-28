# Sorting Algorithm Visualizer

A browser-based visualizer for classic sorting algorithms, built for anyone learning how they work. Plain HTML/CSS/JS — no build step, no dependencies, nothing to install.

## Running it

Open `index.html` in any browser. That's it.

> If you're serving the files over HTTP instead of opening the file directly (for example, via `python -m http.server`), just point your browser at `index.html` on that server.

## Features

- **Algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort
- **Play / Pause / Step** — watch it run automatically, or step through one comparison at a time
- **Speed slider** — control how fast steps play
- **Array size slider** — change how many bars are sorted
- **New Array** — generate a fresh random array
- Bars are color-coded as the algorithm runs: default, being compared, being swapped/overwritten, and finalized in sorted position

## How it works

Each algorithm is implemented so it can pause after every comparison or swap and show its current state — that's what makes the step-by-step animation possible. See `CLAUDE.md` for the implementation details if you want to read or extend the code.

## Files

- `index.html` — page structure and controls
- `style.css` — layout and bar colors
- `algorithms.js` — the sorting algorithms
- `visualizer.js` — rendering and playback logic
