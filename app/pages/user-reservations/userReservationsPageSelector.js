import { createStructuredSelector } from 'reselect';

import { isAdminSelector } from 'state/selectors/authSelectors';
import { contrastSelector } from 'state/selectors/accessibilitySelectors';

const adminReservationFiltersSelector = state => state.ui.reservations.adminReservationFilters;
const reservationsFetchCountSelector = state => state.api.fetchCounts.reservations;
const resourcesLoadedSelector = state => !state.api.shouldFetch.resources;

const userReservationsPageSelector = createStructuredSelector({
  adminReservationFilters: adminReservationFiltersSelector,
  isAdmin: isAdminSelector,
  reservationsFetchCount: reservationsFetchCountSelector,
  resourcesLoaded: resourcesLoadedSelector,
  contrast: contrastSelector
});

export default userReservationsPageSelector;
