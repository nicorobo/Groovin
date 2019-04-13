import React, { useReducer } from 'react';
import styled from 'styled-components';
import TrackItem from './TrackItem';

const TrackList = ({ output, tracks }) => {
	return (
		<Container>
			{tracks.map((t) => (
				<TrackItem output={output} track={t} />
			))}
		</Container>
	);
};

const Container = styled.div``;

export default TrackList;
