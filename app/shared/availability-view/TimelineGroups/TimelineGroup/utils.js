/* eslint-disable max-len */
import { slotSize, slotWidth, slotMargin } from 'constants/SlotConstants';

import some from 'lodash/some';
import moment from 'moment';

function getTimeSlotWidth({ startTime, endTime } = {}) {
  const diff = endTime ? endTime.diff(startTime, 'minutes') : slotSize;
  const slots = Math.floor(diff / slotSize);

  return (slotWidth * slots) - slotMargin;
}
/**
 * Returns a number, for example
 *
 * '01:00:00' returns 60 -> 1 hour,
 *
 * '00:30:00' returns 30 -> 30min
 * @param {string} size - string to parse
 *
 */
function getSlotSize(size = slotSize) {
  if (size === 30) { return size; }
  const hour = Number(size.substring(0, 2));
  const min = Number(size.substring(3, 5));

  if (hour !== 0) {
    return hour * 60;
  }
  if (min !== 0) {
    return min;
  }
  return slotSize;
}

/**
 *  Returns a number, for example
 *
 * '01:00:00' for 1 hour,
 *
 * '00:30:00' for 30min
 * @param {string} cooldown - string to parse
 *
 */
function getCooldown(cooldown = 0) {
  if (cooldown === 0) { return cooldown; }
  const hour = Number(cooldown.substring(0, 2));
  const min = Number(cooldown.substring(3, 5));

  if (hour !== 0) {
    return hour * (2 * slotSize);
  }
  if (min !== 0) {
    return min;
  }
  return 0;
}

function getTimelineItems(date, reservations, resourceId, slotSizes, cooldown) {
  const items = [];
  let reservationPointer = 0;
  let timePointer = date.clone().startOf('day');
  const size = getSlotSize(slotSizes);
  const cooldownSize = getCooldown(cooldown);
  const end = date.clone().endOf('day');
  while (timePointer.isBefore(end)) {
    const reservation = reservations && reservations[reservationPointer];
    const isSlotReservation = reservation && timePointer.isSame(reservation.begin);
    if (isSlotReservation) {
      items.push({
        key: String(items.length),
        type: 'reservation',
        data: reservation,
      });
      timePointer = moment(reservation.end);
      reservationPointer += 1;
    } else {
      items.push({
        key: String(items.length),
        type: 'reservation-slot',
        data: {
          begin: timePointer.format(),
          end: timePointer.clone().add(size, 'minutes').format(),
          resourceId,
          // isSelectable: false by default to improve selector performance by allowing
          // addSelectionData to make some assumptions.
          isSelectable: false,
          width: size,
          isCooldown: false,
          cooldownSize,
        },
      });
      timePointer.add(size, 'minutes');
    }
  }
  return items;
}

function isInsideOpeningHours(item, openingHours) {
  return some(openingHours, opening => (
    opening.opens <= item.data.begin && item.data.end <= opening.closes
  ));
}

//
/**
 * Checks if item(timeslot) is after given (reservableAfter) time
 * @param {timeslot} item - timeslot
 * @param {string} reservableAfter - value of moment(reservableAfter).toISOString(true))
 *
 */
function isAfterReservableAfter(item, reservableAfter) {
  return (item.data.begin >= reservableAfter && item.data.end >= reservableAfter);
}

function markItemSelectable(item, isSelectable, openingHours, reservableAfter, isAdmin) {
  const selectable = (
    isSelectable
    && moment().isSameOrBefore(item.data.end)
    && (!openingHours || isInsideOpeningHours(item, openingHours))
    && (isAdmin ? true : isAfterReservableAfter(item, moment(reservableAfter).toISOString(true)))
  );
  return { ...item, data: { ...item.data, isSelectable: selectable } };
}

function markItemsSelectable(items, isSelectable, openingHours, reservableAfter, isAdmin) {
  return items.map((item) => {
    if (item.type === 'reservation') return item;
    return markItemSelectable(item, isSelectable, openingHours, reservableAfter, isAdmin);
  });
}

function addSelectionData(selection, resource, items, isAdmin) {
  if (!selection) {
    return markItemsSelectable(items, true, resource.openingHours, resource.reservableAfter, isAdmin);
  }
  if (selection.resourceId !== resource.id) {
    // isSelectable is false by default, so nothing needs to be done.
    // This is a pretty important performance optimization when there are tons of
    // resources in the AvailabilityView and the selection is in a state where the
    // first click has been done but the second (end time) hasn't. Without this
    // optimization we'd be calling markItemSelectable for every slot in every
    // resource when the user hovers to another slot.
    return items;
  }
  let lastSelectableFound = false;
  return items.map((item) => {
    if (lastSelectableFound || item.data.begin < selection.begin) {
      if (item.type === 'reservation') return item;
      // isSelectable is false by default.
      return item;
    }
    if (item.type === 'reservation') {
      lastSelectableFound = true;
      return item;
    }
    return markItemSelectable(item, true, resource.openingHours, resource.reservableAfter, isAdmin);
  });
}

export default {
  addSelectionData,
  getCooldown,
  getSlotSize,
  getTimelineItems,
  getTimeSlotWidth,
  isAfterReservableAfter,
};
