import React from 'react';
import simple from 'simple-mock';

import { mountWithIntl } from 'utils/testUtils';
import LogoutControls from './LogoutControls';

describe('shared/top-navbar/login-logout-controls/LogoutControls', () => {
  const defaults = {
    handleLogoutClick: simple.stub(),
    userName: 'testUser',
    event: {
      preventDefault: simple.stub(),
    },
  };

  function getWrapper(props) {
    return mountWithIntl(<LogoutControls {...defaults} {...props} />);
  }

  describe('renders', () => {
    test('useEffect is called on mount', () => {
      const useEffect = jest.spyOn(React, 'useEffect');
      const addEventListener = jest.spyOn(document, 'addEventListener');
      const removeEventListener = jest.spyOn(document, 'removeEventListener');
      const element = getWrapper();
      element.find('a').first().simulate('click');
      expect(useEffect).toHaveBeenCalled();
      expect(addEventListener).toHaveBeenCalled();
      expect(removeEventListener).toHaveBeenCalled();
    });

    describe('main li element', () => {
      test('with correct className when !logoutOpen', () => {
        const element = getWrapper().find('li').first();
        expect(element.prop('className')).toBe('navbar__logout-button closed');
      });
      test('with correct className when logoutOpen', () => {
        const element = getWrapper();
        const instance = element.find('a').first();
        instance.simulate('click');
        expect(element.find('li').first().prop('className')).toBe('navbar__logout-button open');
      });
    });

    describe('main a element', () => {
      test('with correct prop when !logoutOpen', () => {
        const element = getWrapper().find('a').first();
        expect(element.prop('aria-expanded')).toBe(false);
      });

      test('with correct prop when logoutOpen', () => {
        const element = getWrapper();
        const instance = element.find('a').first();
        instance.simulate('click');
        expect(element.find('a').first().prop('aria-expanded')).toBe(true);
      });

      test('with correct props', () => {
        const element = getWrapper().find('a').first();
        expect(element.prop('aria-haspopup')).toBe('true');
        expect(element.prop('aria-label')).toBe('Navbar.logout');
        expect(element.prop('href')).toBe('#');
        expect(element.prop('onClick')).toBeDefined();
        expect(element.prop('role')).toBe('button');
      });

      test('with correct child text', () => {
        const element = getWrapper().find('a').first();
        expect(element.text()).toBe(defaults.userName);
      });
    });

    describe('ul and nested,', () => {
      test('ul with correct props', () => {
        const element = getWrapper().find('ul');
        expect(element).toHaveLength(1);
        expect(element.prop('className')).toBe('logout-dropdown-menu');
      });

      test('li', () => {
        const element = getWrapper().find('ul').find('li');
        expect(element).toHaveLength(1);
      });

      test('a element with correct props and child', () => {
        const element = getWrapper().find('ul').find('li').find('a');
        expect(element).toHaveLength(1);
        expect(element.prop('href')).toBe('#');
        expect(element.prop('onClick')).toBeDefined();
        expect(element.prop('role')).toBe('button');
        expect(element.text()).toBe('Navbar.logout');
      });
    });
  });
});
