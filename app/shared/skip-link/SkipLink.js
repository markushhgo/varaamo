import PropTypes from 'prop-types';
import React from 'react';

import { injectT } from 'i18n';

function SkipLink({ t }) {
  return (
    <a
      className="visually-hidden skip-link"
      href="#main-content"
    >
      {t('SkipLink.text')}
    </a>
  );
}

SkipLink.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(SkipLink);
