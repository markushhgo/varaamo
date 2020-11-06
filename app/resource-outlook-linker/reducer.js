import Immutable from 'seamless-immutable';
import {
  omit,
  reduce,
} from 'lodash';

import {
  actionTypes
} from './actions';

const initialState = Immutable({});

function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.RESOURCE_OUTLOOK_CALENDAR_LINK_CREATE_SUCCESS:
      window.location = action.payload.redirect_link;
      break;
    case actionTypes.RESOURCE_OUTLOOK_CALENDAR_LINKS_GET_SUCCESS:
      // Return map with resource id as key and link information as value.
      return reduce(action.payload.results,
        (map, value) => ({ ...map, [value.resource]: value }), {});
    case actionTypes.RESOURCE_OUTLOOK_CALENDAR_LINK_DELETE_SUCCESS:
      // Removal was success. Remove link from the state.
      return omit(state, [action.meta.resourceId]);
    default:
      break;
  }
  return state;
}

export default reducer;
