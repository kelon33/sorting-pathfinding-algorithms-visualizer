// Each sort below is a generator function: instead of returning a fully
// sorted array, it yields one "step" object per comparison/swap/overwrite.
// A step looks like: { array, type, indices }
//   array   - snapshot of the array's current state
//   type    - 'compare' | 'swap' | 'overwrite' | 'sorted'
//   indices - which bar(s) the step applies to (for highlighting)
// visualizer.js pulls these steps one at a time to animate the sort.

function* bubbleSort(arr) {
  const a = arr.slice();
  const n = a.length;
  // Repeatedly walk the array, swapping neighbors that are out of order.
  // Each full pass "bubbles" the largest remaining value to the end.
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: a.slice(), type: 'compare', indices: [j, j + 1] };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield { array: a.slice(), type: 'swap', indices: [j, j + 1] };
      }
    }
    // The element that just bubbled to the end is in its final position.
    yield { array: a.slice(), type: 'sorted', indices: [n - i - 1] };
  }
  yield { array: a.slice(), type: 'sorted', indices: [0] };
}

function* selectionSort(arr) {
  const a = arr.slice();
  const n = a.length;
  // For each position, find the smallest remaining value and swap it in.
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield { array: a.slice(), type: 'compare', indices: [minIdx, j] };
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield { array: a.slice(), type: 'swap', indices: [i, minIdx] };
    }
    yield { array: a.slice(), type: 'sorted', indices: [i] };
  }
}

function* insertionSort(arr) {
  const a = arr.slice();
  const n = a.length;
  // Grow a sorted region on the left by inserting each new value into place.
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0) {
      yield { array: a.slice(), type: 'compare', indices: [j, j + 1] };
      if (a[j] > key) {
        a[j + 1] = a[j];
        yield { array: a.slice(), type: 'overwrite', indices: [j + 1] };
        j--;
      } else {
        break;
      }
    }
    a[j + 1] = key;
    yield { array: a.slice(), type: 'overwrite', indices: [j + 1] };
  }
  yield { array: a.slice(), type: 'sorted', indices: a.map((_, i) => i) };
}

function* mergeSort(arr) {
  const a = arr.slice();
  yield* mergeSortRange(a, 0, a.length - 1);
  yield { array: a.slice(), type: 'sorted', indices: a.map((_, i) => i) };
}

// Split the range in half, sort each half, then merge the two sorted halves.
function* mergeSortRange(a, lo, hi) {
  if (lo >= hi) return;
  const mid = Math.floor((lo + hi) / 2);
  yield* mergeSortRange(a, lo, mid);
  yield* mergeSortRange(a, mid + 1, hi);
  yield* merge(a, lo, mid, hi);
}

function* merge(a, lo, mid, hi) {
  const left = a.slice(lo, mid + 1);
  const right = a.slice(mid + 1, hi + 1);
  let i = 0;
  let j = 0;
  let k = lo;
  while (i < left.length && j < right.length) {
    yield { array: a.slice(), type: 'compare', indices: [lo + i, mid + 1 + j] };
    if (left[i] <= right[j]) {
      a[k] = left[i];
      i++;
    } else {
      a[k] = right[j];
      j++;
    }
    yield { array: a.slice(), type: 'overwrite', indices: [k] };
    k++;
  }
  while (i < left.length) {
    a[k] = left[i];
    i++;
    yield { array: a.slice(), type: 'overwrite', indices: [k] };
    k++;
  }
  while (j < right.length) {
    a[k] = right[j];
    j++;
    yield { array: a.slice(), type: 'overwrite', indices: [k] };
    k++;
  }
}

function* quickSort(arr) {
  const a = arr.slice();
  yield* quickSortRange(a, 0, a.length - 1);
  yield { array: a.slice(), type: 'sorted', indices: a.map((_, i) => i) };
}

// Partition around a pivot, then recurse on the two sides. The pivot lands
// in its final sorted position and is never touched again.
function* quickSortRange(a, lo, hi) {
  if (lo > hi) return;
  if (lo === hi) {
    yield { array: a.slice(), type: 'sorted', indices: [lo] };
    return;
  }
  const p = yield* partition(a, lo, hi);
  yield { array: a.slice(), type: 'sorted', indices: [p] };
  yield* quickSortRange(a, lo, p - 1);
  yield* quickSortRange(a, p + 1, hi);
}

function* partition(a, lo, hi) {
  const pivot = a[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    yield { array: a.slice(), type: 'compare', indices: [j, hi] };
    if (a[j] < pivot) {
      [a[i], a[j]] = [a[j], a[i]];
      yield { array: a.slice(), type: 'swap', indices: [i, j] };
      i++;
    }
  }
  [a[i], a[hi]] = [a[hi], a[i]];
  yield { array: a.slice(), type: 'swap', indices: [i, hi] };
  return i;
}
