import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Grid from 'react-bootstrap/lib/Grid';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { fetchUser } from 'actions/userActions';
import Favicon from 'shared/favicon';
import Footer from 'shared/footer';
import Header from 'shared/header';
import TestSiteMessage from 'shared/test-site-message';
import Notifications from 'shared/notifications';
import { getCustomizationClassName } from 'utils/customizationUtils';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';

const userIdSelector = state => state.auth.userId;
const fontSizeSelector = state => state.ui.accessibility.fontSize;


export const selector = createStructuredSelector({
  userId: userIdSelector,
  fontSize: fontSizeSelector,
  currentLanguage: currentLanguageSelector,
});

export class UnconnectedAppContainer extends Component {
  componentDidMount() {
    if (this.props.userId) {
      this.props.fetchUser(this.props.userId);
    }
    this.removeFacebookAppendedHash();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.userId && nextProps.userId !== this.props.userId) {
      this.props.fetchUser(nextProps.userId);
    }
  }

  removeFacebookAppendedHash() {
    if (window.location.hash && window.location.hash.indexOf('_=_') !== -1) {
      window.location.hash = ''; // for older browsers, leaves a # behind
      window.history.pushState('', document.title, window.location.pathname);
    }
  }

  render() {
    const { fontSize } = this.props;
    return (
      <div className={classNames('app', getCustomizationClassName(), (fontSize))}>
        <Helmet htmlAttributes={{ lang: this.props.currentLanguage }} title="Varaamo" />

        <Header location={this.props.location}>
          <Favicon />
          <TestSiteMessage />
        </Header>
        <main aria-label="Main" className={classNames('app-content')}>
          <Grid>
            <Notifications />
          </Grid>
          {this.props.children}
        </main>
        <Footer />
      </div>
    );
  }
}

UnconnectedAppContainer.propTypes = {
  children: PropTypes.node,
  fetchUser: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  userId: PropTypes.string,
  fontSize: PropTypes.string,
  currentLanguage: PropTypes.string,
};

const actions = { fetchUser };

export default withRouter(
  connect(
    selector,
    actions
  )(UnconnectedAppContainer)
);
