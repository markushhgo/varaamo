import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import FooterContent from './FooterContent';

export function Footer(props) {
  const style = props.contrast ? 'normal-contrast' : 'high-contrast';
  return (
    <footer className={style}>
      <FooterContent onLinkClick={props.onLinkClick} />
    </footer>
  );
}

Footer.propTypes = {
  onLinkClick: PropTypes.func,
  contrast: PropTypes.bool,

};

const mapStateToProps = state => ({
  contrast: state.ui.accessability.isNormalContrast,
});

export default connect(mapStateToProps, null)(Footer);
