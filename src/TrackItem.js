import React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
// import { useAudio } from './useAudio';

const TrackItem = ({ output, track, index, active, soloed, dispatch }) => {
	// const { noteOn, noteOff } = useAudio(output);
	const handleButtonClick = () => {
		// noteOn(track.note, 100, track.channel);
		// setTimeout(() => noteOff(track.note, 100, track.channel), 500);
	};
	const handleNameClick = () => {
		dispatch({ type: 'selectTrack', track: index });
	};
	const handleClearTrack = () => {
		dispatch({ type: 'clearTrack', track: index });
	};
	const handleMuteTrack = () => {
		dispatch({ type: 'muteTrack', track: index });
	};
	const handleSoloTrack = () => {
		dispatch({ type: 'soloTrack', track: index });
	};
	return (
		<Container>
			<Button color={track.color} onClick={handleButtonClick} />
			<Info>
				<Name active={active} onClick={handleNameClick}>
					{track.name}
				</Name>
				<Clear onClick={handleClearTrack}>C</Clear>
				<Mute color={track.color} active={track.muted} onClick={handleMuteTrack}>
					M
				</Mute>
				<Solo color={track.color} active={soloed} onClick={handleSoloTrack}>
					S
				</Solo>
			</Info>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	align-items: center;
	color: #333;
	margin-bottom: 1rem;
	button {
		outline: none;
	}
`;
const Button = styled.div`
	height: 30px;
	width: 30px;
	cursor: pointer;
	background: ${(props) => props.color};
	border-radius: 50%;
	margin-right: 0.5rem;
	&:hover {
		background: ${(props) => lighten(0.05, props.color)};
	}
	&:active {
		background: ${(props) => props.color};
	}
`;
const Info = styled.div``;
const Name = styled.div`
	font-size: 0.85rem;
	cursor: pointer;
	margin-bottom: 0.3rem;
	font-weight: ${(props) => (props.active ? 'bold' : '')};
`;
const Clear = styled.button`
	font-size: 0.75rem;
	cursor: pointer;
	margin-right: 0.5rem;
	border: 1px solid #eee;
	border-radius: 5px;
	width: 1.8rem;
	&:hover {
		background: #eee;
	}
`;
const Mute = styled.button`
	font-size: 0.75rem;
	border: 1px solid;
	border-color: ${(props) => (props.active ? props.color : '#eee')};
	border-radius: 5px 0 0 5px;
	color: ${(props) => (props.active ? '#fff' : '')};
	width: 1.8rem;
	cursor: pointer;
	background-color: ${(props) => (props.active ? props.color : '#fff')};
	&:hover {
		background: ${(props) => (props.active ? '' : '#eee')};
	}
`;
const Solo = styled.button`
	font-size: 0.75rem;
	cursor: pointer;
	border: 1px solid;
	border-color: ${(props) => (props.active ? lighten(0.05, props.color) : '#eee')};
	border-radius: 0 5px 5px 0;
	color: ${(props) => (props.active ? '#fff' : '')};
	margin-left: -1px;
	width: 1.8rem;
	background-color: ${(props) => (props.active ? lighten(0.05, props.color) : '#fff')};
	&:hover {
		background: ${(props) => (props.active ? '' : '#eee')};
	}
`;

export default TrackItem;
