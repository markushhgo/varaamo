
import filter from 'lodash/filter';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import moment from 'moment';
import queryString from 'query-string';

import constants from 'constants/AppConstants';
import { getCurrentReservation, getNextAvailableTime } from 'utils/reservationUtils';
import { getPrettifiedPeriodUnits } from './timeUtils';

function hasMaxReservations(resource) {
  let isMaxReservations = false;
  if (resource.maxReservationsPerUser && resource.reservations) {
    const ownReservations = filter(resource.reservations, { isOwn: true });
    let reservationCounter = 0;
    forEach(ownReservations, (reservation) => {
      if (moment(reservation.end).isAfter(moment())) {
        reservationCounter += 1;
      }
    });
    isMaxReservations = reservationCounter >= resource.maxReservationsPerUser;
  }
  return isMaxReservations;
}

function isOpenNow(resource) {
  const { closes, opens } = getOpeningHours(resource);
  const now = moment();
  if (now >= moment(opens) && now <= moment(closes)) {
    return true;
  }
  return false;
}

function getAvailabilityDataForNow(resource = {}, date = null) {
  const { closes, opens } = getOpeningHours(resource, date);
  const reservations = getOpenReservations(resource);

  if (!closes || !opens) {
    return { status: 'closed', bsStyle: 'danger' };
  }

  const nowMoment = moment();
  const opensMoment = moment(opens);
  const closesMoment = moment(closes);
  const beginMoment = nowMoment > opensMoment ? nowMoment : opensMoment;
  const currentReservation = getCurrentReservation(reservations);

  if (nowMoment > closesMoment) {
    return { status: 'closed', bsStyle: 'danger' };
  }

  if (currentReservation || nowMoment < opensMoment) {
    const nextAvailableTime = getNextAvailableTime(reservations, beginMoment);
    if (nextAvailableTime < closesMoment) {
      return {
        status: 'availableAt',
        bsStyle: 'danger',
        values: { time: nextAvailableTime.format(constants.TIME_FORMAT) },
      };
    }
    return { status: 'reserved', bsStyle: 'danger' };
  }

  return { status: 'available', bsStyle: 'success' };
}

function getAvailabilityDataForWholeDay(resource = {}, date = null) {
  const { closes, opens } = getOpeningHours(resource, date);
  const reservations = getOpenReservations(resource);

  if (!closes || !opens) {
    return { status: 'closed', bsStyle: 'danger' };
  }

  if (reservingIsRestricted(resource, date)) {
    return { status: 'reservingRestricted', bsStyle: 'danger' };
  }

  const opensMoment = moment(opens);
  const closesMoment = moment(closes);
  let total = closesMoment - opensMoment;

  forEach(reservations, (reservation) => {
    const resBeginMoment = moment(reservation.begin);
    if (!resBeginMoment.isSame(opensMoment, 'd')) {
      return;
    }
    const resEndMoment = moment(reservation.end);
    total -= resEndMoment;
    total += resBeginMoment;
  });

  const asHours = moment.duration(total).asHours();
  const rounded = Math.ceil(asHours * 2) / 2;

  if (rounded === 0) {
    return { status: 'reserved', bsStyle: 'danger' };
  }

  return {
    status: 'availableTime',
    bsStyle: 'success',
    values: { hours: rounded },
  };
}

function getEquipment(resource) {
  const resourceEquipment = [];
  const equipment = resource.equipment;
  forEach(equipment, (thing) => {
    resourceEquipment.push(thing.name);
  });
  return resourceEquipment;
}

function getPriceUnit(resourcePriceType) {
  switch (resourcePriceType) {
    case constants.RESOURCE_PRICE_TYPES.HOURLY:
      return 'hour';
    case constants.RESOURCE_PRICE_TYPES.DAILY:
      return 'day';
    case constants.RESOURCE_PRICE_TYPES.WEEKLY:
      return 'week';
    case constants.RESOURCE_PRICE_TYPES.FIXED:
    default:
      return null;
  }
}

function getPriceEnding(resourcePriceType, labels) {
  const resourcePriceUnit = getPriceUnit(resourcePriceType);
  const translatedPriceUnit = resourcePriceUnit ? labels[resourcePriceUnit] : null;

  return resourcePriceUnit ? `€/${translatedPriceUnit}` : '€';
}

