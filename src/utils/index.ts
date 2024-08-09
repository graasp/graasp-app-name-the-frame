// eslint-disable-next-line @typescript-eslint/ban-types
export const debounce = (func: Function, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};
