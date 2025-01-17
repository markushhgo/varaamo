import keyBy from 'lodash/keyBy';

import Purpose from 'utils/fixtures/Purpose';
import { getDefaultRouterProps, getState } from 'utils/testUtils';
import homePageSelector from './homePageSelector';

describe('pages/home/homePageSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    const props = getDefaultRouterProps();
    return homePageSelector(state, props);
  }

  test('returns isFetchingPurposes', () => {
    expect(getSelected().isFetchingPurposes).toBeDefined();
  });

  test('returns isLargerFontSize', () => {
    expect(getSelected().isLargerFontSize).toBeDefined();
  });

  test('returns authUserAmr', () => {
    expect(getSelected().authUserAmr).toBeDefined();
  });

  test('returns isAdmin', () => {
    expect(getSelected().isAdmin).toBeDefined();
  });

  test('returns currentLanguage', () => {
    expect(getSelected().currentLanguage).toBeDefined();
  });

  describe('purposes', () => {
    function getPurposes(purposes) {
      return getSelected({
        'data.purposes': keyBy(purposes, 'id'),
      }).purposes;
    }

    test('returns an empty array if state contains no purposes', () => {
      expect(getPurposes([])).toEqual([]);
    });

    test('returns an option object for each purpose without a parent', () => {
      const purposes = [
        Purpose.build({ parent: null }),
        Purpose.build({ parent: null }),
      ];
      expect(getPurposes(purposes)).toHaveLength(purposes.length);
    });

    test('Does not return an option object for purposes with a parent', () => {
      const purposes = [
        Purpose.build({ parent: 'some parent' }),
      ];
      expect(getPurposes(purposes)).toHaveLength(0);
    });

    describe('a returned option object', () => {
      const purpose = Purpose.build({ parent: null });
      function getPurpose() {
        return getPurposes([purpose])[0];
      }

      test('has purpose.id as its value property', () => {
        expect(getPurpose().value).toBe(purpose.id);
      });

      test('has purpose.name as its label property', () => {
        expect(getPurpose().label).toBe(purpose.name);
      });

      test('has purpose.image as its image property', () => {
        expect(getPurpose().image).toBe(purpose.image);
      });

      test('does not contain other properties than value, label and image', () => {
        const expected = { value: purpose.id, label: purpose.name, image: purpose.image };
        expect(getPurpose()).toEqual(expected);
      });
    });
  });
});
