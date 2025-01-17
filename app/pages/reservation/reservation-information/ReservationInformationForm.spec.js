
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import { Field, change } from 'redux-form';
import simple from 'simple-mock';

import constants from 'constants/AppConstants';
import TermsField from 'shared/form-fields/TermsField';
import { shallowWithIntl } from 'utils/testUtils';
import Product from 'utils/fixtures/Product';
import Resource, { UniversalField } from 'utils/fixtures/Resource';
import {
  UnconnectedReservationInformationForm as ReservationInformationForm,
  validate,
} from './ReservationInformationForm';
import ReservationSubmitButton from './ReservationSubmitButton';
import { hasProducts } from 'utils/reservationUtils';
import ReservationValidationErrors from './ReservationValidationErrors';
import { FIELDS } from '../../../constants/ReservationConstants';
import FormTypes from 'constants/FormTypes';
import SingleReservationDetail from '../reservation-details/SingleReservationDetail';


describe('pages/reservation/reservation-information/ReservationInformationForm', () => {
  describe('validation', () => {
    const t = id => id;

    describe('if field value is missing', () => {
      describe('if user is reserving an staff event', () => {
        const values = { staffEvent: true };

        describe('if field belongs to REQUIRED_STAFF_EVENT_FIELDS', () => {
          const fieldName = constants.REQUIRED_STAFF_EVENT_FIELDS[0];

          test('returns an error', () => {
            const props = {
              fields: [fieldName],
              requiredFields: [],
              t,
            };
            const errors = validate(values, props);
            expect(errors[fieldName]).toBeDefined();
          });
        });

        describe('if field does not belong to REQUIRED_STAFF_EVENT_FIELDS', () => {
          const fieldName = 'someField';

          test('does not return an error', () => {
            const props = {
              fields: [fieldName],
              requiredFields: [],
              t,
            };
            const errors = validate(values, props);
            expect(errors[fieldName]).toBeFalsy();
          });
        });
      });

      describe('if user is reserving a regular event', () => {
        const values = {};

        test('returns an error if field is in requiredFields', () => {
          const fieldName = 'someField';
          const props = {
            fields: [fieldName],
            requiredFields: [fieldName],
            t,
          };
          const errors = validate(values, props);
          expect(errors[fieldName]).toBeDefined();
        });

        test('returns correct error if field is termsAndConditions and required', () => {
          const fieldName = 'termsAndConditions';
          const props = {
            fields: [fieldName],
            requiredFields: [fieldName],
            t,
          };
          const errors = validate(values, props);
          expect(errors[fieldName]).toBe('ReservationForm.termsAndConditionsError');
        });

        test('returns correct error if field is paymentTermsAndConditions and required', () => {
          const fieldName = 'paymentTermsAndConditions';
          const props = {
            fields: [fieldName],
            requiredFields: [fieldName],
            t,
          };
          const errors = validate(values, props);
          expect(errors[fieldName]).toBe('ReservationForm.paymentTermsAndConditionsError');
        });

        test('does not return an error if field is not in requiredFields', () => {
          const fieldName = 'someField';
          const props = {
            fields: [fieldName],
            requiredFields: [],
            t,
          };
          const errors = validate(values, props);
          expect(errors[fieldName]).toBeFalsy();
        });
      });
    });

    describe('if field has a value', () => {
      test('does not return an error even if field is required', () => {
        const props = {
          fields: ['name'],
          requiredFields: ['name'],
          t,
        };
        const values = { name: 'Luke' };
        const errors = validate(values, props);
        expect(errors.name).toBeFalsy();
      });

      test('returns an error if value is string and contains only white space', () => {
        const props = {
          fields: ['name'],
          requiredFields: ['name'],
          t,
        };
        const values = { name: '' };
        const errors = validate(values, props);
        expect(errors.name).toBeDefined();
      });
    });

    describe('reserverEmailAddress', () => {
      const props = {
        fields: ['reserverEmailAddress'],
        requiredFields: [],
        t,
      };

      test('returns an error if reserverEmailAddress is invalid', () => {
        const values = { reserverEmailAddress: 'luke@' };
        const errors = validate(values, props);
        expect(errors.reserverEmailAddress).toBeDefined();
      });

      test('does not return an error if reserverEmailAddress is valid', () => {
        const values = { reserverEmailAddress: 'luke@skywalker.com' };
        const errors = validate(values, props);
        expect(errors.reserverEmailAddress).toBeFalsy();
      });
    });

    describe('billingEmailAddress', () => {
      const props = {
        fields: ['billingEmailAddress'],
        requiredFields: [],
        t,
      };

      test('returns an error if billingEmailAddress is invalid', () => {
        const values = { billingEmailAddress: 'luke@' };
        const errors = validate(values, props);
        expect(errors.billingEmailAddress).toBeDefined();
      });

      test('does not return an error if billingEmailAddress is valid', () => {
        const values = { billingEmailAddress: 'luke@skywalker.com' };
        const errors = validate(values, props);
        expect(errors.billingEmailAddress).toBeFalsy();
      });
    });

    describe('reserverPhoneNumber', () => {
      const props = {
        fields: ['reserverPhoneNumber'],
        requiredFields: [],
        t,
      };

      test('returns an error if reserverPhoneNumber is invalid', () => {
        const values = { reserverPhoneNumber: '+358-401-23123' };
        const errors = validate(values, props);
        expect(errors.reserverPhoneNumber).toBeDefined();
      });

      test('does not return an error if reserverPhoneNumber is valid', () => {
        const values = { reserverPhoneNumber: '+35840123123' };
        const errors = validate(values, props);
        expect(errors.reserverPhoneNumber).toBeFalsy();
      });
    });

    describe('billingPhoneNumber', () => {
      const props = {
        fields: ['billingPhoneNumber'],
        requiredFields: [],
        t,
      };

      test('returns an error if billingPhoneNumber is invalid', () => {
        const values = { billingPhoneNumber: '+358-401-23123' };
        const errors = validate(values, props);
        expect(errors.billingPhoneNumber).toBeDefined();
      });

      test('does not return an error if billingPhoneNumber is valid', () => {
        const values = { billingPhoneNumber: '+35840123123' };
        const errors = validate(values, props);
        expect(errors.billingPhoneNumber).toBeFalsy();
      });
    });

    describe('numberOfParticipants', () => {
      const props = {
        fields: ['numberOfParticipants'],
        requiredFields: [],
        t,
        resource: Resource.build({
          peopleCapacity: 10,
        }),
      };

      test('returns an error if number of participants is too high', () => {
        const values = { numberOfParticipants: '11' };
        const errors = validate(values, props);
        expect(errors.numberOfParticipants).toBeDefined();
      });

      test('returns an error if number of participants is a negative number', () => {
        const values = { numberOfParticipants: '-1' };
        const errors = validate(values, props);
        expect(errors.numberOfParticipants).toBeDefined();
      });

      test('returns an error if number of participants is using a decimal', () => {
        const values = { numberOfParticipants: '1,5' };
        const errors = validate(values, props);
        expect(errors.numberOfParticipants).toBeDefined();
      });

      test('does not return an error if number of participants is valid', () => {
        const values = { numberOfParticipants: '1' };
        const errors = validate(values, props);
        expect(errors.numberOfParticipants).toBeFalsy();
      });
    });
  });

  describe('rendering and methods', () => {
    const defaultProps = {
      fields: [],
      hasPayment: false,
      handleSubmit: simple.mock(),
      isEditing: false,
      isMakingReservations: false,
      onBack: simple.mock(),
      onCancel: simple.mock(),
      onConfirm: simple.mock(),
      openResourcePaymentTermsModal: simple.mock(),
      openResourceTermsModal: simple.mock(),
      requiredFields: [],
      resource: Resource.build(),
      paymentTermsAndConditions: '',
      termsAndConditions: '',
      universalField: [],
      reservationType: constants.RESERVATION_TYPE.NORMAL_VALUE,
    };

    function getWrapper(extraProps) {
      return shallowWithIntl(<ReservationInformationForm {...defaultProps} {...extraProps} />);
    }

    test('renders a Form component with correct props', () => {
      const handleSubmit = () => null;
      const form = getWrapper({ handleSubmit }).find(Form);
      expect(form.length).toBe(1);
      expect(form.prop('onSubmit')).toBeDefined();
    });

    describe('form fields', () => {
      const reserverNameField = 'reserverName';
      const eventSubjectField = 'eventSubject';

      describe('reservation type', () => {
        test('when type field is included and editing', () => {
          const fields = ['type'];
          const fieldDetail = getWrapper({ fields, isEditing: true }).find(SingleReservationDetail);
          expect(fieldDetail).toHaveLength(1);
          expect(fieldDetail.prop('label')).toBe('ReservationType.label');
          expect(fieldDetail.prop('value')).toBe('ReservationType.normal');
        });

        test('when type field is not included and editing', () => {
          const fields = [];
          const fieldDetail = getWrapper({ fields, isEditing: true }).find(SingleReservationDetail);
          expect(fieldDetail).toHaveLength(0);
        });

        test('when type field is included and not editing', () => {
          const { RESERVATION_TYPE } = constants;
          const fields = ['type'];
          const radioGroup = getWrapper({ fields, isEditing: false })
            .find('RadioGroup');
          expect(radioGroup).toHaveLength(1);
          expect(radioGroup.prop('legend')).toBe(RESERVATION_TYPE.LEGEND_TEXT_ID);
          expect(radioGroup.prop('legendHint')).toBe(RESERVATION_TYPE.LEGEND_HINT_TEXT_ID);
          expect(radioGroup.prop('radioOptions')).toEqual([
            {
              name: RESERVATION_TYPE.TYPE_NAME,
              value: RESERVATION_TYPE.NORMAL_VALUE,
              label: constants.RESERVATION_TYPE.NORMAL_LABEL_ID,
              hint: constants.RESERVATION_TYPE.NORMAL_HINT_TEXT_ID,
            },
            {
              name: RESERVATION_TYPE.TYPE_NAME,
              value: RESERVATION_TYPE.BLOCKED_VALUE,
              label: constants.RESERVATION_TYPE.BLOCKED_LABEL_ID,
              hint: constants.RESERVATION_TYPE.BLOCKED_HINT_TEXT_ID,
            }
          ]);
        });

        test('when type field is not included and not editing', () => {
          const fields = [];
          const radioGroup = getWrapper({ fields, isEditing: false }).find('RadioGroup');
          expect(radioGroup).toHaveLength(0);
        });
      });

      test('renders Reservation Information Form title', () => {
        const fields = [reserverNameField];
        const header = getWrapper({ fields }).find('.reservationers-Info');
        expect(header).toHaveLength(1);
        expect(header.text()).toBe('ReservationInformationForm.reserverInformationTitle');
      });

      describe('Billing info heading', () => {
        const billingFields = [
          'billingFirstName',
          'billingLastName',
          'billingPhoneNumber',
          'billingEmailAddress',
          'billingAddressStreet',
          'billingAddressZip',
          'billingAddressCity'
        ];
        test('is rendered when any of the billing fields are among form fields', () => {
          billingFields.forEach((billingField) => {
            const fields = [billingField];
            const billingHeading = getWrapper({ fields }).find('#payment-info-heading');
            expect(billingHeading).toHaveLength(1);
            expect(billingHeading.text()).toBe('common.payerInformationLabel');
          });
        });
        test('is not rendered when none of the billing fields are among form fields', () => {
          const fields = [];
          const billingHeading = getWrapper({ fields }).find('#payment-info-title');
          expect(billingHeading).toHaveLength(0);
        });
      });
      describe('Copy reserver info to payer info button', () => {
        test('is not rendered when no billing field is present', () => {
          const fields = [];
          const copyButton = getWrapper({ fields }).find('#copy-info-button');
          expect(copyButton).toHaveLength(0);
        });
        describe('when billing fields are present', () => {
          const billingFields = [
            'billingFirstName',
            'billingLastName',
            'billingPhoneNumber',
            'billingEmailAddress',
            'billingAddressStreet',
            'billingAddressZip',
            'billingAddressCity'
          ];
          test('button is rendered', () => {
            const fields = billingFields;
            expect(getWrapper({ fields }).find('#copy-info-button')).toHaveLength(1);
          });
        });
      });

      describe('Copy reserver info status message', () => {
        test('is not rendered when no billing field is present', () => {
          const fields = [];
          const statusMsg = getWrapper({ fields }).find('#copied-info-status');
          expect(statusMsg).toHaveLength(0);
        });
        describe('when billing fields are present', () => {
          const billingFields = [
            'billingFirstName',
            'billingLastName',
            'billingPhoneNumber',
            'billingEmailAddress',
            'billingAddressStreet',
            'billingAddressZip',
            'billingAddressCity'
          ];
          test('status message is rendered', () => {
            const fields = billingFields;
            expect(getWrapper({ fields }).find('#copied-info-status')).toHaveLength(1);
          });

          test('status message is correctly rendered when showInfoCopied is false', () => {
            const fields = billingFields;
            const wrapper = getWrapper({ fields });
            const instance = wrapper.instance();
            instance.setState({ showInfoCopied: false });
            const statusMsg = wrapper.find('#copied-info-status');
            expect(statusMsg).toHaveLength(1);
            expect(statusMsg.text()).toBe('');
            expect(statusMsg.prop('aria-hidden')).toBe(true);
            expect(statusMsg.prop('className')).toBe('hide-info');
            expect(statusMsg.prop('role')).toBe('alert');
            expect(statusMsg.prop('id')).toBe('copied-info-status');
          });

          test('status message is correctly rendered when showInfoCopied is true', () => {
            const fields = billingFields;
            const wrapper = getWrapper({ fields });
            const instance = wrapper.instance();
            instance.setState({ showInfoCopied: true });
            const statusMsg = wrapper.find('#copied-info-status');
            expect(statusMsg).toHaveLength(1);
            expect(statusMsg.text()).toBe('ReservationInformationForm.copyConfirmed');
            expect(statusMsg.prop('aria-hidden')).toBe(false);
            expect(statusMsg.prop('className')).toBe('show-info');
            expect(statusMsg.prop('role')).toBe('alert');
            expect(statusMsg.prop('id')).toBe('copied-info-status');
          });
        });
      });

      test('renders Reservation Information Form when field is selected', () => {
        const fields = [eventSubjectField];
        const header = getWrapper({ fields }).find('.ReservationInformationForm');
        expect(header).toHaveLength(1);
        expect(header.text()).toBe('ReservationInformationForm.eventInformationTitle');
      });

      test('Does not render Reservation Information Form if not field selected', () => {
        const fields = [];
        const header = getWrapper({ fields }).find('.ReservationInformationForm');
        expect(header).toHaveLength(0);
      });

      test('renders a field if it is included in props.fields', () => {
        const fields = [reserverNameField];
        const input = getWrapper({ fields }).find(Field);
        expect(input.length).toBe(1);
      });

      test('does not render a field if it is not included in props.fields', () => {
        const fields = [];
        const input = getWrapper({ fields }).find(Field);
        expect(input.length).toBe(0);
      });

      describe('required fields', () => {
        test('displays an asterisk beside a required field label', () => {
          const props = {
            fields: [reserverNameField],
            requiredFields: [reserverNameField],
          };
          const input = getWrapper(props).find(Field);
          expect(input.props().label).toContain('*');
        });

        test('does not display an asterisk beside a non required field label', () => {
          const props = {
            fields: [reserverNameField],
            requiredFields: [],
          };
          const input = getWrapper(props).find(Field);
          expect(input.props().label).not.toContain('*');
        });

        describe('if staffEvent checkbox is checked', () => {
          const staffEventSelected = true;

          test('shows an asterisk beside REQUIRED_STAFF_EVENT_FIELDS', () => {
            const fields = [reserverNameField];
            const props = {
              fields,
              requiredFields: [reserverNameField],
              staffEventSelected,
            };
            const input = getWrapper(props).find(Field);
            expect(input.props().label).toContain('*');
          });

          test(
            'does not show an asterisk beside non REQUIRED_STAFF_EVENT_FIELDS',
            () => {
              const nonRequiredFieldName = 'reserverEmailAddress';
              const fields = [nonRequiredFieldName];
              const props = {
                fields,
                requiredFields: [nonRequiredFieldName],
                staffEventSelected,
              };
              const input = getWrapper(props).find(Field);
              expect(input.props().label).not.toContain('*');
            }
          );
        });
      });
    });

    describe('Additional info', () => {
      describe('if extra questions is included in props', () => {
        const resource = { reservationAdditionalInformation: 'info string' };
        const fields = ['reservationExtraQuestions'];
        const props = { resource, fields };
        const wrapper = getWrapper(props);

        test('renders additional info heading', () => {
          const heading = wrapper.find('#additional-info-heading');
          expect(heading.length).toBe(1);
          expect(heading.text()).toBe('common.additionalInfo.heading');
        });

        test('renders additional info WrappedText with correct props', () => {
          const wrappedText = wrapper.find('#additional-info-paragraph');
          expect(wrappedText.length).toBe(1);
          expect(wrappedText.prop('text')).toBe(resource.reservationAdditionalInformation);
          expect(wrappedText.prop('allowNamedLinks')).toBeDefined();
          expect(wrappedText.prop('openLinksInNewTab')).toBeDefined();
        });
      });

      describe('if extra questions is not included in props', () => {
        test('does not render additional info heading', () => {
          const heading = getWrapper().find('#additional-info-heading');
          expect(heading.length).toBe(0);
        });
        test('does not render additional info WrappedText', () => {
          const wrappedText = getWrapper().find('#additional-info-paragraph');
          expect(wrappedText.length).toBe(0);
        });
      });
    });

    describe('terms and conditions', () => {
      describe('when terms and conditions are given in props', () => {
        test('renders terms and conditions input wrapper', () => {
          const termsAndConditions = 'Some terms and conditions text';
          const wrapper = getWrapper({ termsAndConditions });
          const field = wrapper.find(Field).filter({ component: TermsField });
          const isRequired = 'termsAndConditions' in defaultProps.requiredFields;

          expect(field.length).toBe(1);
          expect(field.prop('isRequired')).toBe(isRequired);
          expect(field.prop('label')).toBe('ReservationInformationForm.termsAndConditionsLabel');
          expect(field.prop('labelLink')).toBe('ReservationInformationForm.termsAndConditionsLink');
          expect(field.prop('name')).toBe('termsAndConditions');
          expect(field.prop('onClick')).toBe(defaultProps.openResourceTermsModal);
        });
      });

      describe('when terms and conditions are not given in props', () => {
        test('does not render terms and conditions input wrapper', () => {
          const termsAndConditions = '';
          const wrapper = getWrapper({ termsAndConditions });
          const field = wrapper.find(Field).filter({ component: TermsField });

          expect(field.length).toBe(0);
        });
      });
    });

    describe('payment terms', () => {
      describe('when payment terms are given in props', () => {
        describe('when reservation has payment', () => {
          test('renders payment terms input wrapper', () => {
            const paymentTermsAndConditions = 'Some payment terms text';
            const wrapper = getWrapper({ paymentTermsAndConditions, hasPayment: true });
            const field = wrapper.find(Field).filter({ component: TermsField });
            const isRequired = 'paymentTermsAndConditions' in defaultProps.requiredFields;

            expect(field.length).toBe(1);
            expect(field.prop('isRequired')).toBe(isRequired);
            expect(field.prop('label')).toBe('ReservationInformationForm.termsAndConditionsLabel');
            expect(field.prop('labelLink')).toBe('ReservationInformationForm.paymentTermsAndConditionsLink');
            expect(field.prop('name')).toBe('paymentTermsAndConditions');
            expect(field.prop('onClick')).toBe(defaultProps.openResourcePaymentTermsModal);
          });
        });
        describe('when reservation does not have payment', () => {
          test('does not render payment terms input wrapper', () => {
            const paymentTermsAndConditions = 'Some payment terms text';
            const wrapper = getWrapper({ paymentTermsAndConditions, hasPayment: false });
            const field = wrapper.find(Field).filter({ component: TermsField });
            expect(field.length).toBe(0);
          });
        });
      });

      describe('when payment terms are not given in props', () => {
        test('does not render payment terms input wrapper', () => {
          const paymentTermsAndConditions = '';
          const wrapper = getWrapper({ paymentTermsAndConditions });
          const field = wrapper.find(Field).filter({ component: TermsField });

          expect(field.length).toBe(0);
        });
      });
    });

    describe('universalData', () => {
      describe('when resource has universalField field', () => {
        test('renders Field with correct props', () => {
          const uniData = UniversalField.build({ data: { url: 'url-to-a-picture' } });
          const resource = Resource.build({ universalField: [uniData] });
          const props = {
            fields: ['universalData'],
            resource
          };
          const wrapper = getWrapper(props);

          const field = wrapper.find(Field);
          expect(field.prop('name')).toBe('universalData');
          expect(field.prop('label')).toBe(uniData.label);
          expect(Object.keys(field.prop('universalFieldData'))).toHaveLength(2);
          expect(field.prop('universalFieldData').description).toBe(uniData.description);
          expect(field.prop('universalFieldData').data).toBe(uniData.data);

          const options = field.prop('controlProps').options;
          expect(options).toHaveLength(uniData.options.length);
          options.forEach((option, index) => {
            expect(option.id).toBe(uniData.options[index].id);
            expect(option.value).toBe(uniData.options[index].id);
            expect(option.name).toBe(uniData.options[index].text);
          });
        });
      });
    });

    describe('form buttons', () => {
      describe('when is editing is false', () => {
        const button = getWrapper({ isEditing: false }).find(Button);
        describe('renders a Button', () => {
          test('with correct props', () => {
            expect(button).toHaveLength(1);
            expect(button.prop('bsStyle')).toBe('warning');
            expect(button.props().children).toBe('common.cancel');
          });

          test('clicking it calls props.onCancel', () => {
            defaultProps.onCancel.reset();
            button.props().onClick();

            expect(defaultProps.onCancel.callCount).toBe(1);
          });
        });

        test('renders ReservationSubmitButton with correct props', () => {
          const wrapper = getWrapper();
          const instance = wrapper.instance();
          const submitButton = wrapper.find(ReservationSubmitButton);
          expect(submitButton).toHaveLength(1);
          expect(submitButton.prop('handleFormSubmit')).toBe(instance.handleFormSubmit);
          expect(submitButton.prop('hasPayment')).toBe(hasProducts(defaultProps.resource));
          expect(submitButton.prop('isMakingReservations')).toBe(defaultProps.isMakingReservations);
          expect(submitButton.prop('needManualConfirmation')).toBe(defaultProps.resource.needManualConfirmation);
        });
      });

      describe('when resource has products and is editing is false', () => {
        test('renders back button', () => {
          const resource = Resource.build({ products: [Product.build()] });
          const buttons = getWrapper({ isEditing: false, resource }).find(Button);
          const backButton = buttons.at(1);
          expect(backButton.prop('bsStyle')).toBe('default');
          expect(backButton.prop('onClick')).toBe(defaultProps.onBack);
          expect(backButton.props().children).toBe('common.previous');
        });
      });

      describe('when is editing is true', () => {
        const buttons = getWrapper({ isEditing: true }).find(Button);
        test('renders two buttons', () => {
          expect(buttons.length).toBe(2);
        });

        describe('the first button', () => {
          const button = buttons.at(0);

          test('has correct text', () => {
            expect(button.props().children).toBe('ReservationInformationForm.cancelEdit');
          });

          test('clicking it calls props.onCancel', () => {
            defaultProps.onCancel.reset();
            button.props().onClick();

            expect(defaultProps.onCancel.callCount).toBe(1);
          });
        });

        describe('the second button', () => {
          const button = buttons.at(1);

          test('has correct text', () => {
            expect(button.props().children).toBe('common.previous');
          });

          test('clicking it calls props.onBack', () => {
            defaultProps.onBack.reset();
            button.props().onClick();

            expect(defaultProps.onBack.callCount).toBe(1);
          });
        });

        test('renders ReservationSubmitButton with correct props', () => {
          const wrapper = getWrapper({ isEditing: true });
          const instance = wrapper.instance();
          const submitButton = wrapper.find(ReservationSubmitButton);
          expect(submitButton).toHaveLength(1);
          expect(submitButton.prop('handleFormSubmit')).toBe(instance.handleFormSubmit);
          expect(submitButton.prop('hasPayment')).toBe(defaultProps.hasPayment);
          expect(submitButton.prop('isMakingReservations')).toBe(defaultProps.isMakingReservations);
        });
      });
    });

    test('renders ReservationValidationErrors', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const validationErrors = wrapper.find(ReservationValidationErrors);
      expect(validationErrors).toHaveLength(1);
      expect(validationErrors.prop('formErrors')).toBe(instance.state.formErrors);
      expect(validationErrors.prop('showFormErrorList')).toBe(instance.state.showFormErrorList);
      expect(validationErrors.prop('universalFields')).toBe(defaultProps.resource.universalField);
    });

    describe('methods', () => {
      describe('componentDidUpdate', () => {
        test('sets correct state when showFormErrorList is true and formValues has changed', () => {
          const prevProps = { formValues: { foo: 'bar' } };
          const instance = getWrapper({ formValues: { foo: 'baz' } }).instance();
          instance.state.showFormErrorList = true;
          instance.state.formErrors = ['foo'];
          instance.componentDidUpdate(prevProps);
          expect(instance.state.showFormErrorList).toBe(false);
          expect(instance.state.formErrors).toEqual([]);
        });

        test('sets correct state when copied state is shown and formValues has changed', () => {
          const prevProps = { formValues: { foo: 'bar' } };
          const prevState = { showInfoCopied: true };
          const instance = getWrapper({ formValues: { foo: 'baz' } }).instance();
          instance.state.showInfoCopied = true;
          const spy = jest.spyOn(instance, 'setState');
          instance.componentDidUpdate(prevProps, prevState);
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith({ showInfoCopied: false });
        });
      });

      describe('copyReserverToPayerInfo', () => {
        const formValues = {
          reserverName: 'Test Tester',
          reserverEmailAddress: 'test.tester@provider.com',
          reserverPhoneNumber: '+49123456789',
          reserverAddressStreet: 'Test Street',
          reserverAddressZip: '12345',
          reserverAddressCity: 'Test City'
        };
        const dispatch = jest.fn();

        afterEach(() => {
          dispatch.mockClear();
        });

        test('sets state showInfoCopied to true', () => {
          const instance = getWrapper({ formValues, dispatch }).instance();
          const spy = jest.spyOn(instance, 'setState');
          instance.copyReserverToPayerInfo();
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith({ showInfoCopied: true });
        });

        test('calls dispatch change for all fields', () => {
          const instance = getWrapper({ formValues, dispatch }).instance();
          instance.copyReserverToPayerInfo();
          expect(dispatch).toHaveBeenCalledTimes(7);
          expect(dispatch).toHaveBeenCalledWith(change(FormTypes.RESERVATION, FIELDS.BILLING_FIRST_NAME.id, 'Test'));
          expect(dispatch).toHaveBeenCalledWith(change(FormTypes.RESERVATION, FIELDS.BILLING_LAST_NAME.id, 'Tester'));
          expect(dispatch).toHaveBeenCalledWith(change(FormTypes.RESERVATION, FIELDS.BILLING_PHONE_NUMBER.id, '+49123456789'));
          expect(dispatch).toHaveBeenCalledWith(change(FormTypes.RESERVATION, FIELDS.BILLING_EMAIL_ADDRESS.id, 'test.tester@provider.com'));
          expect(dispatch).toHaveBeenCalledWith(change(FormTypes.RESERVATION, FIELDS.BILLING_ADDRESS_STREET.id, 'Test Street'));
          expect(dispatch).toHaveBeenCalledWith(change(FormTypes.RESERVATION, FIELDS.BILLING_ADDRESS_ZIP.id, '12345'));
          expect(dispatch).toHaveBeenCalledWith(change(FormTypes.RESERVATION, FIELDS.BILLING_ADDRESS_CITY.id, 'Test City'));
        });

        test('calls dispatch change when some copy fields are missing', () => {
          const partialFormValues = {
            reserverName: 'Test Tester',
            reserverEmailAddress: 'test.tester@provider.com',
            reserverAddressCity: 'Test City'
          };
          const instance = getWrapper({ formValues: partialFormValues, dispatch }).instance();
          instance.copyReserverToPayerInfo();
          expect(dispatch).toHaveBeenCalledTimes(7);
          expect(dispatch).toHaveBeenCalledWith(change(FormTypes.RESERVATION, FIELDS.BILLING_FIRST_NAME.id, 'Test'));
          expect(dispatch).toHaveBeenCalledWith(change(FormTypes.RESERVATION, FIELDS.BILLING_LAST_NAME.id, 'Tester'));
          expect(dispatch).toHaveBeenCalledWith(
            change(FormTypes.RESERVATION, FIELDS.BILLING_PHONE_NUMBER.id, undefined));
          expect(dispatch).toHaveBeenCalledWith(change(FormTypes.RESERVATION, FIELDS.BILLING_EMAIL_ADDRESS.id, 'test.tester@provider.com'));
          expect(dispatch).toHaveBeenCalledWith(
            change(FormTypes.RESERVATION, FIELDS.BILLING_ADDRESS_STREET.id, undefined));
          expect(dispatch).toHaveBeenCalledWith(
            change(FormTypes.RESERVATION, FIELDS.BILLING_ADDRESS_ZIP.id, undefined));
          expect(dispatch).toHaveBeenCalledWith(change(FormTypes.RESERVATION, FIELDS.BILLING_ADDRESS_CITY.id, 'Test City'));
        });
      });

      describe('handleFormSubmit', () => {
        test('calls setState with correct params when there are form errors', () => {
          const instance = getWrapper({ formSyncErrors: { foo: 'bar' } }).instance();
          const spy = jest.spyOn(instance, 'setState');
          instance.handleFormSubmit();
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith({ showFormErrorList: true, formErrors: ['foo'] });
        });

        test('calls handleSubmit', () => {
          const handleSubmit = jest.fn();
          const instance = getWrapper({ handleSubmit }).instance();
          handleSubmit.mockClear();

          instance.handleFormSubmit();
          expect(handleSubmit).toHaveBeenCalledTimes(1);
          expect(handleSubmit).toHaveBeenCalledWith(defaultProps.onConfirm);
        });
      });
    });
  });
});