function getPrice(t, resource) {
  const minPrice = !isNaN(resource.minPrice)
    ? Number(resource.minPrice)
    : resource.minPrice;
  const maxPrice = !isNaN(resource.maxPrice)
    ? Number(resource.maxPrice)
    : resource.maxPrice;

  if (!(minPrice || maxPrice)) {
    return t('ResourceIcons.free');
  }

  const priceEnding = getPriceEnding(resource.priceType, {
    hour: t('common.unit.time.hour'),
    day: t('common.unit.time.day'),
    week: t('common.unit.time.week'),
  });

  const minIsEmpty = resource.minPrice === null || resource.minPrice === '' || resource.minPrice === undefined;
  if (!minIsEmpty && minPrice === 0 && maxPrice > 0) {
    return `${Number(minPrice)} - ${Number(maxPrice)} ${priceEnding}`;
  }

  if (minPrice && maxPrice && minPrice !== maxPrice) {
    return `${Number(minPrice)} - ${Number(maxPrice)} ${priceEnding}`;
  }

  const priceString = maxPrice || minPrice;
  const price = priceString !== 0 ? Number(priceString) : 0;

  if (price === 0) {
    return t('ResourceIcons.free');
  }

  return price ? `${price} ${priceEnding}` : null;
}

function getHumanizedPeriod(period) {
  if (!period) {
    return '';
  }
  return `${moment.duration(period).hours()} h`;
}

function getMaxPeriodText(t, { maxPeriod }) {
  const days = parseInt(moment.duration(maxPeriod).asDays(), 10);
  if (days > 0) {
    return t('ResourceHeader.maxPeriodDays', { days });
  }
  return getPrettifiedPeriodUnits(maxPeriod);
}

function getMinPeriodText(t, { minPeriod }) {
  const days = parseInt(moment.duration(minPeriod).asDays(), 10);
  if (days > 0) {
    return t('ResourceHeader.minPeriodDays', { days });
  }
  return getPrettifiedPeriodUnits(minPeriod);
}

function getOpeningHours(resource, selectedDate) {
  if (resource && resource.openingHours && resource.openingHours.length) {
    if (selectedDate) {
      const openingHours = find(resource.openingHours, ({ date }) => date === selectedDate);
      return openingHours
        ? {
          closes: openingHours.closes,
          opens: openingHours.opens,
        }
        : {};
    }
    return {
      closes: resource.openingHours[0].closes,
      opens: resource.openingHours[0].opens,
    };
  }

  return {};
}

function getOpenReservations(resource) {
  return filter(
    resource.reservations,
    reservation => reservation.state !== 'cancelled' && reservation.state !== 'denied'
  );
}

/**
 * Returns a customer group name from the given resource based on the given customer group id.
 * If the given resource doesn't have a product with given customer group id, undefined
 * is returned.
 * @param {object} resource
 * @param {string} customerGroupId
 * @returns {string|undefined} customer group name
 */
function getResourceCustomerGroupName(resource, customerGroupId) {
  if (resource && customerGroupId) {
    const { products } = resource;
    for (let productIndex = 0; productIndex < products.length; productIndex += 1) {
      const { productCustomerGroups } = products[productIndex];
      for (let groupIndex = 0; groupIndex < productCustomerGroups.length; groupIndex += 1) {
        const group = productCustomerGroups[groupIndex];
        if (group.customerGroup.id === customerGroupId) {
          return group.customerGroup.name;
        }
      }
    }
  }

  return undefined;
}

function getResourcePageUrl(resource, date, time) {
  if (!resource || !resource.id) {
    return '';
  }
  const { pathname, query } = getResourcePageUrlComponents(resource, date, time);
  return query ? `${pathname}?${query}` : pathname;
}

function getResourcePageUrlComponents(resource, date, time) {
  if (!resource || !resource.id) {
    return { pathname: '', query: '' };
  }
  const pathname = `/resources/${resource.id}`;
  const query = queryString.stringify({
    date: date ? date.split('T')[0] : undefined,
    time,
  });
  return { pathname, query };
}

function getTermsAndConditions(resource = {}) {
  const genericTerms = resource.genericTerms && !isEmpty(resource.genericTerms) ? resource.genericTerms : '';
  const specificTerms = resource.specificTerms || '';

  if (genericTerms && specificTerms) {
    return `${specificTerms}\n\n${genericTerms}`;
  }
  return `${specificTerms}${genericTerms}`;
}

function getPaymentTermsAndConditions(resource = {}) {
  return resource.paymentTerms && !isEmpty(resource.paymentTerms) ? resource.paymentTerms : '';
}

function reservingIsRestricted(resource, date) {
  if (!date) {
    return false;
  }
  const isAdmin = resource.userPermissions && resource.userPermissions.isAdmin;
  const isLimited = resource.reservableBefore
    && moment(getNaiveDate(resource.reservableBefore), 'YYYY-MM-DD').isSameOrBefore(moment(date), 'day');
  return Boolean(isLimited && !isAdmin);
}

