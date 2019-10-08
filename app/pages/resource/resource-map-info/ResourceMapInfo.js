import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import iconMapMarker from 'hel-icons/dist/shapes/map-marker.svg';
import upperFirst from 'lodash/upperFirst';

import { injectT } from 'i18n';
import { getServiceMapUrl } from 'utils/unitUtils';

function formatAddress({ addressZip, municipality, streetAddress }) {
  const parts = [streetAddress, `${addressZip} ${upperFirst(municipality)}`.trim()];
  return parts.filter(part => part).join(', ');
}

function ResourceMapInfo({ currentLanguage, unit, t }) {
  const serviceMapUrl = getServiceMapUrl(unit, currentLanguage);
  return (
    <div className="app-ResourceMapInfo">
      <Grid>
        {unit && (
          <div className="app-ResourceMapInfo__content">
            <img
              alt={t('ResourceInfo.serviceMapLink')}
              className="app-ResourceMapInfo__icon"
              src={iconMapMarker}
            />
            <span>{formatAddress(unit)}</span>

            {serviceMapUrl && (
            <Button bsStyle="link" href={serviceMapUrl} rel="noopener noreferrer" target="_blank">
              {t('ResourceInfo.serviceMapLink')}
            </Button>
            )}

          </div>
        )}
      </Grid>
    </div>
  );
}

ResourceMapInfo.propTypes = {
  currentLanguage: PropTypes.string,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

ResourceMapInfo = injectT(ResourceMapInfo); // eslint-disable-line

export default ResourceMapInfo;
