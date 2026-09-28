# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A browser-based sorting algorithm visualizer aimed at a novice programmer. Plain HTML/CSS/JS, no build step, no dependencies, no framework.

## Running it

Open `index.html` directly in a browser (file:// works — no server required). There is no build, lint, or test command; this is intentional for a project meant to be readable and runnable with zero tooling.

Note: some browser automation tools (e.g. headless Chrome extensions) refuse `file://` URLs. If you need to drive the page programmatically, serve the directory over HTTP first (e.g. `python -m http.server`) and navigate to that instead.

## Architecture

Two scripts, loaded in order via `<script>` tags (no bundler, no modules):

- **`algorithms.js`** — one **generator function** (`function*`) per sort: `bubbleSort`, `selectionSort`, `insertionSort`, `mergeSort`, `quickSort`. Each takes an array and `yield`s a step object instead of returning a result:
  ```js
  { array, type: 'compare' | 'swap' | 'overwrite' | 'sorted', indices: [...] }
  ```
  `array` is a full snapshot at that point; `indices` says which bar(s) the step highlights. This generator/yield-per-operation pattern is the core design decision of the whole project — it decouples *what the algorithm does* from *how fast it's shown*, and lets each algorithm read like a near-textbook implementation. `mergeSort`/`quickSort` use `yield*` to delegate into recursive helper generators (`mergeSortRange`/`merge`, `quickSortRange`/`partition`).

  A `'sorted'` step marks indices whose final position is now permanent. This is only emitted where it's actually true (e.g. bubble/selection sort's finalized position each pass, quicksort's pivot after partition) — insertion sort and merge sort only emit it once, for the whole array, at the very end, since their intermediate writes aren't final.

- **`visualizer.js`** — everything else, driven by a single `state` object:
  - array generation (`randomArray`, sized from the size slider)
  - `render(array, currentStep)` — rebuilds `#bars` from scratch each call. A bar gets its highlight class from `currentStep` if it's one of the step's `indices`, else from the cumulative `state.sortedIndices` set (so earlier `'sorted'` markers persist visually across later steps).
  - playback controller — `state.generator` holds the in-progress generator; `advance()` pulls one step; `play()`/`pause()` schedule/cancel `advance()` on a `setTimeout` loop, with delay derived from the speed slider (`speedToDelayMs`); `step` button calls `pause()` then `advance()` once.
  - Changing algorithm or array size/randomizing always resets `state.generator` to `null` and clears `state.sortedIndices` — the next `advance()` call lazily creates a fresh generator via `resetGenerator()`. There's no code path that mixes generator state across algorithm switches.

## Adding a new algorithm

1. Write a new generator in `algorithms.js` that yields the same step shape as the existing ones.
2. Register it in the `ALGORITHMS` map in `visualizer.js` (key, display `name`, `fn`, one-sentence `description`) — the dropdown and description panel are built from this map, nothing else needs to change.

## Known pitfall: percentage heights need an explicit parent height

Bars in `style.css` are sized with `height: X%`. Percentage heights only resolve against a parent that has an *explicit* height — `min-height` doesn't count, even though the box visually has a height. `#bars` must keep a fixed `height` (currently `420px`), not `min-height`, or every bar silently collapses to `0` and the chart renders empty with no console error. This bit us once already; watch for it if the layout is reworked to be more responsive.

## Verification

No automated tests, linter, or CI — verification is manual, in an actual browser (open the file, or serve it and drive it with browser automation; see the `file://` note above). When changing rendering or playback logic, exercise: bars appearing on load, all 5 algorithms via the dropdown (description text updates, animation runs to a fully sorted/green state), Step in isolation, Pause mid-sort, and both sliders — and check the browser console for errors, since a broken render can fail silently (see the pitfall above).

## Repository

Public GitHub repo: https://github.com/kelon33/sorting-pathfinding-algorithms-visualizer (remote `origin`, branch `master`). Git identity is configured locally (`kelon33`, `kelon33@gmail.com`). Commit history is kept as a small number of clean, logically-grouped commits (e.g. "add the app" separate from "add docs") rather than one per file or per edit — follow that convention for new work rather than committing every small change individually.

The repo name references "pathfinding" as well as sorting — no pathfinding visualizer exists yet or has been scoped. Don't start building one without the user asking.
