import React from 'react';
import { createAction } from 'redux-actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formId: '',
      formUsername: '',
      formPassword: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();

    // get id, username and password and build basic auth token
    const id = this.state.formId;
    const token = Buffer.from(`${this.state.formUsername}:${this.state.formPassword}`)
      .toString('base64');

    // handle auth redux action
    this.props.setAuthStuff({ auth: { token, userId: id } });

    // clear input fields and hide form
    this.setState({ formId: '', formUsername: '', formPassword: '' });
    this.props.hideForm();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="login-id">
            Id
            <input
              id="login-id"
              name="formId"
              onChange={this.handleInputChange}
              type="text"
              value={this.state.formId}
            />
          </label>

          <label htmlFor="login-username">
            Username
            <input
              id="login-username"
              name="formUsername"
              onChange={this.handleInputChange}
              type="text"
              value={this.state.formUsername}
            />
          </label>

          <label htmlFor="login-password">
            Password
            <input
              id="login-password"
              name="formPassword"
              onChange={this.handleInputChange}
              type="password"
              value={this.state.formPassword}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

LoginForm.propTypes = {
  setAuthStuff: PropTypes.func,
  hideForm: PropTypes.func
};

const setAuthStuff = createAction(
  'AUTH_GET_SUCCESS',
  payload => payload
);

const mapDispatchToProps = dispatch => ({
  setAuthStuff: data => dispatch(setAuthStuff(data))
});

export default connect(null, mapDispatchToProps)(LoginForm);
