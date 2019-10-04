import PropTypes from 'prop-types';
import React from 'react';
import Alert from 'react-bootstrap/lib/Alert';

import { injectT } from 'i18n';

function TestSiteMessage({ t }) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <Alert bsStyle="danger" className="test-site-message">
        {t('TestSiteMessage.text')}
      </Alert>
    );
  }
  return null;
}

TestSiteMessage.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(TestSiteMessage);
