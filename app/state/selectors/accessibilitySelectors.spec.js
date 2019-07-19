import APP from 'constants/AppConstants';

import { getState } from 'utils/testUtils';
import { isLargerFontSizeSelector } from './accessibilitySelectors';

describe('state/selectors/accessibilitySelectors', () => {
  describe('isLargerFontSizeSelector', () => {
    function getSelected(fontSize = APP.FONT_SIZES.SMALL) {
      const state = getState({
        'ui.accessability': { fontSize }
      });
      return isLargerFontSizeSelector(state);
    }

    test('returns false if font size is small/default', () => {
      expect(getSelected()).toBe(false);
    });

    test('returns true if font size is medium', () => {
      expect(getSelected(APP.FONT_SIZES.MEDIUM)).toBe(true);
    });

    test('returns true if font size is large', () => {
      expect(getSelected(APP.FONT_SIZES.LARGE)).toBe(true);
    });
  });
});
