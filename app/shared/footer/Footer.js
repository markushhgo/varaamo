import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import FooterContent from './FooterContent';

export function Footer(props) {
  const style = props.contrast ? 'normal-contrast' : 'high-contrast';
  return (
    <footer aria-label="Footer" className={style}>
      <FooterContent currentLang={props.currentLanguage} onLinkClick={props.onLinkClick} />
    </footer>
  );
}

Footer.propTypes = {
  onLinkClick: PropTypes.func,
  contrast: PropTypes.bool,
  currentLanguage: PropTypes.string,

};

const mapStateToProps = state => ({
  contrast: state.ui.accessibility.isNormalContrast,
  currentLanguage: state.intl.locale,
});

export default connect(mapStateToProps, null)(Footer);
