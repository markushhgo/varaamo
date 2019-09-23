import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';

import AvailabilityTimeline from './AvailabilityTimeline';
import Reservation from './Reservation';
import ReservationSlot from './ReservationSlot';

function getWrapper(props) {
  const defaults = {
    id: 'resource-id',
    items: [],
    maxPeriod: '10:00:00',
    minPeriod: '01:00:00',
  };
  return shallow(<AvailabilityTimeline {...defaults} {...props} />);
}

describe('shared/availability-view/AvailabilityTimeline', () => {
  test('renders a div.availability-timeline', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.availability-timeline')).toBe(true);
  });

  test('renders given reservation slot', () => {
    const id = 'resource-auuxnane';
    const maxPeriod = '12:00:00';
    const minPeriod = '02:00:00';
    const onReservationSlotClick = () => null;
    const onReservationSlotMouseEnter = () => null;
    const onReservationSlotMouseLeave = () => null;
    const wrapper = getWrapper({
      id,
      items: [{
        key: '1',
        type: 'reservation-slot',
        data: { begin: moment().format(), end: moment().format(), resourceId: '' },
      }],
      maxPeriod,
      minPeriod,
      onReservationSlotClick,
      onReservationSlotMouseEnter,
      onReservationSlotMouseLeave,
    });
    const slot = wrapper.find(ReservationSlot);
    expect(slot).toHaveLength(1);
    expect(slot.prop('resourceId')).toBe(id);
    expect(slot.prop('onClick')).toBe(onReservationSlotClick);
    expect(slot.prop('onMouseEnter')).toBe(onReservationSlotMouseEnter);
    expect(slot.prop('onMouseLeave')).toBe(onReservationSlotMouseLeave);
    expect(slot.prop('maxPeriod')).toBe(maxPeriod);
    expect(slot.prop('minPeriod')).toBe(minPeriod);
  });

  test('renders given reservation', () => {
    const wrapper = getWrapper({
      items: [{
        key: '1',
        type: 'reservation',
        data: {
          begin: '',
          end: '',
          id: 12345,
          name: 'My Reservation',
        },
      }],
    });
    const reservation = wrapper.find(Reservation);
    expect(reservation).toHaveLength(1);
    expect(reservation.prop('name')).toBe('My Reservation');
  });

  test('renders slots and reservations', () => {
    const wrapper = getWrapper({
      items: [
        {
          key: '1',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: '',
          },
        },
        {
          key: '2',
          type: 'reservation',
          data: {
            begin: '', end: '', id: 12345, name: ''
          }
        },
        {
          key: '3',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: '',
          },
        },
      ],
    });
    const children = wrapper.children();
    expect(children.at(0).is(ReservationSlot)).toBe(true);
    expect(children.at(1).is(Reservation)).toBe(true);
    expect(children.at(2).is(ReservationSlot)).toBe(true);
  });

  test('renders slots and reservations with cooldown when not admin', () => {
    const wrapper = getWrapper({
      items: [
        {
          key: '1',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: '',
            cooldownSize: 60,
            width: 60,
          },
        },
        {
          key: '2',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: '',
            cooldownSize: 60,
            width: 60,
          },
        },
        {
          key: '3',
          type: 'reservation',
          data: {
            begin: '', end: '', id: 12345, name: ''
          }
        },
        {
          key: '4',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: '',
            cooldownSize: 60,
            width: 60,
          },
        },
        {
          key: '5',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: '',
            cooldownSize: 60,
            width: 60,
          },
        },
        {
          key: '6',
          type: 'reservation',
          data: {
            begin: '', end: '', id: 67890, name: '',
          },
        },
        {
          key: '7',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: '',
            cooldownSize: 60,
            width: 60,
          },
        },
        {
          key: '8',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: '',
            cooldownSize: 60,
            width: 60,
          },
        },
      ],
      isAdmin: false
    });

    const children = wrapper.children();
    expect(children.at(0).prop('isCooldown')).toBe(false);
    expect(children.at(0).prop('isSelectable')).toBe(undefined);

    expect(children.at(1).prop('isCooldown')).toBe(true);
    expect(children.at(1).prop('isSelectable')).toBe(false);

    expect(children.at(2).is(Reservation)).toBe(true);

    expect(children.at(3).prop('isCooldown')).toBe(true);
    expect(children.at(3).prop('isSelectable')).toBe(false);

    expect(children.at(4).prop('isCooldown')).toBe(true);
    expect(children.at(4).prop('isSelectable')).toBe(false);

    expect(children.at(5).is(Reservation)).toBe(true);

    expect(children.at(6).prop('isCooldown')).toBe(true);
    expect(children.at(6).prop('isSelectable')).toBe(false);

    expect(children.at(7).prop('isCooldown')).toBe(false);
    expect(children.at(7).prop('isSelectable')).toBe(undefined);
  });

  test('renders slots and reservations with cooldown when admin', () => {
    const wrapper = getWrapper({
      items: [
        {
          key: '1',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: '',
            cooldownSize: 60,
            width: 60,
            isSelectable: true,
          },
        },
        {
          key: '2',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: '',
            cooldownSize: 60,
            width: 60,
            isSelectable: true,
          },
        },
        {
          key: '3',
          type: 'reservation',
          data: {
            begin: '', end: '', id: 12345, name: ''
          }
        },
        {
          key: '4',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: '',
            cooldownSize: 60,
            width: 60,
            isSelectable: true,
          },
        },
        {
          key: '5',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: '',
            cooldownSize: 60,
            width: 60,
            isSelectable: true,
          },
        },
        {
          key: '6',
          type: 'reservation',
          data: {
            begin: '', end: '', id: 67890, name: '',
          },
        },
        {
          key: '7',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: '',
            cooldownSize: 60,
            width: 60,
            isSelectable: true,
          },
        },
        {
          key: '8',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: '',
            cooldownSize: 60,
            width: 60,
            isSelectable: true,
          },
        },
      ],
      isAdmin: true
    });

    const children = wrapper.children();
    expect(children.at(0).prop('isCooldown')).toBe(false);
    expect(children.at(0).prop('isSelectable')).toBe(true);

    expect(children.at(1).prop('isCooldown')).toBe(false);
    expect(children.at(1).prop('isSelectable')).toBe(true);

    expect(children.at(2).is(Reservation)).toBe(true);

    expect(children.at(3).prop('isCooldown')).toBe(false);
    expect(children.at(3).prop('isSelectable')).toBe(true);

    expect(children.at(4).prop('isCooldown')).toBe(false);
    expect(children.at(4).prop('isSelectable')).toBe(true);

    expect(children.at(5).is(Reservation)).toBe(true);

    expect(children.at(6).prop('isCooldown')).toBe(false);
    expect(children.at(6).prop('isSelectable')).toBe(true);

    expect(children.at(7).prop('isCooldown')).toBe(false);
    expect(children.at(7).prop('isSelectable')).toBe(true);
  });
});