/**
 * Returns naive date part of the datetime string.
 * @param {string} datetime e.g. 2024-11-03T00:00:00+03:00
 * @returns {string} e.g. 2024-11-03 or empty string if datetime is falsy
 */
function getNaiveDate(datetime) {
  if (datetime) return datetime.split('T')[0];
  return '';
}

/**
 * Check whether current user has any of the staff permissions:
 * admin, manager or viewer for given resource.
 * @param {object} resource
 * @returns {boolean} true when user has any of the staff permissions, false if not.
 */
function isStaffForResource(resource) {
  if (resource.userPermissions) {
    const perms = resource.userPermissions;
    if (perms.isAdmin || perms.isManager || perms.isViewer) {
      return true;
    }
  }
  return false;
}

/**
 * Check whether current user is admin for given resource.
 * @param {Object} resource
 * @returns {boolean} true when user is admin for given resource, false if not.
 */
function isAdminForResource(resource) {
  if (resource.userPermissions) {
    const perms = resource.userPermissions;
    if (perms.isAdmin) {
      return true;
    }
  }
  return false;
}

/**
 * Check whether current user is manager for given resource.
 * @param {Object} resource
 * @returns {boolean} true when user is manager for given resource, false if not.
 */
function isManagerForResource(resource) {
  if (resource.userPermissions) {
    const perms = resource.userPermissions;
    if (perms.isManager) {
      return true;
    }
  }
  return false;
}

/**
 * Checks whether strong auth requirement is satisfied with given resource and
 * strong auth status.
 * @param {object} resource
 * @param {boolean} hasStrongAuth has user authenticated via strong method
 * @returns {boolean} true when resource requires strong auth and user has strong auth
 * or when resource doesnt require strong auth. False in other cases.
 */
function isStrongAuthSatisfied(resource, hasStrongAuth) {
  const strongAuthRequired = resource.authentication === 'strong';
  return !strongAuthRequired || (strongAuthRequired && hasStrongAuth);
}

/**
 * Rearranges resources in the given order.
 * @param {string[]} resources e.g. ["id1", "id2", "id3"]
 * @param {string[]} resourceOrder e.g. ["id3", "id2", "id1"]
 * @returns {string[]} rearranged resources e.g. ["id3", "id2", "id1"]
 */
function rearrangeResources(resources, resourceOrder) {
  const orgResources = [...resources];
  const rearranged = [];

  for (let index = 0; index < resourceOrder.length; index += 1) {
    const resource = resourceOrder[index];
    const sourceIndex = orgResources.indexOf(resource);

    if (sourceIndex !== -1) {
      rearranged.push(orgResources[sourceIndex]);
      orgResources.splice(sourceIndex, 1);
    }
  }

  rearranged.push(...orgResources);
  return rearranged;
}

/**
 * Checks whether given time string is below 24 hours
 * @param {string} timeString e.g. "01:00:00" or "1 10:00:00"
 * @returns {boolean} true if time string is below 24 hours
 */
function isBelow24Hours(timeString) {
  if (!timeString) {
    return false;
  }
  const duration = moment.duration(timeString);
  const twentyFourHours = moment.duration(24, 'hours');
  return duration.asMilliseconds() < twentyFourHours.asMilliseconds();
}

/**
 * Checks whether to show min period or not.
 * @param {string} minPeriod e.g. "01:00:00" or "1 10:00:00"
 * @param {boolean} overnightReservations is resource overnight or normal
 * @returns {boolean} show min period or not
 */
function showMinPeriod(minPeriod, overnightReservations) {
  if (minPeriod && !overnightReservations) {
    return true;
  }
  if (minPeriod && overnightReservations) {
    return !isBelow24Hours(minPeriod);
  }
  return false;
}

export {
  hasMaxReservations,
  isOpenNow,
  getAvailabilityDataForNow,
  getAvailabilityDataForWholeDay,
  getEquipment,
  getHumanizedPeriod,
  getMaxPeriodText,
  getOpeningHours,
  getOpenReservations,
  getResourceCustomerGroupName,
  getResourcePageUrl,
  getResourcePageUrlComponents,
  getTermsAndConditions,
  getPaymentTermsAndConditions,
  getPrice,
  reservingIsRestricted,
  getMinPeriodText,
  isStaffForResource,
  isStrongAuthSatisfied,
  isAdminForResource,
  isManagerForResource,
  rearrangeResources,
  isBelow24Hours,
  showMinPeriod,
  getNaiveDate,
};
