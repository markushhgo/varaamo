import types from 'constants/ActionTypes';

import Immutable from 'seamless-immutable';

import APP from '../../constants/AppConstants';


const initialState = Immutable({
  contrast: true,
  fontSize: APP.FONT_SIZES.SMALL
});

function toggleContrast(state) {
  return { ...state, contrast: !state.contrast };
}

function changeFontSize(state, data) {
  return { ...state, fontSize: data };
}

function accessReducer(state = initialState, action) {
  switch (action.type) {
    case types.ACC.CHANGE_CONTRAST: {
      return toggleContrast(state);
    }
    case types.ACC.CHANGE_FONTSIZE: {
      return changeFontSize(state, action.payload);
    }
    default: {
      return state;
    }
  }
}

export default accessReducer;
