import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Col, Row
} from 'react-bootstrap';
import moment from 'moment';
import { isEmpty } from 'lodash';
import Loader from 'react-loader';

import injectT from '../../../i18n/injectT';
import MandatoryProducts from './mandatory-products/MandatoryProducts';
import ProductsSummary from './ProductsSummary';
import ExtraProducts from './extra-products/ExtraProducts';
import ReservationDetails from '../reservation-details/ReservationDetails';

function ReservationProducts({
  changeProductQuantity, currentLanguage, isEditing, isStaff, onBack, onCancel, onConfirm,
  onStaffSkipChange, order, resource, selectedTime, skipMandatoryProducts, t, unit
}) {
  const beginText = moment(selectedTime.begin).format('D.M.YYYY HH:mm');
  const endText = moment(selectedTime.end).format('HH:mm');
  const hours = moment(selectedTime.end).diff(selectedTime.begin, 'minutes') / 60;

  const orderLines = order.order_lines || [];

  return (
    <div className="app-ReservationProducts">
      <h2 className="visually-hidden" id="reservation-products-page-heading">{t('ReservationPhase.productsTitle')}</h2>
      <Row id="reservation-products-page-main-row">
        <Col lg={8} sm={12}>
          {!order.error ? (
            <Loader loaded={!order.loadingData}>
              <MandatoryProducts
                currentLanguage={currentLanguage}
                isStaff={isStaff}
                onStaffSkipChange={onStaffSkipChange}
                orderLines={orderLines}
                skipProducts={skipMandatoryProducts}
              />
              <ExtraProducts
                changeProductQuantity={changeProductQuantity}
                currentLanguage={currentLanguage}
                orderLines={orderLines}
              />
              <ProductsSummary order={order} />
            </Loader>
          )
            : <p id="products-error-message">{t('Notifications.errorMessage')}</p>
          }
          <div className="form-controls">
            <Button
              bsStyle="warning"
              onClick={onCancel}
            >
              {isEditing ? t('ReservationInformationForm.cancelEdit') : t('common.cancel')}
            </Button>
            {isEditing
                && (
                <Button
                  bsStyle="default"
                  onClick={onBack}
                >
                  {t('common.previous')}
                </Button>
                )
              }
            <Button
              bsStyle="primary"
              className="next_Button"
              disabled={isEmpty(selectedTime) || order.error}
              onClick={onConfirm}
            >
              {t('common.continue')}
            </Button>
          </div>
        </Col>

        <Col lg={4} sm={12}>
          <ReservationDetails
            reservationTime={`${beginText}–${endText} (${hours} h)`}
            resourceName={resource.name}
            unitName={unit.name}
          />
        </Col>
      </Row>
    </div>
  );
}

ReservationProducts.propTypes = {
  changeProductQuantity: PropTypes.func.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onStaffSkipChange: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  selectedTime: PropTypes.object.isRequired,
  skipMandatoryProducts: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

export default injectT(ReservationProducts);