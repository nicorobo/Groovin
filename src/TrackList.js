import React from 'react';
import styled from 'styled-components';
import TrackItem from './TrackItem';

const TrackList = ({ output, activeTrack, tracks, dispatch }) => {
	return (
		<Container>
			{tracks.map((t, i) => (
				<TrackItem
					output={output}
					active={activeTrack === i}
					track={t}
					index={i}
					dispatch={dispatch}
				/>
			))}
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
