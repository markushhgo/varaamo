import sortBy from 'lodash/sortBy';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { showReservationInfoModal } from 'actions/uiActions';
import AvailabilityTimeline from './AvailabilityTimeline';
import utils from '../utils';

export function selector() {
  function dateSelector(state, props) { return props.date; }
  function isAdminSelector(state, props) { return props.isAdmin; }
  function resourceIdSelector(state, props) { return props.id; }
  function resourcesSelector(state) { return state.data.resources; }
  function nonHoverSelectionSelector(state, props) {
    if (props.selection && props.selection.hover) return null;
    return props.selection;
  }

  const resourceSelector = createSelector(
    resourcesSelector,
    resourceIdSelector,
    (resources, id) => resources[id]
  );
  const reservationsSelector = createSelector(
    resourceSelector,
    dateSelector,
    (resource, date) => resource.reservations && sortBy(
      resource.reservations
        .filter(reservation => reservation.state !== 'cancelled'
          && reservation.state !== 'denied')
        .filter(reservation => reservation.begin.slice(0, 10) === date),
      'begin'
    )
  );

  const slotSizeSelector = createSelector(
    resourceSelector,
    resource => resource.slotSize
  );

  const cooldownSelector = createSelector(
    resourceSelector,
    resource => resource.cooldown
  );

  const itemsSelector = createSelector(
    reservationsSelector,
    dateSelector,
    resourceIdSelector,
    slotSizeSelector,
    cooldownSelector,
    (reservations, date, resourceId, slotSize, cooldown) => utils.getTimelineItems(
      moment(date), reservations, resourceId, slotSize, cooldown
    )
  );

  const itemsWithSelectionDataSelector = createSelector(
    itemsSelector,
    nonHoverSelectionSelector,
    resourceSelector,
    isAdminSelector,
    (items, selection, resource, isAdmin) => utils.addSelectionData(
      selection, resource, items, isAdmin
    )
  );

  return createSelector(
    itemsWithSelectionDataSelector,
    items => ({ items })
  );
}

const actions = {
  onReservationClick: showReservationInfoModal,
};

const AvailabilityTimelineContainer = connect(selector, actions)(AvailabilityTimeline);
AvailabilityTimelineContainer.propTypes = {
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,

  onReservationSlotClick: PropTypes.func,
  onReservationSlotMouseEnter: PropTypes.func,
  onReservationSlotMouseLeave: PropTypes.func,
  selection: PropTypes.object,
};

export default AvailabilityTimelineContainer;
