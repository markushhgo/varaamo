import React from 'react';
import moment from 'moment';

import { shallowWithIntl } from 'utils/testUtils';
import ReservationDate from './ReservationDate';

describe('shared/reservation-date/ReservationDate', () => {
  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationDate {...extraProps} />);
  }

  let wrapper;

  const beginDate = '2018-01-31T13:00:00+02:00';
  const endDate = '2018-01-31T13:30:00+02:00';

  beforeAll(() => {
    wrapper = getWrapper({
      beginDate,
      endDate
    });
  });

  test('renders a container div', () => {
    const container = wrapper.find('div.reservation-date');
    expect(container.length).toBe(1);
  });

  test('renders a date container div', () => {
    const container = wrapper.find('div.reservation-date__content');
    expect(container.length).toBe(1);
  });

  test('renders a month heading', () => {
    const container = wrapper.find('.reservation-date__month');
    const reservationBegin = moment(beginDate);
    expect(container.length).toBe(1);
    expect(container.text()).toBe(reservationBegin.format('MMMM'));
  });

  test('renders a date day', () => {
    const container = wrapper.find('.reservation-date__day-number');
    const reservationBegin = moment(beginDate);
    expect(container.length).toBe(1);
    expect(container.text()).toBe(reservationBegin.format('D'));
  });

  test('renders a day of week heading', () => {
    const container = wrapper.find('.reservation-date__day-of-week');
    const reservationBegin = moment(beginDate);
    expect(container.length).toBe(1);
    expect(container.text()).toBe(reservationBegin.format('dddd'));
  });

  test('renders a reservation time', () => {
    const container = wrapper.find('.reservation-date__time');
    expect(container.length).toBe(1);
  });

  test('renders empty', () => {
    const emptyWrapper = getWrapper({});
    expect(emptyWrapper.equals(<span />)).toBe(true);
  });
});
