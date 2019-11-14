import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';

import { injectT } from 'i18n';

function LogoutControls(props) {
  const [logoutOpen, toggleLogoutOpen] = useState(false);
  const { handleLogoutClick, userName, t } = props;
  const ref = useRef();

  const onToggle = (e) => {
    e.preventDefault();
    toggleLogoutOpen(!logoutOpen);
  };

  const handleOutsideClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      if (logoutOpen) {
        toggleLogoutOpen(!logoutOpen);
      }
    }
  };
  // using React.useEffect instead of just useEffect for test purposes
  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  });

  return (
    <React.Fragment>
      <li className={`navbar__logout-button ${logoutOpen ? 'open' : 'closed'}`} ref={ref}>
        <a
          aria-expanded={logoutOpen}
          aria-haspopup="true"
          aria-label={t('Navbar.logout')}
          href="#"
          onClick={onToggle}
          role="button"
        >
          {userName}
        </a>
        <ul className="logout-dropdown-menu">
          <li>
            <a href="#" onClick={handleLogoutClick} role="button">{t('Navbar.logout')}</a>
          </li>
        </ul>
      </li>
    </React.Fragment>
  );
}

LogoutControls.propTypes = {
  userName: PropTypes.string,
  handleLogoutClick: PropTypes.func,
  t: PropTypes.func,
};

export default injectT(LogoutControls);
