import React, { useReducer } from 'react';
import styled from 'styled-components';
import TrackItem from './TrackItem';

const TrackList = ({ output, tracks, dispatch }) => {
	return (
		<Container>
			{tracks.map((t, i) => (
				<TrackItem output={output} track={t} index={i} dispatch={dispatch} />
			))}
		</Container>
	);
};

const Container = styled.div``;

export default TrackList;
