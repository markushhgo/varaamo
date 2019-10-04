import React from 'react';
import Alert from 'react-bootstrap/lib/Alert';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import TestSiteMessage from './TestSiteMessage';

describe('shared/test-site-message/TestSiteMessage', () => {
  function getWrapper() {
    return shallowWithIntl(<TestSiteMessage />);
  }

  describe('TestSiteMessage ', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      process.env = { ...OLD_ENV };
      delete process.env.NODE_ENV;
    });

    afterAll(() => {
      simple.restore();
    });

    afterEach(() => {
      process.env = OLD_ENV;
    });

    test('renders an Alert when NODE_ENV = development', () => {
      process.env.NODE_ENV = 'development';
      const alert = getWrapper().find(Alert);
      const returnValue = getWrapper();
      expect(alert).toHaveLength(1);
      expect(returnValue.type()).toEqual(Alert);
    });

    test('does not render an Alert, returns null when NODE_ENV is not development', () => {
      process.env.NODE_ENV = 'production';
      const alert = getWrapper().find(Alert);
      const returnValue = getWrapper();
      expect(alert).toHaveLength(0);
      expect(returnValue.type()).toEqual(null);
    });
  });
});
