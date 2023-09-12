import React, { Component } from "react";
import Home from "./Home";
import LoginForm from "./LoginForm";
import Login from "./fonts/login.svg"

function Header({ handleLoginClick }) {
	const handleClick = () => {
		handleLoginClick();
	};
	return (
		<div className="header">
			<div>
				{Home()};
				<span onClick={handleClick} className="loginicon">
					Sign In
				</span>
			</div>
		</div>
	);
}

export default Header;
