import React from 'react';
import styled from 'styled-components';
import { useMIDIOutput } from '@react-midi/hooks';
import { useInternalAudio } from './useInternalAudio';

const TrackItem = ({ output, track, index, dispatch }) => {
	const { noteOn, noteOff } = useInternalAudio(output);
	const handleButtonClick = () => {
		noteOn(track.note, 100, track.channel);
		setTimeout(() => noteOff(track.note, 100, track.channel), 500);
	};
	const handleNameClick = () => {
		dispatch({ type: 'selectRing', ring: index });
	};
	const handleClearTrack = () => {
		dispatch({ type: 'clearTrack', ring: index });
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
	color: #333;
	margin-bottom: 1rem;
`;
const Button = styled.div`
	height: 30px;
	width: 30px;
	background: ${(props) => props.color};
	border-radius: 50%;
	margin-right: 0.5rem;
`;
const Info = styled.div``;
const Clear = styled.div`
	font-size: 0.75rem;
	color: salmon;
	cursor: pointer;
`;
const Name = styled.div`
	cursor: pointer;
`;

export default TrackItem;
