import { cleanseNamedLinks } from 'utils/textUtils';

describe('Utils: textUtils', () => {
  describe('cleanseNamedLinks', () => {
    test('replaces all named links with only the link names', () => {
      const testText = 'text and [named link](https://www.google.com) and text again and [link](url)';
      const expectedResult = 'text and named link and text again and link';
      expect(cleanseNamedLinks(testText)).toEqual(expectedResult);
    });
    test('returns an empty string if the given text is an empty string', () => {
      expect(cleanseNamedLinks('')).toEqual('');
    });
  });
});
