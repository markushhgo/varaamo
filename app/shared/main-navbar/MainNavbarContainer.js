import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { clearSearchResults } from 'actions/searchActions';
import { isAdminSelector, isLoggedInSelector } from 'state/selectors/authSelectors';
import { changeLocale } from 'i18n';
import MainNavbar from './MainNavbar';

const contrastSelector = state => state.acc.contrast;

export const selector = createStructuredSelector({
  isAdmin: isAdminSelector,
  isLoggedIn: isLoggedInSelector,
  contrast: contrastSelector,
});

const actions = {
  changeLocale,
  clearSearchResults,
};

export default connect(selector, actions)(MainNavbar);
