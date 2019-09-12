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
  isLoggedIn, resource, unit, t, equipment
}) {
  const serviceMapUrl = getServiceMapUrl(unit);
  const equipmentList = equipment.map((thing, index) => <li key={index}>{thing}</li>);

  return (
    <Row>
      <section aria-labelledby="ResourcePageInfo" className="app-ResourceInfo">
        <h2 className="visually-hidden" id="ResourcePageInfo">{t('ResourcePage.info')}</h2>
        <div className="app-ResourceInfo__description">
          {resource.description && <WrappedText openLinksInNewTab text={resource.description} />}
        </div>
        <Panel defaultExpanded header={t('ResourceInfo.reservationTitle')} id="reservation-panel">
          <Panel.Heading>
            <Panel.Title componentClass="h3" toggle>
              {t('ResourceInfo.reservationTitle')}
            </Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              <ReservationInfo isLoggedIn={isLoggedIn} resource={resource} />
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
        <Panel defaultExpanded header={t('ResourceInfo.additionalInfoTitle')} id="additionalInfo-panel">
          <Panel.Heading>
            <Panel.Title componentClass="h3" toggle>
              {t('ResourceInfo.additionalInfoTitle')}
            </Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              <Row>
                <Col className="app-ResourceInfo__address" lg={6} md={6} sm={6} xs={12}>
                  {unit && unit.name && <span>{unit.name}</span>}
                  {unit && unit.streetAddress && <span>{unit.streetAddress}</span>}
                  {unit && <span>{`${unit.addressZip} ${upperFirst(unit.municipality)}`.trim()}</span>}
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
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
        {equipmentList.length > 0 && (
          <Panel defaultExpanded header={t('ResourceInfo.equipmentHeader')} id="equipment-panel">
            <Panel.Heading>
              <Panel.Title componentClass="h3" toggle>
                {t('ResourceInfo.equipmentHeader')}
              </Panel.Title>
            </Panel.Heading>
            <Panel.Collapse>
              <Panel.Body>
                <Row>
                  <Col className="app-ResourceInfo__equipment" lg={6} md={6} sm={6} xs={12}>
                    {equipmentList}
                  </Col>
                </Row>
              </Panel.Body>
            </Panel.Collapse>
          </Panel>
        )}

      </section>
    </Row>
  );
}

ResourceInfo.propTypes = {
  equipment: PropTypes.array,
  isLoggedIn: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

ResourceInfo = injectT(ResourceInfo); // eslint-disable-line

export default ResourceInfo;
