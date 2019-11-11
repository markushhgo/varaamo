import ActionTypes from 'constants/ActionTypes';

import includes from 'lodash/includes';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import moment from 'moment';
import { createSelector, createStructuredSelector } from 'reselect';

import { isAdminSelector, isLoggedInSelector, currentUserSelector } from 'state/selectors/authSelectors';
import { resourcesSelector } from 'state/selectors/dataSelectors';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const dateSelector = state => state.ui.pages.adminResources.date || moment().format('YYYY-MM-DD');
const resourceIdsSelector = state => state.ui.pages.adminResources.resourceIds;
const selectedResourceTypesSelector = state => state.ui.pages.adminResources.selectedResourceTypes;

/**
 * if staffPerms.unit is undefined then an empty string [''] is returned.
 * @returns array of unit keys as strings
 */
const currentUserPermissionsSelector = createSelector(
  currentUserSelector,
  (user) => {
    if (!user.staffPerms.unit) return [''];
    return Object.keys(user.staffPerms.unit);
  }
);

const adminResourcesSelectors = createSelector(
  resourceIdsSelector,
  resourcesSelector,
  (resourceIds, resources) => resourceIds.map(id => resources[id])
);

const adminResourcesSelector = createSelector(
  adminResourcesSelectors,
  currentUserPermissionsSelector,
  (resources, currentUserPermissions) => resources.filter(
    resource => includes(currentUserPermissions, resource.unit)
  )
);

const adminResourceTypesSelector = createSelector(
  adminResourcesSelector,
  resources => uniq(resources.map(resource => resource.type.name))
);

const filteredAdminResourceSelector = createSelector(
  adminResourcesSelector,
  selectedResourceTypesSelector,
  currentUserPermissionsSelector,
  (resources, selectedResourceTypes, currentUserPermissions) => resources.filter(
    resource => (selectedResourceTypes.length === 0
    || includes(selectedResourceTypes, resource.type.name))
    && includes(currentUserPermissions, resource.unit)
  )
);

const filteredAdminResourcesIdsSelector = createSelector(
  filteredAdminResourceSelector,
  resources => sortBy(resources, 'name').map(res => res.id),
);

const adminResourcesPageSelector = createStructuredSelector({
  date: dateSelector,
  selectedResourceTypes: selectedResourceTypesSelector,
  isAdmin: isAdminSelector,
  isLoggedin: isLoggedInSelector,
  isFetchingResources: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCES_GET_REQUEST),
  resources: filteredAdminResourcesIdsSelector,
  resourceTypes: adminResourceTypesSelector,
});

export default adminResourcesPageSelector;
