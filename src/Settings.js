import React, { useState, memo } from 'react';
import styled from 'styled-components';
import SettingsMenu from './SettingsMenu';

const Settings = ({ tracks, tempo, useInternalAudio, dispatch }) => {
	const [active, setActive] = useState(false);
	const openMenu = () => setActive(true);
	const closeMenu = () => setActive(false);
	return (
		<Container>
			<MenuButton
				className={'menu-btn fa fa-gear ' + (active ? 'active' : '')}
				onClick={active ? closeMenu : openMenu}
			/>
			<SettingsMenu
				tracks={tracks}
				tempo={tempo}
				useInternalAudio={useInternalAudio}
				dispatch={dispatch}
				active={active}
			/>
		</Container>
	);
};

const Container = styled.div``;
const MenuButton = styled.i`
	position: fixed;
	top: 10px;
	right: 10px;
	font-size: 2em;
	color: #ddd;
	cursor: pointer;
	transition: 0.3s transform ease;
	z-index: 999;
	&:hover {
		color: #aaa;
	}
	&.active {
		transform: rotate(90deg);
	}
`;

export default memo(Settings);
