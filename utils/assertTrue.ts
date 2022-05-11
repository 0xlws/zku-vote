export default function assert(x: boolean, y?: string) {
    if (x === false) {
      if (!y) {
        throw new Error(`Assertion failed`);
      }
      throw new Error(`Assertion failed: ${y}`);
    }
  }