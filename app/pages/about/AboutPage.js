import constants from 'constants/AppConstants';

import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';


import { injectT } from 'i18n';
import PageWrapper from 'pages/PageWrapper';

class AboutPage extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    currentLanguage: PropTypes.string,
  };

  render() {
    const { t, currentLanguage } = this.props;
    const currentLink = (currentLanguage === 'se') ? constants.FEEDBACK_URL.SV : constants.FEEDBACK_URL.FI;
    return (
      <PageWrapper className="about-page" title={t('AboutPage.title')}>
        <h1>{t('AboutPageContent.defaultHeader')}</h1>
        <p className="lead">{t('AboutPageContent.defaultLead')}</p>
        <p>{t('AboutPageContent.pilotParagraph')}</p>
        <p>{t('AboutPageContent.defaultReservableParagraph')}</p>
        <p><FormattedHTMLMessage id="AboutPageContent.basedOnParagraph" /></p>
        <p>{t('AboutPageContent.developmentParagraph')}</p>
        <p>
          {t('AboutPageContent.feedbackParagraph')}
          {' '}
          <a className="feedback-link" href={currentLink}>
            {t('AboutPageContent.feedbackLink')}
          </a>
        </p>
        <h2>{t('AboutPageContent.customerRegisterHeader')}</h2>
        <p>
          <FormattedHTMLMessage id="AboutPageContent.customerRegisterParagraph" />
        </p>
        <p>
          <FormattedHTMLMessage id="AboutPageContent.customerRegisterLink" />
        </p>
        <p>
          <FormattedHTMLMessage id="AboutPageContent.customerRegisterLinkVR" />
        </p>
        <p>
          <FormattedHTMLMessage id="AboutPageContent.customerRegisterLinkSUO" />
        </p>
        <br />
      </PageWrapper>
    );
  }
}

export default injectT(AboutPage);
