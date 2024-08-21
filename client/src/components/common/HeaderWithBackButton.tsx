import React from 'react';
import '../../styles/css/components/common/headerWithBackButton.css'
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const HeaderWithBackButton = () => {
	const navigate = useNavigate()
	return (
		<header className="back-header">
			<button onClick={() => navigate(-1)} className="back-button">
				<IoIosArrowBack />
			</button>
		</header>
	);
};

export default HeaderWithBackButton;