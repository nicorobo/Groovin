import React from 'react';
import styled from 'styled-components';
const channels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const types = ['drum', 'melodic'];
const SettingsMenu = ({ sequencer, dispatch, active }) => {
	const { tracks } = sequencer;
	return (
		<Container className={active ? 'active' : ''}>
			<Header>Settings</Header>
			{sequencer.tracks.map((t) => (
				<TrackSettings track={t} dispatch={dispatch} />
			))}
		</Container>
	);
};

const TrackSettings = ({ track, dispatch }) => {
	const setChannel = (e) => {
		dispatch({ type: 'setChannel', channel: e.target.value });
	};
	const setValue = (e) => {
		dispatch({ type: 'setValue', value: e.target.value });
	};
	const setType = (e) => {
		dispatch({ type: 'setType', type: e.target.value });
	};
	return (
		<TrackContainer>
			<TrackName>{track.name}</TrackName>
			<TrackOptions>
				<select onChange={setChannel} value={track.channel}>
					{channels.map((c) => (
						<option value={c}>{c}</option>
					))}
				</select>
				<select onChange={setType} value={track.type}>
					{types.map((t) => (
						<option value={t}>{t}</option>
					))}
				</select>
			</TrackOptions>
		</TrackContainer>
	);
};

const Header = styled.div`
	font-size: 1.5rem;
	font-weight: bold;
	text-align: center;
`;
const TrackContainer = styled.div`
	margin-bottom: 0.5rem;
`;
const TrackName = styled.div``;
const TrackOptions = styled.div``;
const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 300px;
	padding: 1.5rem 0.5rem 0.5rem 0.5rem;
	overflow: auto;
	background: rgba(255, 255, 255, 0.9);
	border: 1px solid #eee;
	border-radius: 5px;
	position: fixed;
	top: 10vh;
	height: 80vh;
	right: -300px;
	transition: 0.2s right ease;
	&.active {
		right: 10px;
	}
	@media (max-width: 500px) {
		right: -90%;
		&.active {
			right: 5%;
			width: 90%;
		}
	}
`;

export default SettingsMenu;
