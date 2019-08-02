import { mapStateToProps } from './AboutPageContainer';

describe('pages/about/AboutPageContainer', () => {
  describe('selector', () => {
    function getState(locale = 'fi') {
      return {
        intl: {
          locale,
        }
      };
    }

    describe('currentLanguage', () => {
      test('returns current locale', () => {
        const selected = mapStateToProps(getState('fi'));
        expect(selected.currentLanguage).toBe('fi');
      });
    });
  });
});
