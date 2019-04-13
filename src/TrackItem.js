import React from 'react';
import styled from 'styled-components';
import { useMIDIOutput } from '@react-midi/hooks';

const TrackItem = ({ output, track, index, dispatch }) => {
	const { noteOn, noteOff } = useMIDIOutput(output);
	const handleButtonClick = () => {
		noteOn(track.note, 100, track.channel);
		setTimeout(() => noteOff(track.note, 100, track.channel), 500);
	};
	const handleNameClick = () => {
		dispatch({ type: 'selectRing', ring: index });
	};
	return (
		<Container>
			<Button color={track.color} onClick={handleButtonClick} />
			<Info>
				<Name onClick={handleNameClick}>{track.name}</Name>
				<MIDIInfo>
					<Note>Note: {track.note}</Note>
					<Channel>Channel: {track.channel}</Channel>
				</MIDIInfo>
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
const Name = styled.div`
	cursor: pointer;
`;
const MIDIInfo = styled.div`
	display: flex;
	font-size: 0.75rem;
`;
const Note = styled.div`
	margin-right: 0.5rem;
`;
const Channel = styled.div``;

export default TrackItem;
