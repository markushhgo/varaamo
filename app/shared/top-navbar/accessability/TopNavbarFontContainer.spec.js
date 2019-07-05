import ACC from 'constants/AppConstants';

import { selector } from './TopNavbarFontContainer';

describe('shared/top-navbar/accessability/TopNavbarFontContainer', () => {
  describe('selector', () => {
    function getState() {
      return {
        ui: {
          accessability: { fontSize: ACC.FONT_SIZES.SMALL }
        }
      };
    }

    describe('font size', () => {
      test('return font size', () => {
        const selected = selector(getState());
        expect(selected.fontSize).toBeDefined();
      });
    });
  });
});
