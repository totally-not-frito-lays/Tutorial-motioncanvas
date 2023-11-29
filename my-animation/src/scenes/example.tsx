import {makeScene2D, Circle} from '@motion-canvas/2d';
import {all, createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Every object should have a reference
  const myCircle = createRef<Circle>();

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

  // Animation Logic: change one parameter at a time
  yield* myCircle().fill('#e6a700', 1).to('#e13238', 1);

  // Animation logic: change multiple parameters at the same time
  yield* all(
    myCircle().position.x(300, 1).to(-300, 1),
    myCircle().fill('#e6a700', 1).to('#e13238', 1),
  );

  
});
