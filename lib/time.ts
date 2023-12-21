// subtracts two time intervals
export function subtractTimeIntervals(
  start1: number,
  end1: number,
  start2: number,
  end2: number,
): [number, number][] {
  const result: [number, number][] = [];

  if (start1 >= end1 || start2 >= end2) {
    return result;
  }

  if (start1 < start2 && end1 <= start2) {
    result.push([start1, end1]);
    return result;
  }

  if (start1 >= end2 && end1 > end2) {
    result.push([start1, end1]);
    return result;
  }

  if (start1 < start2 && end1 > end2) {
    result.push([start1, start2]);
    result.push([end2, end1]);
    return result;
  }

  if (start1 >= start2 && end1 <= end2) {
    return result;
  }

  if (start1 >= start2 && start1 < end2 && end1 > end2) {
    result.push([end2, end1]);
    return result;
  }

  return result;
}

export function subtractBusyIntervals(
  start: number,
  end: number,
  sortedBusyIntervals: {
    start: number;
    end: number;
  }[],
) {
  if (start === 1704492000000) {
    debugger;
  }
  const freeIntervals = [[start, end]];
  const intersectingBusyIntervals = sortedBusyIntervals.filter(
    ({ start: busyStart, end: busyEnd }) =>
      (busyStart <= start && end <= busyEnd) ||
      (busyStart <= start && start <= busyEnd) ||
      (busyStart <= end && end <= busyEnd) ||
      (start <= busyStart && busyEnd <= end),
  );

  while (freeIntervals.length && intersectingBusyIntervals.length) {
    const [start, end] = freeIntervals.shift()!;

    const { start: busyStart, end: busyEnd } =
      intersectingBusyIntervals.shift()!;

    const free = subtractTimeIntervals(start, end, busyStart, busyEnd);

    if (free.length) {
      freeIntervals.push(...free);
    }
  }
  return freeIntervals;
}
