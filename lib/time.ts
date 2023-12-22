// subtracts two time intervals
export function subtractTimeIntervals(
  start1: number,
  end1: number,
  start2: number,
  end2: number,
): [number, number][] {
  const result: [number, number][] = [];

  if (start1 >= end1 || start2 >= end2) {
    throw new Error("Invalid time interval");
  }

  if (end1 <= start2) {
    result.push([start1, end1]);
    return result;
  }

  if (start1 >= end2) {
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

  if (start2 > start1 && start2 <= end1 && end1 <= end2) {
    result.push([start1, start2]);
    return result;
  }

  return result;
}

export function subtractBusyIntervals(
  start: number,
  end: number,
  busyIntervals: {
    start: number;
    end: number;
  }[],
) {
  const sortedBusyIntervals = busyIntervals.sort((a, b) => a.start - b.start);

  let freeIntervals = [[start, end]];
  const intersectingBusyIntervals = sortedBusyIntervals.filter(
    ({ start: busyStart, end: busyEnd }) =>
      intervalsIntersect(start, end, busyStart, busyEnd),
  );

  for (const { start: busyStart, end: busyEnd } of intersectingBusyIntervals) {
    const newFreeIntervals: [number, number][] = [];

    for (const [freeStart, freeEnd] of freeIntervals) {
      newFreeIntervals.push(
        ...subtractTimeIntervals(freeStart, freeEnd, busyStart, busyEnd),
      );
    }

    freeIntervals = newFreeIntervals;
  }

  return freeIntervals;
}

export function intervalsIntersect(
  start1: number,
  end1: number,
  start2: number,
  end2: number,
) {
  return (
    (start2 <= start1 && start1 < end2) || (start1 <= start2 && start2 < end1)
  );
}

export function splitInterval(
  start: number,
  end: number,
  subIntervalLength: number,
) {
  const result: [number, number][] = [];

  if (start >= end) {
    throw new Error("Invalid time interval");
  }

  if (subIntervalLength <= 0) {
    throw new Error("Invalid sub interval length");
  }

  let currentStart = start;

  while (currentStart + subIntervalLength <= end) {
    result.push([currentStart, currentStart + subIntervalLength]);
    currentStart += subIntervalLength;
  }
  return result;
}
