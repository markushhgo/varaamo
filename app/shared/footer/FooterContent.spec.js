import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import { shallowWithIntl } from 'utils/testUtils';
import FooterContent from './FooterContent';

describe('shared/footer/FooterContent', () => {
  function getWrapper(props) {
    return shallowWithIntl(<FooterContent {...props} />);
  }

  describe('When there is no customization in use', () => {
    let content;

    beforeAll(() => {
      content = getWrapper();
    });

    test('contains turku img', () => {
      const image = content.find('img');
      expect(image.length).toBe(1);
    });

    test('contains feedback link', () => {
      const feedbackLink = content.find('.feedback-link');
      expect(feedbackLink.length).toBe(1);
    });

    test('renders FormattedHTMLMessage for Turku', () => {
      const texts = content.find(FormattedHTMLMessage);
      expect(texts.length).toBe(1);
    });
  });
});
