import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Spinner from '../common/Spinner';
import { changePassword } from '../../actions/profileActions'
import TabPaneSwitch from './TabPaneSwitch';
import TextFieldGroup from '../common/TextFieldGroup'
import classnames from 'classnames'
const isEmpty = require('./is-empty');

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      password: '',
      newPassword: '',
      renewPassword: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }


  componentWillReceiveProps(nextProps,nextContext) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile;

      // profile.password = !isEmpty(profile.password) ? profile.password : '';
      // profile.newPassword = !isEmpty(profile.newPassword) ? profile.newPassword : '';
      // profile.renewPassword = !isEmpty(profile.renewPassword) ? profile.renewPassword : '';

      // Set component fields state
      this.setState({
        password: profile.password,
        newPassword: profile.newPassword,
        renewPassword: profile.renewPassword
      });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();

    const profileData = {
      password: this.state.password,
      newPassword: this.state.newPassword,
      renewPassword: this.state.renewPassword
    };
    console.log({profileData})
    this.props.changePassword(profileData, this.props.history);
    console.log("Change Password Logged")

  }
  render() {
    const { errors } = this.state;
    const { profile, loading } = this.props.profile;
    let profileContent;

    if (profile === null || loading) {
      profileContent = <Spinner />;
    } else {
      profileContent = (
        <div >
          <div className="col-sm-9">
            <TabPaneSwitch/>
            <div className="row">
              <div className="col-sm-10"><h2>Change Password</h2></div>
              <div className="col-sm-2"><Link to="/" className="pull-right"/></div>
            </div>

            <div className="tab-content">
              <div className="tab-pane active">
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <input
                           className={classnames('form-control form-control-lg', { 'is-invalid': errors.password })}
                           placeholder="Old Password"
                           name="password" type="password"
                           value={this.state.password} onChange={this.onChange}/>
                    {"Enter Your Old Password" && <small className="form-text text-muted">{"Enter Your Old Password"}</small>}
                    {errors.password && (<div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      className={classnames('form-control form-control-lg', { 'is-invalid': errors.newPassword })}
                      placeholder="New Password"
                      name="newPassword" type="password"
                      value={this.state.newPassword} onChange={this.onChange}/>
                    {"Enter a new Password different from previous one" && <small className="form-text text-muted">{"Enter a new Password different from previous one"}</small>}
                    {errors.newPassword && (<div className="invalid-feedback">{errors.newPassword}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      className={classnames('form-control form-control-lg', { 'is-invalid': errors.renewPassword })}
                      placeholder="Re-Enter Password"
                      name="renewPassword"
                      type="password"
                      value={this.state.renewPassword} onChange={this.onChange}/>
                    {errors.renewPassword && (<div className="invalid-feedback">{errors.renewPassword}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <div className="col-xs-12">
                      <button className="btn btn-primary w-30 my-1" type="submit">Confirm Change</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container bootstrap snippet changePassword" style={{maxWidth: '100%'}}>
        <div className="row" style={{maxWidth: '100%'}}>
        </div>
        {profileContent}
      </div>
    );
  }
}

ChangePassword.propTypes = {
  changePassword: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps,{changePassword} )(ChangePassword);