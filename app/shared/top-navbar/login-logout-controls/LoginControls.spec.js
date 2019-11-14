import React from 'react';
import simple from 'simple-mock';

import { mountWithIntl } from 'utils/testUtils';
import LoginControls from './LoginControls';

describe('shared/top-navbar/login-logout-controls/LoginControls', () => {
  const defaults = {
    handleLoginClick: simple.stub(),
  };

  function getWrapper(props) {
    return mountWithIntl(<LoginControls {...defaults} {...props} />);
  }

  test('returns li element with correct prop', () => {
    const element = getWrapper().find('li');
    expect(element).toHaveLength(1);
    expect(element.prop('className')).toBe('navbar__login-button');
  });

  describe('returns a', () => {
    test('with correct props', () => {
      const element = getWrapper().find('a');
      expect(element).toHaveLength(1);
      expect(element.prop('className')).toBe('');
      expect(element.prop('href')).toBe('#');
      expect(element.prop('onClick')).toBe(defaults.handleLoginClick);
    });

    test('with onClick that works', () => {
      const handleLoginClick = simple.mock();
      const element = getWrapper({ handleLoginClick }).find('a');
      element.simulate('click');
      expect(handleLoginClick.callCount).toBe(1);
    });
  });
});
