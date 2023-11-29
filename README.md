# motioncanvas-tutorial

A sandbox for learning [motion-canvas tooling](https://motioncanvas.io/docs/quickstart)

## Installation Instructions

Note: when installing, Motion Canvas will come with a built-in Image sequence exporter.
To export the animation as a finished video, install with the FFmpeg exporter option.

```bash
npm init @motion-canvas@latest
cd <project-path>
npm install
```

## Running Instructions

Note: the editor/preview can be accessed at `http://localhost:9000/` after serving.

```bash
npm run serve
```

## Understanding Motion-Canvas

> When the yield keyword is encountered, the execution of the function pauses, and resumes only when the caller requests another value. This is particularly useful when declaring animations - usually we want to change the things on the screen in incremental steps to create an illusion of movement. We also want to wait a constant amount of time between these updates so that our eyes can register what's happening. With generators, we can update things in-between the yield keywords, and then wait for a bit whenever the function yields.

> This is the fundamental idea of Motion Canvas. `yield` means: "The current frame is ready, display it on the screen and come back to me later."

## Flow Generators

- `all`
  - run all tasks concurrently and wait for all of them to finish
- `any`
  - run all tasks concurrently and wait for any of them to finish
- `chain`
  - run tasks one after another
- `delay`
  - run given generator or callback after a specific amount of time
- `sequence`
  - start all tasks one after another with a constant delay between
- `loop`
  - run generator `N` times