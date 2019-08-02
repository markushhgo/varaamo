import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { injectT } from 'i18n';

class ContrastChanger extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    changeContrast: PropTypes.func,
  };

  handleKeyDown = (ev) => {
    if (ev.keyCode === 13) {
      this.props.changeContrast();
    }
  }

  render() {
    const { t, changeContrast } = this.props;
    return (
      <li className="navbar__contrast" role="presentation">
        <div aria-label={t('Nav.Contrast.title')} className="accessability__contrast">
          {t('Nav.Contrast.title')}
          <div className="contrast_button" onClick={() => changeContrast()} onKeyDown={this.handleKeyDown} tabIndex="0" />
        </div>
      </li>
    );
  }
}

export default injectT(ContrastChanger);
