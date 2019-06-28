import PropTypes from 'prop-types';
import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import Overlay from 'react-bootstrap/lib/Overlay';
import DayPicker from 'react-day-picker';
import moment from 'moment';
import MomentLocaleUtils from 'react-day-picker/moment';

import { injectT } from 'i18n';
import SearchControlOverlay from './SearchControlOverlay';
import iconCalendar from './images/calendar.svg';

class DatePickerControl extends React.Component {
  static propTypes = {
    currentLanguage: PropTypes.string.isRequired,
    date: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { date } = this.props;
    this.state = {
      date,
      visible: false,
    };

    this.handleDateInputChange = this.handleDateInputChange.bind(this);
    this.handleDateButtonClick = this.handleDateButtonClick.bind(this);
    this.handleDateInputFocusOut = this.handleDateInputFocusOut.bind(this);
  }

  componentWillUpdate(nextProps) {
    const { date } = nextProps;
    if (date !== this.props.date) {
      // TODO: fix this lint
      // eslint-disable-next-line react/no-will-update-set-state
      this.setState({ date });
    }
  }

  hideOverlay = () => {
    this.setState({ visible: false });
  };

  showOverlay = () => {
    this.setState({ visible: true });
  };

  handleConfirm = (value) => {
    const date = value;
    this.props.onConfirm({ date });
    this.hideOverlay();
  };

  handleDateInputChange(event) {
    const date = event.target.value;
    this.setState({ date });
  }

  handleDateInputFocusOut() {
    const date = this.state.date;
    if (moment(date, 'L').isValid() === false) {
      const todaysDate = moment().format('L');
      this.handleConfirm(todaysDate);
      this.setState({ date: todaysDate });
    } else {
      this.handleConfirm(date);
    }
  }

  handleDateButtonClick() {
    if (this.state.visible === true) {
      this.hideOverlay();
    } else {
      this.showOverlay();
    }
  }

  render() {
    const { currentLanguage, t } = this.props;
    const localDate = this.state.date;
    const { date } = this.props;
    const selectedDay = moment(date, 'L')
      .startOf('day')
      .toDate();

    return (
      <div className="app-DatePickerControl">
        <FormGroup controlId="datePickerField">
          <ControlLabel>{t('DatePickerControl.label')}</ControlLabel>
          <InputGroup>
            <FormControl
              onBlur={this.handleDateInputFocusOut}
              onChange={this.handleDateInputChange}
              type="text"
              value={localDate}
            />


            <InputGroup.Button>
              <Button className="app-DatePickerControl__button" onClick={this.handleDateButtonClick}>
                <img alt="" className="app-DatePickerControl__icon" src={iconCalendar} />
              </Button>
            </InputGroup.Button>


          </InputGroup>
        </FormGroup>
        <Overlay
          container={this}
          onHide={this.hideOverlay}
          placement="bottom"
          rootClose
          show={this.state.visible}
        >
          <SearchControlOverlay onHide={this.hideOverlay} title={t('DatePickerControl.header')}>
            <DayPicker
              disabledDays={day => new Date(day).setHours(23, 59, 59, 59) < new Date()}
              initialMonth={selectedDay}
              locale={currentLanguage}
              localeUtils={MomentLocaleUtils}
              onDayClick={this.handleConfirm}
              selectedDays={selectedDay}
              showOutsideDays
              showWeekNumbers
            />
          </SearchControlOverlay>
        </Overlay>
      </div>
    );
  }
}

export default injectT(DatePickerControl);
