
import MockDate from 'mockdate';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

import { DEFAULT_SLOT_SIZE } from 'constants/SlotConstants';
import constants from 'constants/AppConstants';
import {
  addToDate,
  calculateDuration,
  calculateEndTime,
  getDateStartAndEndTimes,
  getDateString,
  getDuration,
  getDurationHours,
  getEndTimeString,
  getStartTimeString,
  getTimeSlots,
  getTimeDiff,
  isPastDate,
  isValidDateString,
  padLeft,
  getPrettifiedDuration,
  getPrettifiedPeriodUnits,
  prettifyHours,
  periodToMinute,
  getEndTimeSlotWithMinPeriod,
  formatTime,
  formatDateTime,
  formatDetailsDatetimes,
  isMultiday,
  formatDatetimeToString
} from 'utils/timeUtils';

const moment = extendMoment(Moment);

describe('Utils: timeUtils', () => {
  describe('addToDate', () => {
    test('adds days to given date if daysToIncrement is positive', () => {
      const date = '2015-10-10';
      const actual = addToDate(date, 3);
      const expected = '2015-10-13';

      expect(actual).toBe(expected);
    });

    test('subtracts days from given date if daysToIncrement is negative', () => {
      const date = '2015-10-10';
      const actual = addToDate(date, -3);
      const expected = '2015-10-07';

      expect(actual).toBe(expected);
    });
  });

  describe('getDateStartAndEndTimes', () => {
    test('returns an empty object if date is undefined', () => {
      const date = undefined;

      expect(getDateStartAndEndTimes(date)).toEqual({});
    });

    test('returns an empty object if date is an empty string', () => {
      const date = '';

      expect(getDateStartAndEndTimes(date)).toEqual({});
    });

    test(
      'returns an object with availableBetween, end and start properties',
      () => {
        const date = '2015-10-10';
        const actual = getDateStartAndEndTimes(date);

        expect(actual.availableBetween).toBeFalsy();
        expect(actual.end).toBeDefined();
        expect(actual.start).toBeDefined();
      }
    );

    test(
      'returns an object with availableBetween, end and start in correct form',
      () => {
        const date = '2015-10-10';
        const duration = 30;
        const end = '18:00';
        const start = '08:30';
        const timeZone = moment().format('Z');
        const useTimeRange = true;
        const expected = `${date}T${start}:00${timeZone},${date}T${end}:00${timeZone},${duration}`;
        const actual = getDateStartAndEndTimes(date, useTimeRange, start, end, duration);

        expect(actual.availableBetween).toBe(expected);
        expect(actual.end).toBe(`${date}T23:59:59Z`);
        expect(actual.start).toBe(`${date}T00:00:00Z`);
      }
    );

    test('default timezone is your local timezone', () => {
      const timeZoneFromDate = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timeZoneFromMoment = moment.tz.guess(true);

      expect(timeZoneFromMoment).toEqual(timeZoneFromDate);
    });

    test(
      'returns an object with availableBetween, end and start in correct form when end is 23:30',
      () => {
        const date = '2015-10-10';
        const duration = 30;
        const end = '23:30';
        const start = '08:30';
        const timeZone = moment().format('Z');
        const useTimeRange = true;
        const expected = `${date}T${start}:00${timeZone},${date}T${end}:00${timeZone},${duration}`;
        const actual = getDateStartAndEndTimes(date, useTimeRange, start, end, duration);

        expect(actual.availableBetween).toBe(expected);
        expect(actual.end).toBe(`${date}T23:59:59Z`);
        expect(actual.start).toBe(`${date}T00:00:00Z`);
      }
    );

    test(
      'returns an object without availableBetween property when useTimeRange flag is not enabled',
      () => {
        const date = '2015-10-10';
        const duration = 30;
        const end = '23:30';
        const start = '08:30';
        const useTimeRange = false;
        const actual = getDateStartAndEndTimes(date, useTimeRange, start, end, duration);

        expect(actual.availableBetween).not.toBeDefined();
        expect(actual.end).toBe(`${date}T23:59:59Z`);
        expect(actual.start).toBe(`${date}T00:00:00Z`);
      }
    );
  });

  describe('getDateString', () => {
    test('returns current date string if date is undefined', () => {
      const date = undefined;
      const expected = moment().format(constants.DATE_FORMAT);

      expect(getDateString(date)).toBe(expected);
    });

    test('returns current date string if date is an empty string', () => {
      const date = '';
      const expected = moment().format(constants.DATE_FORMAT);

      expect(getDateString(date)).toBe(expected);
    });

    test('returns the date unchanged', () => {
      const date = '2015-10-11';

      expect(getDateString(date)).toBe(date);
    });
  });

  describe('getDuration', () => {
    test('returns default duration if duration parameter is undefined', () => {
      const duration = undefined;
      expect(getDuration(duration)).toBe(30);
    });

    test('returns default duration if duration parameter is 0', () => {
      const duration = 0;
      expect(getDuration(duration)).toBe(30);
    });

    test('returns the duration unchanged', () => {
      const duration = 90;
      expect(getDuration(duration)).toBe(duration);
    });
  });

  describe('getDurationHours', () => {
    test(
      'returns default duration in hours if duration parameter is undefined',
      () => {
        const duration = undefined;
        expect(getDurationHours(duration)).toBe(0.5);
      }
    );

    test('returns default duration in hours if duration parameter is 0', () => {
      const duration = 0;
      expect(getDurationHours(duration)).toBe(0.5);
    });

    test('returns the duration in hours', () => {
      const duration = 90;
      expect(getDurationHours(duration)).toBe(1.5);
    });
  });

  describe('calculateDuration', () => {
    test(
      'returns duration when given duration fits between start and end time range',
      () => {
        const duration = 60;
        const end = '18:00';
        const start = '10:00';
        expect(calculateDuration(duration, start, end)).toBe(duration);
      }
    );

    test(
      'returns calculated duration when start and end time range less than given duration',
      () => {
        const duration = 360;
        const end = '12:00';
        const start = '10:00';
        expect(calculateDuration(duration, start, end)).toBe(120);
      }
    );

    test(
      'returns duration when given duration first between start and end time range and end 23:30',
      () => {
        const duration = 360;
        const end = '23:30';
        const start = '10:00';
        expect(calculateDuration(duration, start, end)).toBe(duration);
      }
    );
  });

  describe('calculateEndTime', () => {
    test('returns given end time when start time is before end', () => {
      const end = '18:00';
      const start = '10:00';
      expect(calculateEndTime(end, start)).toBe(end);
    });

    test('calculates end time when start time is after end', () => {
      const end = '09:00';
      const start = '10:00';
      expect(calculateEndTime(end, start)).toBe('10:30');
    });
  });

  describe('getEndTimeString', () => {
    test('returns default end if parameter is undefined', () => {
      const end = undefined;
      expect(getEndTimeString(end)).toBe('23:30');
    });

    test('returns default duration in hours if parameter is empty', () => {
      const end = '';
      expect(getEndTimeString(end)).toBe('23:30');
    });

    test('returns the end unchanged', () => {
      const end = '20:00';
      expect(getEndTimeString(end)).toBe(end);
    });
  });

  describe('getStartTimeString', () => {
    const now = '2016-10-10T06:45:00+03:00';

    beforeAll(() => {
      MockDate.set(now);
    });

    afterAll(() => {
      MockDate.reset();
    });

    test('returns default start if parameter is undefined', () => {
      const start = undefined;
      expect(getStartTimeString(start)).toBe('07:00');
    });

    test('returns default start if parameter is empty', () => {
      const start = '';
      expect(getStartTimeString(start)).toBe('07:00');
    });

    test('returns the start unchanged', () => {
      const start = '08:30';
      expect(getStartTimeString(start)).toBe(start);
    });
  });

  describe('getTimeSlots', () => {
    describe('When critical info is missing', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T10:00:00+03:00';
      const period = DEFAULT_SLOT_SIZE;

      test('default period to 30 mins', () => {
        const slots = getTimeSlots(start, end);
        const startTime = moment(slots[0].start);
        const endTime = moment(slots[0].end);

        expect(moment.duration(endTime.diff(startTime)).asMinutes()).toEqual(30);
      });

      test('returns an empty array if start is missing', () => {
        const actual = getTimeSlots(undefined, end, period);

        expect(actual).toEqual([]);
      });

      test('returns an empty array if end is missing', () => {
        const actual = getTimeSlots(start, undefined, period);

        expect(actual).toEqual([]);
      });

      test(
        'uses empty array as default reservations if no reservations is given',
        () => {
          const timeSlots = getTimeSlots(start, end, period);

          timeSlots.forEach((timeSlot) => {
            expect(timeSlot.reserved).toBe(false);
          });
        }
      );
    });

    describe('When dividing 2 hours into 30 min slots', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T10:00:00+03:00';
      const period = DEFAULT_SLOT_SIZE;
      const duration = moment.duration(period);
      const slots = getTimeSlots(start, end, period);

      test('returns an array of length 4', () => {
        expect(slots.length).toBe(4);
      });

      describe('slot start and end times', () => {
        test('returned slots contains start and end properties', () => {
          expect(slots[0].start).toBeDefined();
          expect(slots[0].end).toBeDefined();
        });

        test('start and end times are in UTC', () => {
          expect(slots[0].start.endsWith('Z')).toBe(true);
          expect(slots[0].end.endsWith('Z')).toBe(true);
        });

        test('the first time slot starts when the time range starts', () => {
          const expected = moment.utc(start).toISOString();

          expect(slots[0].start).toBe(expected);
        });

        test('the first time slot ends 30 minutes after start', () => {
          const expected = moment
            .utc(start)
            .add(duration)
            .toISOString();

          expect(slots[0].end).toBe(expected);
        });

        test('the last time slot starts 30 minutes before the time range ends', () => {
          const expected = moment
            .utc(end)
            .subtract(duration)
            .toISOString();

          expect(slots[3].start).toBe(expected);
        });

        test('the last time slot ends 30 minutes after start', () => {
          const expected = moment.utc(end).toISOString();

          expect(slots[3].end).toBe(expected);
        });
      });

      describe('slot asISOString property', () => {
        test('returned slots contains asISOString property', () => {
          expect(slots[0].asISOString).toBeDefined();
        });

        test('is proper ISO format range representation', () => {
          const startUTC = moment.utc(start);
          const endUTC = moment.utc(startUTC).add(duration);
          const expected = `${startUTC.toISOString()}/${endUTC.toISOString()}`;

          expect(slots[0].asISOString).toBe(expected);
        });
      });

      describe('slot asString property', () => {
        test('returned slots contains asString property', () => {
          expect(slots[0].asString).toBeDefined();
        });

        test('shows the slot time range in local time', () => {
          const startLocal = moment(start);
          const endLocal = moment(startLocal).add(duration);
          const startString = startLocal.format(constants.TIME_FORMAT);
          const endString = endLocal.format(constants.TIME_FORMAT);
          const expected = `${startString}\u2013${endString}`;

          expect(slots[0].asString).toBe(expected);
        });
      });
    });

    describe('slot reserved property', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T10:00:00+03:00';
      const period = DEFAULT_SLOT_SIZE;

      describe('with one reservation', () => {
        const reservations = [
          {
            begin: '2015-10-09T08:30:00+03:00',
            end: '2015-10-09T09:30:00+03:00',
          },
        ];
        const slots = getTimeSlots(start, end, period, reservations);

        test(
          'slot is not marked reserved if reservation starts when slot ends',
          () => {
            expect(slots[0].reserved).toBe(false);
          }
        );

        test('marks all the slots that are during reservation as reserved', () => {
          expect(slots[1].reserved).toBe(true);
          expect(slots[2].reserved).toBe(true);
        });

        test(
          'slot is not marked reserved if slots starts when reservation ends',
          () => {
            expect(slots[3].reserved).toBe(false);
          }
        );
      });

      describe('with multiple reservations', () => {
        const reservations = [
          {
            begin: '2015-10-09T08:30:00+03:00',
            end: '2015-10-09T09:00:00+03:00',
          },
          {
            begin: '2015-10-09T09:30:00+03:00',
            end: '2015-10-09T10:00:00+03:00',
          },
        ];
        const slots = getTimeSlots(start, end, period, reservations);

        test('uses all reservations to find reserved slots', () => {
          expect(slots[0].reserved).toBe(false);
          expect(slots[1].reserved).toBe(true);
          expect(slots[2].reserved).toBe(false);
          expect(slots[3].reserved).toBe(true);
        });
      });
    });

    describe('slot reservationStarting and reservationEnding properties during reservation', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T09:30:00+03:00';
      const period = DEFAULT_SLOT_SIZE;
      const reservations = [
        {
          begin: '2015-10-09T08:00:00+03:00',
          end: '2015-10-09T09:30:00+03:00',
        },
      ];
      const slots = getTimeSlots(start, end, period, reservations);

      test('only first slot has reservationStarting property', () => {
        expect(slots[0].reservationStarting).toBe(true);
        expect(slots[1].reservationStarting).toBe(false);
        expect(slots[2].reservationStarting).toBe(false);
      });

      test('only last slot has reservationEnding property', () => {
        expect(slots[0].reservationEnding).toBe(false);
        expect(slots[1].reservationEnding).toBe(false);
        expect(slots[2].reservationEnding).toBe(true);
      });
    });

    describe('slot editing property', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T10:00:00+03:00';
      const period = DEFAULT_SLOT_SIZE;
      const reservations = [];

      describe('with one reservation to edit', () => {
        const reservationsToEdit = [
          {
            begin: '2015-10-09T08:30:00+03:00',
            end: '2015-10-09T09:30:00+03:00',
          },
        ];
        const slots = getTimeSlots(start, end, period, reservations, reservationsToEdit);

        test(
          'slot is not marked as editing if reservation starts when slot ends',
          () => {
            expect(slots[0].editing).toBe(false);
          }
        );

        test('marks all the slots that are during reservation as editing', () => {
          expect(slots[1].editing).toBe(true);
          expect(slots[2].editing).toBe(true);
        });

        test(
          'slot is not marked editing if slots starts when reservation ends',
          () => {
            expect(slots[3].editing).toBe(false);
          }
        );
      });

      describe('with multiple reservationsToEdit', () => {
        const reservationsToEdit = [
          {
            begin: '2015-10-09T08:30:00+03:00',
            end: '2015-10-09T09:00:00+03:00',
          },
          {
            begin: '2015-10-09T09:30:00+03:00',
            end: '2015-10-09T10:00:00+03:00',
          },
        ];
        const slots = getTimeSlots(start, end, period, reservations, reservationsToEdit);

        test('uses all reservations to find slots that are edited', () => {
          expect(slots[0].editing).toBe(false);
          expect(slots[1].editing).toBe(true);
          expect(slots[2].editing).toBe(false);
          expect(slots[3].editing).toBe(true);
        });
      });
    });
    describe('slot onCooldown property', () => {
      const start = '2015-10-09T08:00:00+03:00';
      const end = '2015-10-09T13:00:00+03:00';
      const period = '01:00:00';
      const reservations = [
        {
          begin: '2015-10-09T10:00:00+03:00',
          end: '2015-10-09T11:00:00+03:00',
          id: 111,
        },
      ];
      let twoReservations = [
        {
          begin: '2015-10-09T09:00:00+03:00',
          end: '2015-10-09T10:00:00+03:00',
          isOwn: false,
          id: 112
        },
        {
          begin: '2015-10-09T11:00:00+03:00',
          end: '2015-10-09T12:00:00+03:00',
          isOwn: true,
          id: 113
        }
      ];
      const reservationsToEdit = [
        {
          begin: '2015-10-09T08:30:00+03:00',
          end: '2015-10-09T09:30:00+03:00',
          id: 123
        },
      ];
      test('is always false when cooldown is not set or it is 0', () => {
        const slots = getTimeSlots(start, end, period, reservations);
        slots.forEach((slot) => {
          expect(slot.onCooldown).toBe(false);
        });
      });
      test('is true for slots before and after reservations when cooldown is set', () => {
        const cooldown = '1:00:00';
        const slots = getTimeSlots(start, end, period, reservations, [], cooldown);
        expect(slots[0].onCooldown).toBe(false);
        expect(slots[1].onCooldown).toBe(true);
        expect(slots[2].onCooldown).toBe(false);
        expect(slots[3].onCooldown).toBe(true);
        expect(slots[4].onCooldown).toBe(false);
      });

      test('is true when slot is shared by two reservations', () => {
        const cooldown = '1:00:00';
        const slots = getTimeSlots(
          start,
          end,
          period,
          twoReservations,
          [],
          cooldown
        );
        expect(slots[0].onCooldown).toBe(true);
        expect(slots[1].onCooldown).toBe(false);
        expect(slots[2].onCooldown).toBe(true);
        expect(slots[3].onCooldown).toBe(false);
        expect(slots[4].onCooldown).toBe(true);
      });

      test('is true when slot is shared by two reservations when editing', () => {
        const cooldown = '1:00:00';
        const slots = getTimeSlots(
          start,
          end,
          period,
          twoReservations,
          reservationsToEdit,
          cooldown
        );
        expect(slots[0].onCooldown).toBe(true);
        expect(slots[1].onCooldown).toBe(false);
        expect(slots[2].onCooldown).toBe(true);
        expect(slots[3].onCooldown).toBe(false);
        expect(slots[4].onCooldown).toBe(true);
      });

      test('is true when editing with two reservations', () => {
        const cooldown = '1:00:00';
        twoReservations = [
          {
            begin: '2015-10-09T08:00:00+03:00',
            end: '2015-10-09T09:00:00+03:00',
            isOwn: false,
          },
          {
            begin: '2015-10-09T12:00:00+03:00',
            end: '2015-10-09T13:00:00+03:00',
            isOwn: true,
          }
        ];
        const slots = getTimeSlots(
          start,
          end,
          period,
          twoReservations,
          reservationsToEdit,
          cooldown
        );
        expect(slots[0].onCooldown).toBe(false);
        expect(slots[1].onCooldown).toBe(true);
        expect(slots[2].onCooldown).toBe(false);
        expect(slots[3].onCooldown).toBe(true);
        expect(slots[4].onCooldown).toBe(false);
      });

      test('is false when reservation is type blocked', () => {
        const cooldown = '1:00:00';
        twoReservations = [
          {
            begin: '2015-10-09T08:00:00+03:00',
            end: '2015-10-09T09:00:00+03:00',
            isOwn: false,
          },
          {
            begin: '2015-10-09T12:00:00+03:00',
            end: '2015-10-09T13:00:00+03:00',
            isOwn: true,
            type: constants.RESERVATION_TYPE.BLOCKED_VALUE,
          }
        ];
        const slots = getTimeSlots(start, end, period, twoReservations, [], cooldown);
        expect(slots[0].onCooldown).toBe(false);
        expect(slots[1].onCooldown).toBe(true);
        expect(slots[2].onCooldown).toBe(false);
        expect(slots[3].onCooldown).toBe(false); // would be on cooldown if not blocked
        expect(slots[4].onCooldown).toBe(false);
      });
    });
  });

  describe('isPastDate', () => {
    const now = '2016-10-10T06:00:00+03:00';

    beforeAll(() => {
      MockDate.set(now);
    });

    afterAll(() => {
      MockDate.reset();
    });

    test('returns true if date is in the past', () => {
      const date = '2016-09-09';
      expect(isPastDate(date)).toBe(true);
    });

    test('returns false if date is the current date', () => {
      const date = '2016-10-10';
      expect(isPastDate(date)).toBe(false);
    });

    test('returns false if date is in the future', () => {
      const date = '2016-11-11';
      expect(isPastDate(date)).toBe(false);
    });
  });

  describe('isValidDateString', () => {
    test('returns true if date string is valid', () => {
      const dateOne = '2.8.2019';
      const dateTwo = '02.08.2019';
      const dateThree = '02.8.2019';
      expect(isValidDateString(dateOne)).toBe(true);
      expect(isValidDateString(dateTwo)).toBe(true);
      expect(isValidDateString(dateThree)).toBe(true);
    });

    test('returns false if date string is not valid', () => {
      const dateOne = '33.13.300';
      const dateTwo = '33.1.2019';
      const dateThree = '2019-01-01';
      expect(isValidDateString(dateOne)).toBe(false);
      expect(isValidDateString(dateTwo)).toBe(false);
      expect(isValidDateString(dateThree)).toBe(false);
    });
  });

  describe('getPrettifiedDuration', () => {
    test('returns correct string', () => {
      const beginString = '2021-11-20T08:30:00.000Z';
      const endString = '2021-11-20T09:40:00.000Z';
      const endString2 = '2021-11-23T09:40:00.000Z';
      const beginMoment = moment('2021-11-20 09:30Z');
      const endMoment = moment('2021-11-20 09:35Z');

      expect(getPrettifiedDuration(beginString, endString)).toBe('1h 10min');
      expect(getPrettifiedDuration(beginString, endMoment)).toBe('1h 5min');
      expect(getPrettifiedDuration(beginMoment, endString)).toBe('10min');
      expect(getPrettifiedDuration(beginMoment, endMoment)).toBe('5min');
      expect(getPrettifiedDuration(beginString, endString2)).toBe('3d 1h 10min');
      expect(getPrettifiedDuration(beginString, endString2, 'day')).toBe('3day 1h 10min');
    });
  });

  describe('getPrettifiedPeriodUnits', () => {
    test('returns correct string', () => {
      expect(getPrettifiedPeriodUnits('1:30:00')).toBe('1h 30min');
      expect(getPrettifiedPeriodUnits('2:00:00')).toBe('2h');
      expect(getPrettifiedPeriodUnits('0:25:00')).toBe('25min');
      expect(getPrettifiedPeriodUnits('0:00:00')).toBe('');
      expect(getPrettifiedPeriodUnits('2 1:00:00')).toBe('2d 1h');
      expect(getPrettifiedPeriodUnits('2 1:00:00', 'day')).toBe('2day 1h');
    });
  });

  describe('prettifyHours', () => {
    describe('if hours is less than 0.5', () => {
      const hours = 0.3;

      describe('if showMinutes is true', () => {
        const showMinutes = true;

        test('returns the number of minutes left', () => {
          const expected = `${0.3 * 60} min`;

          expect(prettifyHours(hours, showMinutes)).toBe(expected);
        });
      });

      describe('if showMinutes is false', () => {
        const showMinutes = false;

        test('returns the number of hours rounded to half an hour', () => {
          expect(prettifyHours(hours, showMinutes)).toBe('0.5 h');
        });
      });
    });

    describe('if hours is more than 0.5', () => {
      const hours = 2.3;

      test('returns the number of hours rounded to half an hour', () => {
        expect(prettifyHours(hours)).toBe('2.5 h');
      });
    });
  });

  describe('padLeft', () => {
    describe('if number is less than 10', () => {
      test('returns the number with 0 added to the left as a string', () => {
        const number = 6;
        const expected = `0${number}`;

        expect(padLeft(number)).toBe(expected);
      });
    });

    describe('if number is more than 10', () => {
      const number = 16;
      const expected = `${number}`;

      test('returns the number as it is as a string', () => {
        expect(padLeft(number)).toBe(expected);
      });
    });
  });

  describe('getTimeDiff', () => {
    test('return timediff in number by default', () => {
      const startDate = '2019-05-09T05:00:01.000Z';
      const endDate = '2019-05-09T05:00:00.000Z';

      const expected = 1000;

      expect(getTimeDiff(startDate, endDate)).toEqual(expected);
    });

    test('return timediff in defined unit', () => {
      const startDate = '2019-05-09T05:30:01.000Z';
      const endDate = '2019-05-09T05:00:00.000Z';
      const unit = 'minutes';
      const expected = 30;

      expect(getTimeDiff(startDate, endDate, unit)).toEqual(expected);
    });

    test('can be used to compare time', () => {
      const startDate = '2019-05-09T05:30:00.000Z';
      const endDate = '2019-05-09T05:00:00.000Z';

      // > 0 => startTime > endTime
      expect(getTimeDiff(startDate, endDate) > 0).toBeTruthy();
    });
  });

  describe('getEndTimeSlotWithMinPeriod', () => {
    test('return end time slot with timediff equal minPeriod', () => {
      const slot = {
        begin: '2019-05-09T05:00:00.000Z',
        end: '2019-05-09T05:30:00.000Z',
        resource: 'abc'
      };

      const minPeriod = '01:00:00';
      const result = getEndTimeSlotWithMinPeriod(slot, minPeriod);

      expect(getTimeDiff(result.begin, slot.begin, 'minutes')).toEqual(periodToMinute(minPeriod));
      expect(getTimeDiff(result.end, slot.end, 'minutes')).toEqual(periodToMinute(minPeriod));
      expect(result.resource).toEqual(slot.resource);
    });
  });

  describe('periodToMinute', () => {
    test('convert time period to minutes', () => {
      const period = '01:00:00';

      const result = periodToMinute(period);

      expect(result).toEqual(60);
    });
  });

  describe('formatTime', () => {
    test.each([
      ['12:00:00', 'HH:mm:ss', 'HH:mm', '12:00'],
      ['15:00', 'HH:mm', 'HH', '15'],
      ['8:00', 'H:mm', 'HH', '08'],
    ])('returns correctly formatted time string with given params', (time, timeFormat, targetTimeFormat, expected) => {
      expect(formatTime(time, timeFormat, targetTimeFormat)).toBe(expected);
    });
  });

  describe('formatDatetime', () => {
    test.each([
      ['2023-11-01T15:00:00Z', 'YYYY-MM-DD HH:mm', '2023-11-01 17:00'],
      ['2023-11-01T15:00:00Z', 'YYYY.MM.DD', '2023.11.01'],
      ['2023-11-01T15:00:00Z', 'L', '01.11.2023'],
      ['2023-11-01T34:00:00', 'L', '2023-11-01T34:00:00'],
    ])('returns correctly formatted datetime string with given params', (datetime, targetFormat, expected) => {
      expect(formatDateTime(datetime, targetFormat)).toBe(expected);
    });
  });

  describe('formatDetailsDatetimes', () => {
    test.each([
      ['2023-11-01T15:00:00Z', '2023-11-01T16:00:00Z', '1.11.2023 17:00–18:00 (1h)'],
      ['2023-11-01T15:00:00Z', '2023-11-03T13:00:00Z', '1.11.2023 TimeSlots.selectedTime 17:00 - 3.11.2023 TimeSlots.selectedTime 15:00 (1d 22h)'],
    ])('returns correctly formatted datetime string with given params', (begin, end, expected) => {
      const t = (str, timeObj) => `${str} ${timeObj.time}`;
      expect(formatDetailsDatetimes(begin, end, t)).toBe(expected);
    });
  });

  describe('formatDatetimeToString', () => {
    const t = (str, timeObj) => `${str} ${timeObj.time}`;
    test('returns correct string', () => {
      expect(formatDatetimeToString('2023-11-01T15:00:00Z', t)).toBe('1.11.2023 TimeSlots.selectedTime 17:00');
      expect(formatDatetimeToString(moment('2023-11-01T15:00:00Z'), t)).toBe('1.11.2023 TimeSlots.selectedTime 17:00');
    });
  });

  describe('isMultiday', () => {
    test('returns true if begin and end are in different days', () => {
      const begin = '2023-11-01T15:00:00Z';
      const end = '2023-11-03T13:00:00Z';
      const end2 = '2023-11-01T01:00:00Z';

      expect(isMultiday(begin, end)).toBe(true);
      expect(isMultiday(begin, end2)).toBe(false);
    });
  });
});
