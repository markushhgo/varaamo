import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { changeFontSize } from 'actions/searchActions';
import FontSizeChanger from './TopNavbarFontChanger';


const fontSizeSelector = state => state.acc.fontSize;

export const selector = createStructuredSelector({
  fontSize: fontSizeSelector,
});

const actions = {
  changeFontSize,
};

export default connect(selector, actions)(FontSizeChanger);
