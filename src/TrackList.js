import React, { memo } from 'react';
import styled from 'styled-components';
import TrackItem from './TrackItem';
import { lighten } from 'polished';

const TrackList = ({ output, activeTrack, soloed, tracks, noteOn, noteOff, dispatch }) => {
	const handleClear = () => {
		dispatch({ type: 'clearAll' });
	};
	return (
		<Container>
			{tracks.map((t, i) => (
				<TrackItem
					key={i}
					track={t}
					index={i}
					active={activeTrack === i}
					soloed={soloed === i}
					dispatch={dispatch}
					noteOn={noteOn}
					noteOff={noteOff}
				/>
			))}
			<ClearAll onClick={handleClear}>Clear All</ClearAll>
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

const ClearAll = styled.button`
	border: 1px solid #eee;
	border-radius: 5px;
	outline: 0;
	cursor: pointer;
	&:hover {
		color: #fff;
		background: ${lighten(0.05, '#2EBF91')};
		border-color: ${lighten(0.05, '#2EBF91')};
	}
	&:active {
		color: #fff;
		background: #2ebf91;
		border-color: #2ebf91;
	}
	padding: 0.25rem 0 0.25rem 0;
`;

export default memo(TrackList);
