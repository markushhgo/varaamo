import { selector } from './TopNavbarContrastContainer';

describe('shared/top-navbar/accessability/TopNavbarContrastContainer', () => {
  describe('selector', () => {
    function getState() {
      return {
        ui: {
          accessability: { isNormalContrast: true }
        }
      };
    }

    describe('contrast', () => {
      test('return contrast', () => {
        const selected = selector(getState());
        expect(selected.contrast).toBeDefined();
      });
    });
  });
});
