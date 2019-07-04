import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { changeFontSize } from 'actions/uiActions';
import FontSizeChanger from './TopNavbarFontChanger';


const fontSizeSelector = state => state.ui.accessability.fontSize;

export const selector = createStructuredSelector({
  fontSize: fontSizeSelector,
});

const actions = {
  changeFontSize,
};

export default connect(selector, actions)(FontSizeChanger);
