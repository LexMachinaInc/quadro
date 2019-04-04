import React, { Component } from 'react';
import { deleteCookie } from "../helpers/authorization";
import '../App.scss';

export default class Logout extends Component {
  handleLogout = (e) => {
    e.preventDefault();
    deleteCookie("quadro");
    fetch('/logout')
      .then(resp => resp.json())
      .then((resp) => {
        if (resp.logout === 'success') {
          window.location.replace('/');
        }
      });
  }

  render() {
    return (
      <button type="button" onClick={this.handleLogout}>
        Logout
      </button>
    );
  }
}
