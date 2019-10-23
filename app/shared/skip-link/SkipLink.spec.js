import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import SkipLink from './SkipLink';

describe('shared/skip-link/SkipLink', () => {
  function getWrapper() {
    return shallowWithIntl(<SkipLink />);
  }

  describe('SkipLink', () => {
    let element;
    beforeAll(() => {
      element = getWrapper().find('a');
    });

    test('renders', () => {
      expect(element).toHaveLength(1);
    });

    test('renders with correct props', () => {
      expect(element.prop('className')).toBe('visually-hidden skip-link');
      expect(element.prop('href')).toBe('#main-content');
    });

    test('renders with text', () => {
      expect(element.text()).toBeDefined();
    });
  });
});
