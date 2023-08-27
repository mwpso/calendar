import { addDays, addMonths, format, subDays } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildDates,
  cutOffDate,
  getMonths,
  hackPacificTime,
  schoolYear,
} from './dates';

describe('dates', () => {
  it('should work', () => {
    expect(1).toBe(1);
  });

  it('should test using UTC', () => {
    // this is accomplished by setting the TZ environment variable to UTC
    // in our npm script: "test": "sst bind 'TZ=UTC vitest'"
    expect(new Date().getTimezoneOffset()).toBe(0);
  });

  describe('buildDates', () => {
    it('should return 31 days for January', () => {
      const days = buildDates([], 'January');
      expect(days.filter((d) => d.isCurrentMonth).length).toBe(31);
    });
  });

  describe('getMonths', () => {
    it('should return 12 months', () => {
      expect(getMonths().length).toBe(12);
    });

    it('should return August as first month', () => {
      const firstMonth = format(addMonths(cutOffDate(), 0), 'MMMM');
      expect(getMonths()[0]).toBe(firstMonth);
    });

    it('should return July as last month', () => {
      const lastMonth = format(addMonths(cutOffDate(), 11), 'MMMM');
      expect(getMonths()[11]).toBe(lastMonth);
    });
  });

  describe('hackPacificTime', () => {
    it('should hack a UTC Date to a PDT offset', () => {
      const date = new Date('2021-08-01T00:00:00.000Z');
      const expected = new Date('2021-08-01T08:00:00.000Z');
      const actual = hackPacificTime(date);
      expect(actual).toEqual(expected);
    });
  });

  describe('schoolYear', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('years should be correct on cutoff date', () => {
      const targetDate = cutOffDate();
      vi.setSystemTime(targetDate);

      const { start, end } = schoolYear();
      expect(start.getFullYear()).toBe(targetDate.getFullYear());
      expect(end.getFullYear()).toBe(targetDate.getFullYear() + 1);
    });

    it('years should be correct halfway through year', () => {
      const targetDate = addDays(cutOffDate(), 180);
      vi.setSystemTime(targetDate);

      const { start, end } = schoolYear();
      expect(start.getFullYear()).toBe(targetDate.getFullYear() - 1);
      expect(end.getFullYear()).toBe(targetDate.getFullYear());
    });

    it('years should be correct on day before cutoff', () => {
      const targetDate = subDays(cutOffDate(), 1);
      vi.setSystemTime(targetDate);

      const { start, end } = schoolYear();
      expect(start.getFullYear()).toBe(targetDate.getFullYear() - 1);
      expect(end.getFullYear()).toBe(targetDate.getFullYear());
    });
  });
});
