import { createSelector, createStructuredSelector } from 'reselect';

import { isLoggedInSelector } from 'state/selectors/authSelectors';
import { createResourceSelector, unitsSelector } from 'state/selectors/dataSelectors';
import { isLargerFontSizeSelector } from 'state/selectors/accessibilitySelectors';

const resourceIdSelector = (state, props) => props.resourceId;
const resourceSelector = createResourceSelector(resourceIdSelector);
const unitSelector = createSelector(
  unitsSelector,
  resourceSelector,
  (units, resource) => units[resource.unit] || {}
);

const ResourceCardSelector = createStructuredSelector({
  isLoggedIn: isLoggedInSelector,
  resource: createResourceSelector(resourceIdSelector),
  unit: unitSelector,
  isLargerFontSizeUsed: isLargerFontSizeSelector,
});

export default ResourceCardSelector;
