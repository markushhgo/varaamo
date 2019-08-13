import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { clearSearchResults } from 'actions/searchActions';
import { isAdminSelector, isLoggedInSelector } from 'state/selectors/authSelectors';
import { contrastSelector } from 'state/selectors/accessibilitySelectors';
import { changeLocale } from 'i18n';
import MainNavbar from './MainNavbar';

const contrastOptionsSelector = state => contrastSelector(state);

export const selector = createStructuredSelector({
  isAdmin: isAdminSelector,
  isLoggedIn: isLoggedInSelector,
  contrast: contrastOptionsSelector,
});

const actions = {
  changeLocale,
  clearSearchResults,
};

export default connect(selector, actions)(MainNavbar);
