import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import { getLocalizedFieldValue } from 'utils/languageUtils';
import { getPrettifiedPeriodUnits } from 'utils/timeUtils';
import MandatoryProductTableRow from '../MandatoryProductTableRow';
import OrderLine from 'utils/fixtures/OrderLine';
import Product from 'utils/fixtures/Product';
import ProductTimeSlotPrices from '../../product-time-slots/ProductTimeSlotPrices';
import TimeSlotPriceFixture from 'utils/fixtures/TimeSlotPriceFixture';
import { getTimeSlotsForCustomerGroup } from '../../ReservationProductsUtils';

describe('reservation-products/mandatory-products/MandatoryProductTableRow', () => {
  const defaultProps = {
    currentCustomerGroup: 'abc-cg',
    currentLanguage: 'fi',
    handleQuantityChange: () => {},
    orderLine: OrderLine.build({ product: Product.build({ type: 'rent' }) })
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<MandatoryProductTableRow {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('wrapping tr', () => {
      const tableRow = getWrapper().find('tr');
      expect(tableRow).toHaveLength(1);
    });

    const tableDatas = getWrapper().find('td');
    test('correct amount of table data', () => {
      expect(tableDatas).toHaveLength(3);
    });

    test('first table data has correct data', () => {
      const first = tableDatas.at(0);
      expect(first.text()).toBe(getLocalizedFieldValue(
        defaultProps.orderLine.product.name, defaultProps.currentLanguage, true
      ));
    });

    describe('second table data has correct data', () => {
      test('when there are no time slots', () => {
        const second = tableDatas.at(1);
        const basePrice = defaultProps.orderLine.product.price.amount;
        const type = defaultProps.orderLine.product.price.type;
        const period = defaultProps.orderLine.product.price.period;
        expect(second.text()).toBe(`${basePrice} €${type !== 'fixed' ? ` / ${getPrettifiedPeriodUnits(period)}` : ''}`);
      });

      test('when there are time slots', () => {
        const orderLine = OrderLine.build({
          product: Product.build({
            time_slot_prices: [TimeSlotPriceFixture.build(), TimeSlotPriceFixture.build()]
          })
        });
        const filteredtimeSlotPrices = getTimeSlotsForCustomerGroup(
          defaultProps.currentCustomerGroup, orderLine.product.product_customer_groups,
          orderLine.product.time_slot_prices
        );
        const second = getWrapper({ orderLine }).find('td').at(1);
        expect(second.prop('className')).toBe('time-slot-price-table-row');
        const productTimeSlotPrices = second.find(ProductTimeSlotPrices);
        expect(productTimeSlotPrices).toHaveLength(1);
        expect(productTimeSlotPrices.prop('currentCustomerGroup')).toBe(defaultProps.currentCustomerGroup);
        expect(productTimeSlotPrices.prop('orderLine')).toBe(orderLine);
        expect(productTimeSlotPrices.prop('timeSlotPrices')).toStrictEqual(filteredtimeSlotPrices);
      });
    });

    test('third table data has correct data', () => {
      const third = tableDatas.at(2);
      const totalPrice = defaultProps.orderLine.rounded_price;
      expect(third.text()).toBe(`${totalPrice} € ReservationProducts.price.includesVat`);
    });
  });
});
