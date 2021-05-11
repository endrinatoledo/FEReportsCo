/* eslint eqeqeq: 0 */
/* eslint-disable import/first */
import './assets/css/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Navigation from './components/Navigation/Navigation'
import Login from './components/Login/Login';
import NotRegistered from './components/NotRegistered/view';
if(
    localStorage.getItem("notReg") === "true" &&
    localStorage.getItem("email") === null &&
    localStorage.getItem("name") === null &&
    localStorage.getItem("client") === null &&
    localStorage.getItem("clientName") === null 
    ){
    ReactDOM.render(<NotRegistered />, document.getElementById('root'));
}else if(
    localStorage.getItem("email") === null ||
    localStorage.getItem("name") === null ||
    localStorage.getItem("client") === null ||
    localStorage.getItem("clientName") === null 
    ){
    ReactDOM.render(<Login />, document.getElementById('root'));
}else{
    ReactDOM.render(<Navigation />, document.getElementById('root'));
}
