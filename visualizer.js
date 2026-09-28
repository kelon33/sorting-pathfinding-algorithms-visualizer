const ALGORITHMS = {
  bubble: {
    name: 'Bubble Sort',
    fn: bubbleSort,
    description: 'Repeatedly steps through the array, swapping adjacent elements that are out of order. O(n²) comparisons.',
  },
  selection: {
    name: 'Selection Sort',
    fn: selectionSort,
    description: 'Finds the smallest remaining element each pass and swaps it into place. O(n²) comparisons.',
  },
  insertion: {
    name: 'Insertion Sort',
    fn: insertionSort,
    description: 'Builds a sorted region on the left by inserting each new element where it belongs. O(n²) worst case.',
  },
  merge: {
    name: 'Merge Sort',
    fn: mergeSort,
    description: 'Splits the array in half, sorts each half, then merges them back together. O(n log n).',
  },
  quick: {
    name: 'Quick Sort',
    fn: quickSort,
    description: 'Partitions the array around a pivot so smaller values end up left of it, then recurses. O(n log n) average.',
  },
};

const els = {
  algorithm: document.getElementById('algorithm'),
  arraySize: document.getElementById('arraySize'),
  arraySizeValue: document.getElementById('arraySizeValue'),
  speed: document.getElementById('speed'),
  randomize: document.getElementById('randomize'),
  step: document.getElementById('step'),
  play: document.getElementById('play'),
  description: document.getElementById('description'),
  bars: document.getElementById('bars'),
};

const state = {
  array: [],
  generator: null,
  timer: null,
  playing: false,
  sortedIndices: new Set(),
};

function populateAlgorithmSelect() {
  for (const [key, { name }] of Object.entries(ALGORITHMS)) {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = name;
    els.algorithm.appendChild(option);
  }
}

function randomArray(size) {
  return Array.from({ length: size }, () => 5 + Math.floor(Math.random() * 295));
}

function speedToDelayMs() {
  // Slider is 1 (slow) to 100 (fast); map to a millisecond delay per step.
  const speed = Number(els.speed.value);
  return 510 - speed * 5;
}

function render(array, currentStep) {
  els.bars.innerHTML = '';
  const max = Math.max(...array, 1);
  array.forEach((value, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${(value / max) * 100}%`;

    if (currentStep && currentStep.type !== 'sorted' && currentStep.indices.includes(i)) {
      bar.classList.add(currentStep.type);
    } else if (state.sortedIndices.has(i)) {
      bar.classList.add('sorted');
    }

    els.bars.appendChild(bar);
  });
}

function resetGenerator() {
  const algorithm = ALGORITHMS[els.algorithm.value];
  state.generator = algorithm.fn(state.array);
  state.sortedIndices = new Set();
}

function newArray() {
  pause();
  state.array = randomArray(Number(els.arraySize.value));
  state.generator = null;
  state.sortedIndices = new Set();
  render(state.array, null);
}

function advance() {
  if (!state.generator) resetGenerator();
  const { value: stepObj, done } = state.generator.next();
  if (done) {
    return true;
  }
  if (stepObj.type === 'sorted') {
    stepObj.indices.forEach((i) => state.sortedIndices.add(i));
  }
  state.array = stepObj.array;
  render(state.array, stepObj);
  return false;
}

function updatePlayButton() {
  els.play.textContent = state.playing ? 'Pause' : 'Play';
}

function pause() {
  state.playing = false;
  if (state.timer) {
    clearTimeout(state.timer);
    state.timer = null;
  }
  updatePlayButton();
}

function scheduleNext() {
  if (!state.playing) return;
  const finished = advance();
  if (finished) {
    pause();
    return;
  }
  state.timer = setTimeout(scheduleNext, speedToDelayMs());
}

function play() {
  state.playing = true;
  updatePlayButton();
  scheduleNext();
}

function updateDescription() {
  els.description.textContent = ALGORITHMS[els.algorithm.value].description;
}

populateAlgorithmSelect();
els.arraySizeValue.textContent = els.arraySize.value;
state.array = randomArray(Number(els.arraySize.value));
render(state.array, null);
updateDescription();

els.randomize.addEventListener('click', newArray);

els.step.addEventListener('click', () => {
  pause();
  advance();
});

els.play.addEventListener('click', () => {
  if (state.playing) {
    pause();
  } else {
    play();
  }
});

els.algorithm.addEventListener('change', () => {
  pause();
  state.generator = null;
  state.sortedIndices = new Set();
  render(state.array, null);
  updateDescription();
});

els.arraySize.addEventListener('input', () => {
  els.arraySizeValue.textContent = els.arraySize.value;
  newArray();
});
