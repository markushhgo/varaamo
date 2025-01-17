import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Link from 'react-router-dom/Link';
import { FormattedHTMLMessage } from 'react-intl';
import classNames from 'classnames';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import { fetchPurposes } from 'actions/purposeActions';
import { injectT } from 'i18n';
import PageWrapper from 'pages/PageWrapper';
import HomeSearchBox from './HomeSearchBox';
import homePageSelector from './homePageSelector';
import iconEmptyPurpose from './images/calendar.svg';
import FAIcon from 'shared/fontawesome-icon';

class UnconnectedHomePage extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.renderPurposeBanner = this.renderPurposeBanner.bind(this);
  }

  componentDidMount() {
    this.props.actions.fetchPurposes();
  }

  handleSearch(value = '') {
    this.props.history.push(`/search?search=${value}`);
  }

  renderPurposeBanner(purpose) {
    const { t, contrast, isLargerFontSize } = this.props;
    const image = purpose.image || iconEmptyPurpose;

    return (
      <Col
        className={classNames('app-HomePageContent__banner', isLargerFontSize && 'large-font')}
        key={purpose.value}
        md={3}
        sm={6}
        xs={12}
      >
        <Link className={`app-HomePageContent__banner__linkWrapper ${contrast}`} to={`/search?purpose=${purpose.value}`}>
          <div className="app-HomePageContent__banner-icon">
            {typeof image === 'string' ? <img alt="" src={image} />
              : <FAIcon icon={image} />}
          </div>

          <h3>{purpose.label}</h3>
          <div className="app-HomePageContent__banner-action">
            <Button
              bsStyle="primary"
              className={classNames('app-HomePageContent__button', isLargerFontSize && 'large-font')}
              tabIndex="-1"
            >
              {t('HomePage.buttonText')}
            </Button>
          </div>

        </Link>
      </Col>
    );
  }

  render() {
    const {
      isFetchingPurposes, purposes, t, contrast, authUserAmr, isAdmin, currentLanguage
    } = this.props;
    return (
      <div className="app-HomePage">
        <div className={`app-HomePage__content container ${contrast}`}>
          <h1><FormattedHTMLMessage id="HomePage.contentTitle" /></h1>
          <h2>{t('HomePage.contentSubTitle')}</h2>
          <HomeSearchBox onSearch={this.handleSearch} />
        </div>
        <PageWrapper className="app-HomePageContent" title={t('HomePage.title')}>
          <h2>{t('HomePage.bannersTitle')}</h2>
          <Loader loaded={!isFetchingPurposes}>
            <div className="app-HomePageContent__banners">
              <Row>
                {purposes.map(this.renderPurposeBanner)}
              </Row>
            </div>
          </Loader>
          {(isAdmin || authUserAmr === 'turku_adfs') && (
            <div className={`${contrast}`} id="home-feedback-link">
              <a
                href={`https://opaskartta.turku.fi/eFeedback/${currentLanguage}/Feedback/30/1039`}
                rel="noreferrer"
                target="_blank"
              >
                {t('HomePage.feedbackLinkText')}
                <FAIcon icon={faExternalLinkAlt} />
              </a>
            </div>
          )}
        </PageWrapper>
      </div>
    );
  }
}

UnconnectedHomePage.propTypes = {
  actions: PropTypes.object.isRequired,
  isFetchingPurposes: PropTypes.bool.isRequired,
  isLargerFontSize: PropTypes.bool.isRequired,
  purposes: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  contrast: PropTypes.string,
  authUserAmr: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  currentLanguage: PropTypes.string.isRequired,
};

UnconnectedHomePage = injectT(UnconnectedHomePage); // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = { fetchPurposes };
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedHomePage };
export default connect(
  homePageSelector,
  mapDispatchToProps
)(UnconnectedHomePage);
