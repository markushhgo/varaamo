import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../../../i18n/injectT';
import QuantityInput from './QuantityInput';
import { getParsedVat, getTimeSlotsForCustomerGroup } from '../ReservationProductsUtils';
import { getPrettifiedPeriodUnits } from 'utils/timeUtils';
import { getLocalizedFieldValue } from 'utils/languageUtils';
import ProductTimeSlotPrices from '../product-time-slots/ProductTimeSlotPrices';

function ExtraProductTableRow({
  currentCustomerGroup, currentLanguage, orderLine, handleQuantityChange, t
}) {
  const totalPrice = orderLine.rounded_price;
  const name = getLocalizedFieldValue(orderLine.product.name, currentLanguage, true);
  const maxQuantity = orderLine.product.max_quantity;

  const basePrice = orderLine.product.price.amount;
  const period = orderLine.product.price.period;
  const type = orderLine.product.price.type;
  const vat = orderLine.product.price.tax_percentage;

  const parsedVat = getParsedVat(vat);
  const vatText = t('ReservationProducts.price.includesVat', { vat: parsedVat });

  const filteredtimeSlotPrices = getTimeSlotsForCustomerGroup(
    currentCustomerGroup, orderLine.product.product_customer_groups,
    orderLine.product.time_slot_prices
  );

  return (
    <tr>
      <td>{name}</td>
      <td className="extra-product-quantity-table-data">
        <QuantityInput
          handleAdd={() => handleQuantityChange(orderLine.quantity + 1, orderLine)}
          handleReduce={() => handleQuantityChange(orderLine.quantity - 1, orderLine)}
          maxQuantity={maxQuantity}
          quantity={orderLine.quantity}
        />
      </td>
      {filteredtimeSlotPrices.length > 0 ? (
        <td className="time-slot-price-table-row">
          <ProductTimeSlotPrices
            currentCustomerGroup={currentCustomerGroup}
            orderLine={orderLine}
            timeSlotPrices={filteredtimeSlotPrices}
          />
        </td>
      )
        : <td>{`${basePrice} €${type !== 'fixed' ? ` / ${getPrettifiedPeriodUnits(period)}` : ''}`}</td>
      }
      <td>{`${totalPrice} € ${vatText}`}</td>
    </tr>
  );
}

ExtraProductTableRow.propTypes = {
  currentCustomerGroup: PropTypes.string.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
  orderLine: PropTypes.shape({
    rounded_price: PropTypes.string,
    product: PropTypes.object,
  }),
  t: PropTypes.func.isRequired,
};

export default injectT(ExtraProductTableRow);
