import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import {
  confirmPreliminaryReservation,
  denyPreliminaryReservation,
} from 'actions/reservationActions';
import {
  openConfirmReservationModal,
  openReservationCancelModal,
  openReservationPaymentModal,
  selectReservationToCancel,
  selectReservationToEdit,
  selectReservationToShow,
  showReservationInfoModal,
  startReservationEditInInfoModal,
} from 'actions/uiActions';
import { getEditReservationUrl } from 'utils/reservationUtils';
import ReservationControls from './ReservationControls';

export class UnconnectedReservationControlsContainer extends Component {
  constructor(props) {
    super(props);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.handleDenyClick = this.handleDenyClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleInfoClick = this.handleInfoClick.bind(this);
    this.handlePayClick = this.handlePayClick.bind(this);
  }

  handleCancelClick() {
    const { actions, reservation } = this.props;
    actions.selectReservationToCancel(reservation);
    actions.openReservationCancelModal();
  }

  handleConfirmClick() {
    const { actions, isAdmin, reservation } = this.props;

    if (isAdmin && reservation.state === 'requested') {
      actions.confirmPreliminaryReservation(reservation);
    }
  }

  handleDenyClick() {
    const { actions, isAdmin, reservation } = this.props;

    if (isAdmin && reservation.state === 'requested') {
      actions.denyPreliminaryReservation(reservation);
    }
  }

  handleEditClick() {
    const {
      actions, reservation, resource, history
    } = this.props;
    const nextUrl = getEditReservationUrl(reservation);

    actions.selectReservationToEdit({ reservation, slotSize: resource.slotSize });
    history.push(nextUrl);
  }

  handleInfoClick() {
    const { actions, reservation } = this.props;

    actions.showReservationInfoModal(reservation);
  }

  handlePayClick() {
    const { actions, reservation } = this.props;
    actions.selectReservationToShow(reservation);
    actions.openReservationPaymentModal();
  }

  render() {
    const {
      isAdmin, reservation, paymentUrlData
    } = this.props;

    return (
      <ReservationControls
        isAdmin={isAdmin}
        onCancelClick={this.handleCancelClick}
        onConfirmClick={this.handleConfirmClick}
        onDenyClick={this.handleDenyClick}
        onEditClick={this.handleEditClick}
        onInfoClick={this.handleInfoClick}
        onPayClick={this.handlePayClick}
        paymentUrlData={paymentUrlData}
        reservation={reservation}
      />
    );
  }
}

UnconnectedReservationControlsContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  paymentUrlData: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    confirmPreliminaryReservation,
    denyPreliminaryReservation,
    openConfirmReservationModal,
    openReservationCancelModal,
    openReservationPaymentModal,
    selectReservationToCancel,
    selectReservationToEdit,
    selectReservationToShow,
    showReservationInfoModal,
    startReservationEditInInfoModal,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(UnconnectedReservationControlsContainer)
);
