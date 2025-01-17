import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Well from 'react-bootstrap/lib/Well';
import iconHome from 'hel-icons/dist/shapes/home.svg';

import { injectT } from 'i18n';
import ReservationDate from 'shared/reservation-date';
import { getFeedbackLink } from 'utils/languageUtils';
import { getReservationCustomerGroupName } from 'utils/reservationUtils';
import constants from '../../../constants/AppConstants';
import { checkQualityToolsLink } from '../../../shared/quality-tools-form/qualityToolsUtils';
import ThankYouAndFeedback from './ThankYouAndFeedback';
import { isMultiday } from '../../../utils/timeUtils';
import ReservationOvernightDate from '../../../shared/reservation-date/ReservationOvernightDate';

class ReservationConfirmation extends Component {
  static propTypes = {
    currentLanguage: PropTypes.string,
    isEdited: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    reservation: PropTypes.shape({
      begin: PropTypes.string,
      reservation: PropTypes.string,
      reserverEmailAddress: PropTypes.string,
      reserverName: PropTypes.string,
      company: PropTypes.string,
      comments: PropTypes.string,
      user: PropTypes.shape({
        email: PropTypes.string,
      }),
      universalData: PropTypes.shape({
        field: PropTypes.shape({
          description: PropTypes.string,
          id: PropTypes.number,
          label: PropTypes.string,
          options: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            text: PropTypes.string,
          })),
        }),
        selectOption: PropTypes.string,
        type: PropTypes.string,
      }),
    }),
    resource: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      resourceHasQualityToolsLink: false
    };
  }

  componentDidMount() {
    const { resource } = this.props;
    if (resource && resource.id) {
      checkQualityToolsLink(resource.id)
        .then((hasQualityToolLink) => {
          this.setState({
            resourceHasQualityToolsLink: hasQualityToolLink
          });
        })
        .catch(() => this.setState({ resourceHasQualityToolsLink: false }));
    }
  }

  handleReservationsButton(isLoggedIn) {
    if (isLoggedIn) this.props.history.replace('/my-reservations');
    else this.props.history.replace('/');
  }

  renderUniversalData() {
    const { universalData: { selectedOption, field } } = this.props.reservation;
    const selectedOptionId = Number.parseInt(selectedOption, 10);
    const label = field ? field.label : '';
    const correctOption = field.options.find(option => option.id === selectedOptionId);
    const value = correctOption ? correctOption.text : '';
    return this.renderField('universalData', label, value);
  }

  renderField(field, label, value) {
    return (
      <Row
        className="app-ReservationConfirmation__field"
        key={`reservation-confirmation-field-${field}`}
      >
        <Col xs={12}>
          <b>{label}</b>
        </Col>
        <Col className="app-ReservationConfirmation__field-value" xs={12}>
          {value}
        </Col>
      </Row>
    );
  }

  renderReturnButton(isLoggedIn, t) {
    return (
      <Button
        bsStyle="primary"
        className="app-ReservationConfirmation__button"
        onClick={() => this.handleReservationsButton(isLoggedIn)}
      >
        {isLoggedIn ? t('ReservationConfirmation.ownReservationButton') : t('ReservationConfirmation.returnToHomeButton')}
      </Button>
    );
  }

  render() {
    const {
      currentLanguage, isEdited, isLoggedIn, reservation, resource, t, user
    } = this.props;
    const { resourceHasQualityToolsLink } = this.state;
    // if resource has feedback url defined, use it instead of default urls
    const resourceFeedbackUrl = 'reservationFeedbackUrl' in resource ? resource.reservationFeedbackUrl : '';
    const href = resourceFeedbackUrl || getFeedbackLink(currentLanguage);

    const customerGroupName = getReservationCustomerGroupName(reservation, currentLanguage);
    let email = '';
    if (reservation.reserverEmailAddress) {
      email = reservation.reserverEmailAddress;
    } else if (reservation.user && reservation.user.email) {
      email = reservation.user.email;
    } else if (user.email) {
      email = user.email;
    }

    const reservationIsMultiday = isMultiday(reservation.begin, reservation.end);

    return (
      <Row className="app-ReservationConfirmation">
        <Col lg={6} md={12} xs={12}>
          <Well>
            <h2 className="app-ReservationPage__header">
              {t(`ReservationConfirmation.reservation${isEdited ? 'Edited' : 'Created'}Title`)}
            </h2>
            {reservationIsMultiday
              ? <ReservationOvernightDate beginDate={reservation.begin} endDate={reservation.end} />
              : <ReservationDate beginDate={reservation.begin} endDate={reservation.end} />
            }
            <p className="app-ReservationConfirmation__resource-name">
              <img
                alt=""
                className="app-ReservationConfirmation__icon"
                src={iconHome}
              />
              {resource.name}
            </p>
            {!isEdited && (
              <p>
                <FormattedHTMLMessage
                  id="ReservationConfirmation.confirmationText"
                  values={{ email }}
                />
              </p>
            )}
            <ThankYouAndFeedback
              feedbackHref={href}
              reservation={reservation}
              reservationIsEdited={isEdited}
              resourceHasQualityToolsLink={resourceHasQualityToolsLink}
            />
            <p className="app-ReservationConfirmation__button-wrapper">
              {this.renderReturnButton(isLoggedIn, t)}
            </p>
          </Well>
        </Col>
        <Col lg={6} md={12} xs={12}>
          <Well>
            <h2 id="reservationDetails">{t('ReservationConfirmation.reservationDetailsTitle')}</h2>
            {reservation.reserverName
              && this.renderField(
                'reserverName',
                t('common.reserverNameLabel'),
                reservation.reserverName
              )}
            {reservation.company
              && this.renderField(
                'company',
                t('common.companyLabel'),
                reservation.company
              )}
            {reservation.reserverId
              && this.renderField('reserverId', t('common.reserverIdLabel'), reservation.reserverId)}
            {reservation.reserverPhoneNumber
              && this.renderField(
                'reserverPhoneNumber',
                t('common.reserverPhoneNumberLabel'),
                reservation.reserverPhoneNumber
              )}
            {reservation.reserverEmailAddress
              && this.renderField(
                'reserverEmailAddress',
                t('common.reserverEmailAddressLabel'),
                reservation.reserverEmailAddress
              )}
            {reservation.eventSubject
              && this.renderField(
                'eventSubject',
                t('common.eventSubjectLabel'),
                reservation.eventSubject
              )}
            {reservation.eventDescription
              && this.renderField(
                'eventDescription',
                t('common.eventDescriptionLabel'),
                reservation.eventDescription
              )}
            {reservation.numberOfParticipants
              && this.renderField(
                'numberOfParticipants',
                t('common.numberOfParticipantsLabel'),
                reservation.numberOfParticipants
              )}
            {reservation.requireAssistance
              && this.renderField(
                'requireAssistance',
                t('common.requireAssistanceLabel'),
                t('common.yes'),
                reservation.requireAssistance
              )}
            {reservation.requireWorkstation
              && this.renderField(
                'requireWorkstation',
                t('common.requireWorkstationLabel'),
                t('common.yes'),
                reservation.requireWorkstation
              )}
            {reservation.privateEvent
              && this.renderField(
                'privateEvent',
                t('common.privateEventLabel'),
                t('common.yes'),
                reservation.privateEvent
              )}
            {reservation.comments
              && this.renderField('comments', t('common.commentsLabel'), reservation.comments)}
            {reservation.reserverAddressStreet
              && this.renderField(
                'reserverAddressStreet',
                t('common.addressStreetLabel'),
                reservation.reserverAddressStreet
              )}
            {reservation.reserverAddressZip
              && this.renderField(
                'reserverAddressZip',
                t('common.addressZipLabel'),
                reservation.reserverAddressZip
              )}
            {reservation.reserverAddressCity
              && this.renderField(
                'reserverAddressCity',
                t('common.addressCityLabel'),
                reservation.reserverAddressCity
              )}
            {reservation.homeMunicipality
              && this.renderField(
                'homeMunicipality',
                t('common.homeMunicipality'),
                reservation.homeMunicipality.name[currentLanguage]
              )}
            {customerGroupName
             && this.renderField(
               'customerGroupName',
               t('common.customerGroup'),
               customerGroupName,
             )}
            {reservation.order
              && this.renderField(
                'reservationPrice',
                t('common.priceTotalLabel'),
                `${reservation.order.price}€`,
              )}
            {reservation.order
              && this.renderField(
                'reservationPaymentMethod',
                t('common.paymentMethod'),
                reservation.order.paymentMethod === constants.PAYMENT_METHODS.CASH
                  ? t('common.paymentMethod.cash') : t('common.paymentMethod.online')
              )}
            {(reservation.billingFirstName
              || reservation.billingLastName
              || reservation.billingPhoneNumber
              || reservation.billingEmailAddress
              || reservation.billingAddressStreet
              || reservation.billingAddressZip
              || reservation.billingAddressCity)
              && (
              <Col className="details-heading" xs={12}>
                <h3 id="billingInformationHeader">{t('common.payerInformationLabel')}</h3>
              </Col>
              )}
            {reservation.billingFirstName
              && this.renderField(
                'billingFirstName',
                t('common.billingFirstNameLabel'),
                reservation.billingFirstName,
              )}
            {reservation.billingLastName
              && this.renderField(
                'billingLastName',
                t('common.billingLastNameLabel'),
                reservation.billingLastName,
              )}
            {reservation.billingPhoneNumber
              && this.renderField(
                'billingPhoneNumber',
                t('common.billingPhoneNumberLabel'),
                reservation.billingPhoneNumber,
              )}
            {reservation.billingEmailAddress
              && this.renderField(
                'billingEmailAddress',
                t('common.billingEmailAddressLabel'),
                reservation.billingEmailAddress,
              )}
            {reservation.billingAddressStreet
              && this.renderField(
                'billingAddressStreet',
                t('common.addressStreetLabel'),
                reservation.billingAddressStreet
              )}
            {reservation.billingAddressZip
              && this.renderField(
                'billingAddressZip',
                t('common.addressZipLabel'),
                reservation.billingAddressZip
              )}
            {reservation.billingAddressCity
              && this.renderField(
                'billingAddressCity',
                t('common.addressCityLabel'),
                reservation.billingAddressCity
              )}
            {reservation.universalData && this.renderUniversalData()}
            {reservation.reservationExtraQuestions && (
            <Col className="details-heading" xs={12}>
              <h3 id="reservationExtraQuestionsHeader">{t('common.additionalInfo.heading')}</h3>
            </Col>
            )}
            {reservation.reservationExtraQuestions
            && this.renderField(
              'reservationExtraQuestions',
              t('common.additionalInfo.label'),
              reservation.reservationExtraQuestions
            )}
          </Well>
        </Col>
      </Row>
    );
  }
}

export default injectT(ReservationConfirmation);
