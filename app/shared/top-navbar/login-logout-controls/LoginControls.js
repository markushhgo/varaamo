import PropTypes from 'prop-types';
import React from 'react';

import { injectT } from 'i18n';

function LoginControls(props) {
  const { handleLoginClick, t } = props;
  return (
    <React.Fragment>
      <li className="navbar__login-button">
        <a className="" href="#" onClick={handleLoginClick}>
          {t('Navbar.login')}
        </a>
      </li>
    </React.Fragment>
  );
}

LoginControls.propTypes = {
  handleLoginClick: PropTypes.func,
  t: PropTypes.func,
};

export default injectT(LoginControls);
