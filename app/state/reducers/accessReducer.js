const initialState = {
  contrast: true
};

const CHANGE_CONTRAST = 'CHANGE_CONTRAST';

function accessReducer(state = initialState, action) {
  switch (action) {
    case CHANGE_CONTRAST: {
      return {
        contrast: !state.contrast
      };
    }
    default: {
      return state;
    }
  }
}

export default accessReducer;
