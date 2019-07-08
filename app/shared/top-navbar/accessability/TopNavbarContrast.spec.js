import React from 'react';

import ContrastChanger from './TopNavbarContrast';
import { shallowWithIntl } from 'utils/testUtils';

describe('shared/top-navbar/accessability/TopNavbarContrast', () => {
  function getWrapper(props) {
    return shallowWithIntl(<ContrastChanger {...props} />);
  }
  let content;
  beforeAll(() => {
    content = getWrapper();
  });

  test('renders li element', () => {
    const element = content.find('li');
    expect(element.length).toBe(1);
  });

  test('renders accessability__contrast div', () => {
    const element = content.find('.accessability__contrast');
    expect(element.length).toBe(1);
  });

  test('renders contrast title', () => {
    const text = content.find('.accessability__contrast').text();
    expect(text).toBe('Nav.Contrast.title');
  });

  test('renders contrast_button', () => {
    const element = content.find('.contrast_button');
    expect(element.length).toBe(1);
  });
});
