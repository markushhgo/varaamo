import ActionTypes from 'constants/ActionTypes';

import { createSelector, createStructuredSelector } from 'reselect';

import { isAdminSelector, isLoggedInSelector } from 'state/selectors/authSelectors';
import { createResourceSelector, unitsSelector } from 'state/selectors/dataSelectors';
import { contrastSelector } from 'state/selectors/accessibilitySelectors';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';
import dateSelector from 'state/selectors/dateSelector';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const contrastOptionsSelector = state => contrastSelector(state);
const resourceIdSelector = (state, props) => props.match && props.match.params.id;
const resourceSelector = createResourceSelector(resourceIdSelector);
const showMapSelector = state => state.ui.resourceMap.showMap;
const unitSelector = createSelector(
  resourceSelector,
  unitsSelector,
  (resource, units) => units[resource.unit] || {}
);

const resourcePageSelector = createStructuredSelector({
  date: dateSelector,
  id: resourceIdSelector,
  isAdmin: isAdminSelector,
  isFetchingResource: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  isLoggedIn: isLoggedInSelector,
  resource: resourceSelector,
  showMap: showMapSelector,
  unit: unitSelector,
  contrast: contrastOptionsSelector,
  currentLanguage: currentLanguageSelector,
});

export default resourcePageSelector;
