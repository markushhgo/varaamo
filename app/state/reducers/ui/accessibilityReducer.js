import types from 'constants/ActionTypes';

import Immutable from 'seamless-immutable';

import APP from '../../../constants/AppConstants';


const initialState = Immutable({
  isNormalContrast: true,
  fontSize: APP.FONT_SIZES.SMALL
});

function toggleContrast(state) {
  return { ...state, isNormalContrast: !state.isNormalContrast };
}

function changeFontSize(state, data) {
  return { ...state, fontSize: data };
}

function accessibilityReducer(state = initialState, action) {
  switch (action.type) {
    case types.UI.CHANGE_CONTRAST: {
      return toggleContrast(state);
    }
    case types.UI.CHANGE_FONTSIZE: {
      return changeFontSize(state, action.payload);
    }
    default: {
      return state;
    }
  }
}

export default accessibilityReducer;
