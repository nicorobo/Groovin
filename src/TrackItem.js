import React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
import { useInternalAudio } from './useInternalAudio';

const TrackItem = ({ output, track, index, dispatch }) => {
	const { noteOn, noteOff } = useInternalAudio(output);
	const handleButtonClick = () => {
		noteOn(track.note, 100, track.channel);
		setTimeout(() => noteOff(track.note, 100, track.channel), 500);
	};
	const handleNameClick = () => {
		dispatch({ type: 'selectTrack', track: index });
	};
	const handleClearTrack = () => {
		dispatch({ type: 'clearTrack', track: index });
	};
	return (
		<Container>
			<Button color={track.color} onClick={handleButtonClick} />
			<Info>
				<Name onClick={handleNameClick}>{track.name}</Name>
				<Clear onClick={handleClearTrack}>Clear</Clear>
			</Info>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	align-items: center;
	color: #333;
	margin-bottom: 1rem;
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
const Clear = styled.div`
	font-size: 0.75rem;
	color: salmon;
	cursor: pointer;
`;
const Name = styled.div`
	font-size: 0.85rem;
	cursor: pointer;
`;

export default TrackItem;
