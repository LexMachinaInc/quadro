import React from 'react';
import { logOut } from "../helpers/authorization";
import '../App.scss';

export default function Logout(){
  return (
    <button type="button" onClick={logOut}>
      Logout
    </button>
  );
}
