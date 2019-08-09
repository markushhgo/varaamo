import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';

import { injectT } from 'i18n';
import WrappedText from 'shared/wrapped-text';
import { getServiceMapUrl } from 'utils/unitUtils';
import ReservationInfo from '../reservation-info';

function ResourceInfo({
  isLoggedIn, resource, unit, t
}) {
  const serviceMapUrl = getServiceMapUrl(unit);

  return (
    <Row>
      <section aria-label={t('ResourcePage.info')} className="app-ResourceInfo">
        <div className="app-ResourceInfo__description">
          {resource.description && <WrappedText openLinksInNewTab text={resource.description} />}
        </div>
        <Panel defaultExpanded header={t('ResourceInfo.reservationTitle')}>
          <ReservationInfo isLoggedIn={isLoggedIn} resource={resource} />
        </Panel>
        <Panel defaultExpanded header={t('ResourceInfo.additionalInfoTitle')}>
          <Row>
            <Col className="app-ResourceInfo__address" lg={6} md={6} sm={6} xs={12}>
              {unit && unit.name && <span2>{unit.name}</span2>}
              {unit && unit.streetAddress && <span>{unit.streetAddress}</span>}
              {unit && <span3>{`${unit.addressZip} ${upperFirst(unit.municipality)}`.trim()}</span3>}
            </Col>
            <Col className="app-ResourceInfo__web" lg={6} md={6} sm={6} xs={12}>
              {serviceMapUrl && (
                <span className="app-ResourceInfo__servicemap">
                  <a href={serviceMapUrl} rel="noopener noreferrer" target="_blank">
                    {t('ResourceInfo.serviceMapLink')}
                  </a>
                </span>
              )}
              {unit && unit.wwwUrl && (
                <span className="app-ResourceInfo__www">
                  <a href={unit.wwwUrl} rel="noopener noreferrer" target="_blank">
                    {t('ResourceInfo.webSiteLink')}
                  </a>
                </span>
              )}
            </Col>
          </Row>
        </Panel>
      </section>
    </Row>
  );
}

ResourceInfo.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

ResourceInfo = injectT(ResourceInfo); // eslint-disable-line

export default ResourceInfo;
