import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { injectT } from 'i18n';

class ContrastChanger extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    changeContrast: PropTypes.func,
  };


  constructor(props) {
    super(props);
    this.state = {
      ariaState: false,
    };
  }


  handleKeyDown = (ev) => {
    if (ev.keyCode === 13) {
      this.props.changeContrast();
      this.toggleAriaState();
    }
  }

  handleOnClick = () => {
    this.props.changeContrast();
    this.toggleAriaState();
  }

  toggleAriaState() {
    this.setState(prevState => ({ ariaState: !prevState.ariaState }));
  }

  render() {
    const { t } = this.props;
    return (
      <li className="navbar__contrast" role="presentation">
        <div aria-label={t('Nav.Contrast.title')} className="accessibility__contrast">
          {t('Nav.Contrast.title')}
          <div
            aria-label={t('Nav.Contrast.title')}
            aria-pressed={this.state.ariaState}
            className="contrast_button"
            onClick={this.handleOnClick}
            onKeyDown={this.handleKeyDown}
            role="button"
            tabIndex="0"
          />
        </div>
      </li>
    );
  }
}

export default injectT(ContrastChanger);
