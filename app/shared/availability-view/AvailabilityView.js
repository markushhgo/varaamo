import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import ReservationInfoModal from 'shared/modals/reservation-info';
import DateSelector from './DateSelector';
import TimelineGroups from './TimelineGroups';
import Sidebar from './Sidebar';

export default class AvailabilityView extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    isAdmin: PropTypes.bool.isRequired,
    onDateChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { hoverSelection: null, selection: null };
    this.handleReservationSlotClick = this.handleReservationSlotClick.bind(this);
    this.handleReservationSlotMouseEnter = this.handleReservationSlotMouseEnter.bind(this);
    this.handleReservationSlotMouseLeave = this.handleReservationSlotMouseLeave.bind(this);
    this.handleSelectionCancel = this.handleSelectionCancel.bind(this);
  }

  getSelection() {
    const selection = this.state.selection;
    const hover = this.state.hoverSelection;
    if (!selection && !hover) return null;
    if (selection && !hover) return selection;
    if (!selection && hover) return { ...hover, hover: true };
    return { ...selection, end: hover.end };
  }

  handleReservationSlotClick(slot) {
    if (this.state.selection) {
      if (this.state.selection.begin === slot.end) {
        this.handleSelectionCancel();
      } else {
        this.endSelection(slot);
      }
    } else {
      this.startSelection(slot);
    }
  }

  handleReservationSlotMouseEnter(slot) {
    const isSlotSelectable = (
      !this.state.selection || (
        this.state.selection.resourceId === slot.resourceId
        && this.state.selection.begin < slot.end
      )
    );
    if (isSlotSelectable) {
      this.setState({ hoverSelection: slot });
    }
  }

  handleReservationSlotMouseLeave(slot) {
    if (isEqual(slot, this.state.hoverSelection)) {
      this.setState({ hoverSelection: null });
    }
  }

  isUnderReservationMaxPeriod(slot) {
    const startTime = moment(this.state.selection.begin);
    const endTime = moment(slot.end);
    const maxTime = moment(slot.maxPeriod, 'hh:mm:ss').format('HH:mm:ss');
    const maxTimeDuration = moment.duration(maxTime).asHours();
    const durationTime = moment.duration((endTime.diff(startTime))).asHours();

    const isUnder = durationTime <= maxTimeDuration;

    return isUnder;
  }

  isOverReservationMinPeriod(slot) {
    const startTime = moment(this.state.selection.begin);
    const endTime = moment(slot.end);
    const minTime = moment(slot.minPeriod, 'hh:mm:ss').format('HH:mm:ss');
    const minTimeDuration = moment.duration(minTime).asHours();
    const durationTime = moment.duration((endTime.diff(startTime))).asHours();

    const isOver = durationTime >= minTimeDuration;

    return isOver;
  }

  handleSelectionCancel() {
    if (this.state.selection) {
      this.setState({ hoverSelection: null, selection: null });
    }
  }

  endSelection(slot) {
    if (!this.props.isAdmin) {
      const isValid = (
        this.state.selection.resourceId === slot.resourceId
        && this.state.selection.begin <= slot.begin
        && this.isOverReservationMinPeriod(slot)
        && this.isUnderReservationMaxPeriod(slot)
      );
      if (!isValid) {
        return;
      }
    } else {
      const isValid = (
        this.state.selection.resourceId === slot.resourceId
        && this.state.selection.begin <= slot.begin
      );
      if (!isValid) {
        return;
      }
    }

    const selection = { ...this.state.selection, end: slot.end };
    if (this.props.onSelect) this.props.onSelect(selection);
    this.setState({ selection: null });
  }

  startSelection(slot) {
    this.setState({ selection: slot });
  }

  render() {
    const selection = this.getSelection();
    return (
      <div className="availability-view">
        <div className="left">
          <div className="top-left" />
          <Sidebar
            date={this.props.date}
            groups={this.props.groups}
            selectedResourceId={selection && selection.resourceId}
          />
        </div>
        <div className="right">
          <DateSelector onChange={this.props.onDateChange} value={this.props.date} />
          <TimelineGroups
            date={this.props.date}
            groups={this.props.groups}
            isAdmin={this.props.isAdmin}
            onReservationSlotClick={this.handleReservationSlotClick}
            onReservationSlotMouseEnter={this.handleReservationSlotMouseEnter}
            onReservationSlotMouseLeave={this.handleReservationSlotMouseLeave}
            onSelectionCancel={this.handleSelectionCancel}
            selection={selection}
          />
        </div>
        <ReservationInfoModal />
      </div>
    );
  }
}
