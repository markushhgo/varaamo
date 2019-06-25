import trim from 'lodash/trim';
import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { clearSearchResults, changeContrast, changeFontSize } from 'actions/searchActions';
import { currentUserSelector, isLoggedInSelector } from 'state/selectors/authSelectors';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';
import { toggleContrast } from 'state/selectors/accessSelector';
import { changeLocale } from 'i18n';
import TopNavbar from './TopNavbar';


const userNameSelector = createSelector(
  currentUserSelector,
  (user) => {
    if (user.firstName || user.lastName) {
      return trim([user.firstName, user.lastName].join(' '));
    } if (user.email) {
      return user.email;
    }
    return user.emails && user.emails.length ? user.emails[0].value : '';
  }
);

const contrastSelector = state => state.acc.contrast;
const fontSizeSelector = state => state.acc.fontSize;

export const selector = createStructuredSelector({
  isLoggedIn: isLoggedInSelector,
  currentLanguage: currentLanguageSelector,
  userName: userNameSelector,
  contrast: contrastSelector,
  fontSize: fontSizeSelector,
});

const actions = {
  changeLocale,
  clearSearchResults,
  changeContrast,
  changeFontSize,
};

export default connect(selector, actions)(TopNavbar);
