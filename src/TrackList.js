import React from 'react';
import styled from 'styled-components';
import TrackItem from './TrackItem';

const TrackList = ({ output, sequencer, dispatch }) => {
	const { activeTrack, soloed, tracks } = sequencer;
	const handleClear = () => {
		dispatch({ type: 'clearAll' });
	};
	return (
		<Container>
			{tracks.map((t, i) => (
				<TrackItem
					key={i}
					output={output}
					track={t}
					index={i}
					active={activeTrack === i}
					soloed={soloed === i}
					dispatch={dispatch}
				/>
			))}
			<button onClick={handleClear}>Clear All</button>
		</Container>
	);
};

const Container = styled.div`
	grid-area: 'a';
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 1rem;
`;

export default TrackList;
