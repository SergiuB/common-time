import {
  intervalsIntersect,
  splitInterval,
  subtractBusyIntervals,
  subtractTimeIntervals,
} from "./time";

describe("subtractBusyIntervals", () => {
  it("should correctly subtract one middle busy interval", () => {
    const result = subtractBusyIntervals(1, 10, [
      {
        start: 2,
        end: 5,
      },
    ]);
    expect(result).toEqual([
      [1, 2],
      [5, 10],
    ]);
  });

  it("should correctly subtract one starting busy interval", () => {
    const result = subtractBusyIntervals(1, 10, [
      {
        start: 0,
        end: 5,
      },
    ]);
    expect(result).toEqual([[5, 10]]);
  });

  it("should correctly subtract one ending busy interval", () => {
    const result = subtractBusyIntervals(1, 10, [
      {
        start: 8,
        end: 11,
      },
    ]);
    expect(result).toEqual([[1, 8]]);
  });

  it("should correctly subtract multiple busy intervals (A)", () => {
    const result = subtractBusyIntervals(1, 10, [
      {
        start: 2,
        end: 5,
      },
      {
        start: 6,
        end: 8,
      },
      {
        start: 10,
        end: 11,
      },
    ]);
    expect(result).toEqual([
      [1, 2],
      [5, 6],
      [8, 10],
    ]);
  });

  it("should correctly subtract multiple busy intervals (B)", () => {
    const result = subtractBusyIntervals(1, 10, [
      {
        start: 1,
        end: 3,
      },
      {
        start: 3,
        end: 5,
      },
      {
        start: 9,
        end: 11,
      },
    ]);
    expect(result).toEqual([[5, 9]]);
  });
});

describe("subtractTimeIntervals", () => {
  it("should correctly subtract one middle busy interval", () => {
    const result = subtractTimeIntervals(1, 10, 2, 5);
    expect(result).toEqual([
      [1, 2],
      [5, 10],
    ]);
  });

  it("should correctly subtract one exactly starting busy interval", () => {
    const result = subtractTimeIntervals(1, 10, 1, 5);
    expect(result).toEqual([[5, 10]]);
  });

  it("should correctly subtract one starting busy interval", () => {
    const result = subtractTimeIntervals(1, 10, 0, 5);
    expect(result).toEqual([[5, 10]]);
  });

  it("should correctly subtract one exactly ending busy interval", () => {
    const result = subtractTimeIntervals(1, 10, 8, 10);
    expect(result).toEqual([[1, 8]]);
  });

  it("should correctly subtract one ending busy interval", () => {
    const result = subtractTimeIntervals(1, 10, 8, 11);
    expect(result).toEqual([[1, 8]]);
  });
});

describe("intervalsIntersect", () => {
  it("should return false if intervals do not intersect", () => {
    expect(intervalsIntersect(1, 2, 3, 4)).toBe(false);
    expect(intervalsIntersect(3, 4, 1, 2)).toBe(false);
    expect(intervalsIntersect(1, 2, 2, 4)).toBe(false);
  });

  it("should return true if intervals intersect", () => {
    expect(intervalsIntersect(1, 3, 2, 4)).toBe(true);
    expect(intervalsIntersect(2, 4, 1, 3)).toBe(true);
    expect(intervalsIntersect(1, 5, 2, 3)).toBe(true);
    expect(intervalsIntersect(2, 3, 1, 5)).toBe(true);
  });
});

describe("splitInterval", () => {
  it("should correctly split interval with remainder", () => {
    const result = splitInterval(0, 11, 2);
    expect(result).toEqual([
      [0, 2],
      [2, 4],
      [4, 6],
      [6, 8],
      [8, 10],
    ]);
  });

  it("should correctly split interval without remainder", () => {
    const result = splitInterval(0, 10, 2);
    expect(result).toEqual([
      [0, 2],
      [2, 4],
      [4, 6],
      [6, 8],
      [8, 10],
    ]);
  });

  it("should return empty for too small interval", () => {
    const result = splitInterval(0, 1, 2);
    expect(result).toEqual([]);
  });

  it("should return original interval, if subinterval length is exactly interval length", () => {
    const result = splitInterval(0, 1, 1);
    expect(result).toEqual([[0, 1]]);
  });
});
