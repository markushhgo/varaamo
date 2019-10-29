import ActionTypes from 'constants/ActionTypes';

import { createSelector, createStructuredSelector } from 'reselect';
import moment from 'moment';
import includes from 'lodash/includes';
import uniq from 'lodash/uniq';

import { resourcesSelector, unitsSelector } from 'state/selectors/dataSelectors';
import userIdSelector from 'state/selectors/userIdSelector';
import { getDateString } from 'utils/timeUtils';
import { contrastSelector } from 'state/selectors/accessibilitySelectors';
import { isLoggedInSelector } from 'state/selectors/authSelectors';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const dateSelector = () => getDateString();
const resourcesLoadedSelector = state => !state.api.shouldFetch.resources;

const userFavoritesSelector = state => state.ui.pages.favorites.resourceIds;

const filteredResources = createSelector(
  resourcesSelector,
  userFavoritesSelector,
  (resources, resourceIds) => resourceIds.map(id => resources[id])
);


const unitIdSelector = createSelector(
  filteredResources,
  resources => uniq(resources.map(resource => resource.unit))
);


const favoritesPageSelector = createStructuredSelector({
  contrast: contrastSelector,
  date: dateSelector,
  isLoggedIn: isLoggedInSelector,
  isFetchingResources: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCES_GET_REQUEST),
  resources: filteredResources,
  resourcesLoaded: resourcesLoadedSelector,
  favorites: userFavoritesSelector,
  units: unitsSelector,
});

export default favoritesPageSelector;
