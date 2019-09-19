import {
  getServiceMapUrl,
} from 'utils/unitUtils';

describe('Utils: unitUtils', () => {
  describe('getServiceMapUrl', () => {
    test('returns correct url when unit has mapServiceId defined', () => {
      const unit = { mapServiceId: '123' };
      const expected = 'https://palvelukartta.turku.fi/unit/123#!route-details';

      expect(getServiceMapUrl(unit)).toBe(expected);
    });

    test('returns empty string when unit or unit.mapServiceId is missing', () => {
      const unit = { mapServiceId: null };
      expect(getServiceMapUrl(unit)).toBe('');
    });
  });
});
