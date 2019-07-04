import ActionTypes from 'constants/ActionTypes';

import sortBy from 'lodash/sortBy';
import values from 'lodash/values';
import { createSelector, createStructuredSelector } from 'reselect';

import { purposesSelector } from 'state/selectors/dataSelectors';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const contrastSelector = state => state.ui.accessability.isNormalContrast;
const purposeOptionsSelector = createSelector(
  purposesSelector,
  (purposes) => {
    const purposeOptions = values(purposes)
      .filter(purpose => purpose.parent === null)
      .map(purpose => ({
        value: purpose.id,
        label: purpose.name,
      }));
    return sortBy(purposeOptions, 'label');
  }
);

const homePageSelector = createStructuredSelector({
  isFetchingPurposes: requestIsActiveSelectorFactory(ActionTypes.API.PURPOSES_GET_REQUEST),
  purposes: purposeOptionsSelector,
  contrast: contrastSelector,
});

export default homePageSelector;
