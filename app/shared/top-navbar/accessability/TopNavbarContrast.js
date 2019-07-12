import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { injectT } from 'i18n';

class ContrastChanger extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    changeContrast: PropTypes.func,
  };

  render() {
    const { t, changeContrast } = this.props;
    return (
      <li className="navbar__contrast" role="presentation">
        <div className="accessability__contrast">
          {t('Nav.Contrast.title')}
          <div className="contrast_button" onClick={() => changeContrast()} tabIndex="0" />
        </div>
      </li>
    );
  }
}

export default injectT(ContrastChanger);
