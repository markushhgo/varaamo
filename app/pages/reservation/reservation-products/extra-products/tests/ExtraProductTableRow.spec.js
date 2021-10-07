import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import { getLocalizedFieldValue } from 'utils/languageUtils';
import ExtraProductTableRow from '../ExtraProductTableRow';
import QuantityInput from '../QuantityInput';
import { getPrettifiedPeriodUnits } from '../../ReservationProductsUtils';
import Product from 'utils/fixtures/Product';
import OrderLine from 'utils/fixtures/OrderLine';

describe('reservation-products/extra-products/ExtraProductTableRow', () => {
  const defaultProps = {
    currentLanguage: 'fi',
    handleQuantityChange: () => {},
    orderLine: OrderLine.build({ product: Product.build() })
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ExtraProductTableRow {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('wrapping tr', () => {
      const tableRow = getWrapper().find('tr');
      expect(tableRow).toHaveLength(1);
    });

    const tableDatas = getWrapper().find('td');
    test('correct amount of table data', () => {
      expect(tableDatas).toHaveLength(4);
    });

    test('first table data has correct data', () => {
      const first = tableDatas.at(0);
      expect(first.text()).toBe(getLocalizedFieldValue(
        defaultProps.orderLine.product.name, defaultProps.currentLanguage, true
      ));
    });

    test('second table data has correct data', () => {
      const quantityInput = tableDatas.at(1).find(QuantityInput);
      expect(quantityInput).toHaveLength(1);
      expect(quantityInput.prop('handleAdd')).toBeDefined();
      expect(quantityInput.prop('handleReduce')).toBeDefined();
      expect(quantityInput.prop('maxQuantity')).toBe(defaultProps.orderLine.product.max_quantity);
      expect(quantityInput.prop('quantity')).toBe(defaultProps.orderLine.quantity);
    });

    test('third table data has correct data', () => {
      const third = tableDatas.at(2);
      const basePrice = defaultProps.orderLine.product.price.amount;
      const type = defaultProps.orderLine.product.price.type;
      const period = defaultProps.orderLine.product.price.period;
      expect(third.text()).toBe(`${basePrice} €${type !== 'fixed' ? ` / ${getPrettifiedPeriodUnits(period)}` : ''}`);
    });

    test('fourth table data has correct data', () => {
      const fourth = tableDatas.at(3);
      const totalPrice = defaultProps.orderLine.price;
      expect(fourth.text()).toBe(`${totalPrice} € ReservationProducts.price.includesVat`);
    });
  });
});