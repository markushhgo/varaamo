import { selector } from './TopNavbarContrastContainer';

describe('shared/top-navbar/accessibility/TopNavbarContrastContainer', () => {
  describe('selector', () => {
    function getState() {
      return {
        ui: {
          accessibility: { isHighContrast: false }
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
