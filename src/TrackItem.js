import React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';

const TrackItem = ({ track, index, active, soloed, noteOn, noteOff, dispatch }) => {
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
	const handleMuteTrack = () => {
		dispatch({ type: 'muteTrack', track: index });
	};
	const handleSoloTrack = () => {
		dispatch({ type: 'soloTrack', track: index });
	};
	const handleSetToDrum = () => {
		dispatch({ type: 'setType', track: index, trackType: 'drum' });
	};
	const handleSetToMelodic = () => {
		dispatch({ type: 'setType', track: index, trackType: 'melodic' });
	};
	const handleNudgeLeft = () => {
		dispatch({ type: 'nudgeTrack', track: index, direction: 'left' });
	};
	const handleNudgeRight = () => {
		dispatch({ type: 'nudgeTrack', track: index, direction: 'right' });
	};
	const handleFlip = () => {
		dispatch({ type: 'flipTrack', track: index });
	};
	return (
		<Container>
			<Trigger color={track.color} onMouseDown={handleButtonClick} />
			<Settings>
				<Name active={active} onClick={handleNameClick}>
					{track.name}
				</Name>
				<Row>
					<Clear onClick={handleClearTrack}>C</Clear>
					<Button
						color={track.color}
						active={track.muted}
						side={'left'}
						onClick={handleMuteTrack}>
						M
					</Button>
					<Button
						color={track.color}
						active={soloed}
						side={'right'}
						onClick={handleSoloTrack}>
						S
					</Button>
				</Row>
				{active && (
					<Row>
						<Button color={track.color} side={'left'} onClick={handleNudgeLeft}>
							Left
						</Button>
						<Button color={track.color} side={'middle'} onClick={handleFlip}>
							Flip
						</Button>
						<Button color={track.color} side={'right'} onClick={handleNudgeRight}>
							Right
						</Button>
					</Row>
				)}
				{active && (
					<Row>
						<Button
							color={track.color}
							side={'left'}
							active={track.type === 'drum'}
							onClick={handleSetToDrum}>
							Drum
						</Button>
						<Button
							color={track.color}
							side={'right'}
							active={track.type === 'melodic'}
							onClick={handleSetToMelodic}>
							Melodic
						</Button>
					</Row>
				)}
			</Settings>
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
const Trigger = styled.div`
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
const Settings = styled.div``;
const Row = styled.div`
	margin-bottom: 0.25rem;
`;
const Name = styled.div`
	font-size: 0.85rem;
	cursor: pointer;
	margin-bottom: 0.3rem;
	font-weight: ${(props) => (props.active ? 'bold' : '')};
`;

const Button = styled.button`
	font-size: 0.75rem;
	border: 1px solid;
	border-color: ${(props) => (props.active ? props.color : '#eee')};
	border-radius: ${(props) => {
		if (props.side === 'right') return '0 5px 5px 0';
		else if (props.side === 'left') return '5px 0 0 5px';
		else if (props.side === 'middle') return '0';
		else return '5px';
	}}
	color: ${(props) => (props.active ? '#fff' : '')};
	cursor: pointer;
	min-width: 1.8rem;
	background-color: ${(props) => (props.active ? props.color : '#fff')};
	&:hover {
		background: ${(props) => (props.active ? '' : '#eee')};
	}
`;
const Clear = styled(Button)`
	margin-right: 0.5rem;
`;

export default TrackItem;
