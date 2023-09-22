import React from "react";
import Home from "./Home";
import LoginForm from "./LoginForm";
import login from "./fonts/login.svg"

export function loginClick({handleLoginClick}) {
	return () => {
		handleLoginClick();
	};
}

function Header({ handleLoginClick }) {
	const handleClick = loginClick({ handleLoginClick });
	return (
		<div className="header">
			<img src={login} onClick={handleClick} alt="" className="loginicon" />
			<Home /> {}
			<LoginForm isShowLogin={true} />
		</div>
	);
}

export default Header;
