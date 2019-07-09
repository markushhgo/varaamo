import types from 'constants/ActionTypes';

import Immutable from 'seamless-immutable';

import APP from '../../../constants/AppConstants';
import reducer from './accessabilityReducer';

describe('state/reducers/ui/accessabilityReducer', () => {
  const initialState = Immutable({
    isNormalContrast: true,
    fontSize: APP.FONT_SIZES.SMALL
  });

  test('returns correct initial state', () => {
    const actual = reducer(undefined, { type: 'nuup' });
    expect(actual).toEqual(initialState);
  });

  describe('CHANGE_CONTRAST', () => {
    const action = {
      type: types.UI.CHANGE_CONTRAST,
    };
    test('toggles contrast true to false', () => {
      const actual = reducer(Immutable({ isNormalContrast: true }), action);
      expect(actual.isNormalContrast).toBe(false);
    });
    test('toggles contrast false to true', () => {
      const actual = reducer(Immutable({ isNormalContrast: false }), action);
      expect(actual.isNormalContrast).toBe(true);
    });
  });

  describe('CHANGE_FONTSIZE', () => {
    const action = {
      type: types.UI.CHANGE_FONTSIZE,
      payload: APP.FONT_SIZES.MEDIUM,
    };
    test('changes fontsize successfully', () => {
      const actual = reducer(undefined, action);
      expect(actual.fontSize).toBe(APP.FONT_SIZES.MEDIUM);
    });
  });
});
