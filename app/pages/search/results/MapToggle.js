import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';

import { injectT } from 'i18n';

MapToggle.propTypes = {
  mapVisible: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  resultCount: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
};

function MapToggle({
  mapVisible, onClick, resultCount, t
}) {
  return (
    <section className="app-MapToggle" role="presentation">
      <Grid>
        <Row>
          <Col sm={6}>
            <div className="app-MapToggle__results-count" role="presentation">
              {resultCount ? t('MapToggle.resultsText', { count: resultCount }) : t('MapToggle.noResultsText')}
            </div>
          </Col>
          <Col sm={6}>
            <div className="pull-right">
              <Button
                className="app-MapToggle__button-list"
                disabled={!mapVisible}
                onClick={onClick}
              >
                {t('MapToggle.showList')}
              </Button>
              <Button
                className="app-MapToggle__button-map"
                disabled={mapVisible}
                onClick={onClick}
              >
                {t('MapToggle.showMap')}
              </Button>
            </div>
          </Col>
        </Row>
      </Grid>
    </section>
  );
}

export default injectT(MapToggle);
