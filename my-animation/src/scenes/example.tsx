import {makeScene2D, Circle, Rect} from '@motion-canvas/2d';
import {ThreadGenerator, all, any, chain, createRef, delay, loop, makeRef, range, sequence, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Every object should have a reference
  const myCircle = createRef<Circle>();
  const myRect = createRef<Rect>();
  const rects: Rect[] = [];

  // Default characteristics
  view.add(
    <Circle
      ref={myCircle}
      x={-300}
      width={140}
      height={140}
      fill="#e13238"
    />,
  );

  view.add(
    <Rect
      ref={myRect}
      x={-500}
      width={100}
      height={100}
      fill="#abcdef"
    />,
  )

  // Create some rects
  view.add(
    range(5).map(i => (
      <Rect
        ref={makeRef(rects, i)}
        width={100}
        height={100}
        x={-250 + 125 * i}
        fill="#88C0D0"
        radius={10}
      />
    )),
  );

  // Animation Logic: change one parameter at a time
  yield* myCircle().fill('#e6a700', 1).to('#e13238', 1);

  // Animation logic: change multiple parameters at the same time
  yield* all(
    myCircle().position.x(300, 1).to(-300, 1),
    myCircle().fill('#e6a700', 1).to('#e13238', 1),
  );

  // Animation Logic: in a function
  yield* flicker(myCircle());

  // Remaining Examples
  yield* exAny(myCircle());
  yield* exChain(myRect());
  yield* exDelay(myRect());
  yield* exSequence(rects);
  yield* exLoop(myRect());
});

// Generator function: function that can return multiple values
function* example() {
  yield 1;
  yield 2;
  yield 3;
}

const generator = example();

console.log(generator.next().value);  // 1
console.log(generator.next().value);  // 2
console.log(generator.next().value);  // 3

// Flickering function
function* flicker(circle: Circle): ThreadGenerator {
  circle.fill('red');
  yield;
  circle.fill('blue');
  yield;
  circle.fill('red');
  yield;
}

/**
 * `any`: Run all tasks concurrently and wait for any of them to finish.
 * @param circle 
 */
function* exAny(circle: Circle): ThreadGenerator {
  // current time: 0s
  yield* any(
    circle.fill('#ff0000', 2),
    circle.opacity(1, 1),
  );
  // current time: 1s
}

/**
 * `chain`: Run tasks one after another. 
 * 
 * The reason chain exists is to make it easier to pass it to other flow functions. 
 * 
 * @param rect 
 */
function* exChain(rect: Rect): ThreadGenerator {

  yield* all(
    rect.radius(20, 3),
    chain(
      rect.fill('#ff0000', 2),
      rect.opacity(1, 1),
    ),
  );
}

/**
 * `delay`: Run given generator or callback after a specific amount of time.
 * 
 * The reason delay exists is to make it easier to pass it to other flow functions
 * 
 * @param rect 
 */
function* exDelay(rect: Rect): ThreadGenerator {
  yield* all(
    rect.opacity(1, 3),
    delay(1, rect.fill('#ff0000', 2)),
  );
}

/**
 * `sequence`: Start all tasks one after another with a constant delay between.
 * The function doesn't wait until the previous task in the sequence has finished. 
 * Once the delay has passed, the next task will start even if the previous is 
 * still running.
 * 
 * @param rects 
 */
function* exSequence(rects: Array<Rect>): ThreadGenerator {
  yield* sequence(
    0.1,
    ...rects.map(rect => rect.x(100, 1))
  );
}

/**
 * `loop`: Run the given generator N times.
 * 
 * Each iteration waits until the previous one is completed.
 * 
 * @param rect 
 */
function* exLoop(rect: Rect): ThreadGenerator {
  const colors = [
    '#ff6470',
    '#ffc66d',
    '#68abdf',
    '#99c47a',
  ];
  
  yield* loop(
    colors.length,
    i => rect.fill(colors[i], 2),
  );
}

/**
 * This is one of the most elegant ways to do simple tweens, but 
 * requires nesting all to do multiple tweens on an object since the map 
 * callback must return a ThreadGenerator.
 * 
 * @param rects 
 */
function* exArrayMap(rects: Array<Rect>): ThreadGenerator {
  yield *
  all(
    ...rects.map(rect =>
      // No yield or anything; we return this generator and deal with it outside
      rect.position.y(100, 1).to(-100, 2).to(0, 1),
    ),
  );
}

/**
 * This is similar to above, but uses a for loop and an array of generators.
 * @param rects 
 */
function* exForAll(rects: Array<Rect>): ThreadGenerator {
  const generators = [];
  for (const rect of rects) {
    // No yield here, just store the generators.
    generators.push(rect.position.y(100, 1).to(-100, 2).to(0, 1));
  }

  // Run all of the generators.
  yield * all(...generators);
}

/**
 * This is a bit of a cumbersome option because you have to figure out how 
 * long it would take for the generator in the loop to complete, but is useful
 * in some situations.
 * @param rects 
 */
function* exFor(rects: Array<Rect>): ThreadGenerator {
  for (const rect of rects) {
    // Note the absence of a * after this yield
    yield rect.position.y(100, 1).to(-100, 2).to(0, 1);
  }
  
  // Wait for the duration of the above generators
  yield * waitFor(4);
}