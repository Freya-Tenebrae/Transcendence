import React, { Component } from "react";
import Home from "./Home";
import LoginForm from "./LoginForm";
import login from "./fonts/login.svg"

function Header({ handleLoginClick }) {
	const handleClick = () => {
	  handleLoginClick();
	};
  
	return (
	  <div className="header">
		<Home /> {}
		<LoginForm isShowLogin={true} />
		{
		<img src={login} onClick={handleClick} className="loginicon" />
		}
	  </div>
	);
  }

export default Header;
