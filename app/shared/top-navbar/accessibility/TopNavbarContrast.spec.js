import React from 'react';
import simple from 'simple-mock';

import ContrastChanger from './TopNavbarContrast';
import { shallowWithIntl } from 'utils/testUtils';

describe('shared/top-navbar/accessibility/TopNavbarContrast', () => {
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

  test('renders accessibility__contrast div', () => {
    const element = content.find('.accessibility__contrast');
    expect(element.length).toBe(1);
  });

  test('renders contrast title', () => {
    const text = content.find('.accessibility__contrast').text();
    expect(text).toBe('Nav.Contrast.title');
  });

  test('renders contrast_button', () => {
    const element = content.find('.contrast_button');
    expect(element.length).toBe(1);
  });

  describe('button reacts to', () => {
    test('onKeyDown', () => {
      const changeContrast = simple.mock();
      const instance = getWrapper({ changeContrast }).instance();
      const kbEvent = { keyCode: 13 };
      instance.handleKeyDown(kbEvent);
      expect(changeContrast.callCount).toBe(1);
    });
  });
});
