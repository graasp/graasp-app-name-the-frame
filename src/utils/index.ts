// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const debounce = (func: Function, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

interface AbsolutePosition {
  x: number;
  y: number;
}

interface RelativePosition {
  x: string;
  y: string;
}

interface Dimension {
  width: number; // width of the frame in pixels
  height: number; // height of the frame in pixels
}

export const PositionConverter = {
  // Converts relative x, y (percentage-based) to absolute pixel-based coordinates
  toAbsolute({
    x,
    y,
    width,
    height,
  }: RelativePosition & Dimension): AbsolutePosition {
    return {
      x: (parseFloat(x) * width) / 100,
      y: (parseFloat(y) * height) / 100,
    };
  },

  // Converts absolute pixel-based x, y to relative (percentage-based) coordinates
  toRelative({
    x,
    y,
    width,
    height,
  }: AbsolutePosition & Dimension): RelativePosition {
    return {
      x: `${(x / width) * 100}%`,
      y: `${(y / height) * 100}%`,
    };
  },
};
