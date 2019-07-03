import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { changeContrast } from 'actions/searchActions';
import ContrastChanger from './TopNavbarContrast';


const contrastSelector = state => state.acc.contrast;

export const selector = createStructuredSelector({
  contrast: contrastSelector,
});

const actions = {
  changeContrast,
};

export default connect(selector, actions)(ContrastChanger);
