import React from 'react';
import styled from 'styled-components';
import { midiToNoteName } from '@tonaljs/midi';
function getMidiValues() {
	let a = [];
	for (var i = 21; i <= 108; i++) {
		// A0 to C8
		a.push({ title: midiToNoteName(i), value: i });
	}
	return a;
}
const values = getMidiValues();
const channels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

const SettingsMenu = ({ sequencer, dispatch, active }) => {
	const { tracks, tempo, useInternalAudio } = sequencer;
	const handleToggleInternalAudio = () => {
		dispatch({ type: 'toggleInternalAudio' });
	};
	return (
		<Container className={active ? 'active' : ''}>
			<Header>Settings</Header>
			<TempoSettings tempo={tempo} dispatch={dispatch} />
			{tracks.map((t, i) => (
				<TrackSettings key={t.name} index={i} track={t} dispatch={dispatch} />
			))}
			<AudioToggle onClick={handleToggleInternalAudio}>
				{useInternalAudio ? 'Audio Off' : 'Audio On'}
			</AudioToggle>
		</Container>
	);
};

const TempoSettings = ({ tempo, dispatch }) => {
	const setTempo = (e) => dispatch({ type: 'setTempo', tempo: e.target.value });
	const increment = (e) => dispatch({ type: 'setTempo', tempo: parseInt(tempo) + 1 });
	const decrement = (e) => dispatch({ type: 'setTempo', tempo: parseInt(tempo) - 1 });
	return (
		<TempoContainer>
			<Decrement className="fas fa-caret-left" onClick={decrement} />
			<Tempo>{tempo} bpm</Tempo>
			<Increment className="fas fa-caret-right" onClick={increment} />
		</TempoContainer>
	);
};

const TrackSettings = ({ index, track, dispatch }) => {
	const setChannel = (e) => {
		dispatch({ type: 'setChannel', channel: e.target.value, track: index });
	};
	const setValue = (e) => {
		dispatch({ type: 'setValue', value: e.target.value, track: index });
	};
	return (
		<TrackContainer>
			<TrackColor color={track.color} />
			<TrackName>{track.name}</TrackName>
			<TrackOptions>
				<select onChange={setValue} value={track.note}>
					{values.map((v) => (
						<option value={v.value}>{v.title}</option>
					))}
				</select>
				<select onChange={setChannel} value={track.channel}>
					{channels.map((c) => (
						<option value={c}>{c}</option>
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
	margin-top: 2rem;
`;
const AudioToggle = styled.button`
	margin: 1rem 2rem 1rem 2rem;
`;
const TempoContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 1rem 0 1rem 0;
`;
const Decrement = styled.i`
	font-size: 1.5rem;
	opacity: 0.2;
	cursor: pointer;
	&:hover {
		opacity: 0.5;
	}
`;
const Increment = styled.i`
	font-size: 1.5rem;
	opacity: 0.2;
	cursor: pointer;
	&:hover {
		opacity: 0.5;
	}
`;
const Tempo = styled.div`
	font-size: 1rem;
	margin: 0 0.5rem 0 0.5rem;
`;

const TrackContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 1rem;
`;
const TrackColor = styled.div`
	height: 20px;
	width: 20px;
	background-color: ${(props) => props.color};
	border-radius: 50%;
	margin-right: 0.5rem;
`;
const TrackName = styled.div`
	font-size: 0.9rem;
	margin-right: 0.5rem;
`;
const TrackOptions = styled.div`
	*:first-child {
		margin-right: 0.5rem;
	}
`;
const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 300px;
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
