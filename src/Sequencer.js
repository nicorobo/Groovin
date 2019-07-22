import React, { useState, memo } from 'react';
import styled from 'styled-components';
import usePlaySequence from './usePlaySequence';
import { useRing, useStepMarker, useTransport } from './drawing';

const width = 520;
const height = 520;

const Sequencer = ({ input, output, sequencer, noteOn, noteOff, dispatch }) => {
	const { tracks, current, activeTrack } = sequencer;
	const sequence = current.sequence;
	const [svg, setSvg] = useState(null);
	const [step, isPlaying, setIsPlaying] = usePlaySequence(
		input,
		output,
		sequencer,
		noteOn,
		noteOff
	);
	return (
		<Container>
			<svg ref={setSvg} height={height} width={width} />
			<Rings
				svg={svg}
				tracks={tracks}
				activeTrack={activeTrack}
				sequence={sequence}
				dispatch={dispatch}
			/>
			<Transport svg={svg} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
			<StepMarker
				svg={svg}
				step={step}
				isPlaying={isPlaying}
				data={sequence[0]}
				color={tracks[activeTrack].color}
			/>
		</Container>
	);
};

const Rings = memo(({ svg, tracks, activeTrack, sequence, dispatch }) => {
	const arr = [0, 1, 2, 3, 4, 5, 6, 7];
	return arr.map((i) => (
		<Ring
			key={i}
			svg={svg}
			index={i}
			activeTrack={activeTrack}
			sequence={sequence[i]}
			track={tracks[i]}
			dispatch={dispatch}
		/>
	));
});
const Ring = memo(({ svg, index, activeTrack, sequence, track, dispatch }) => {
	useRing(svg, index, activeTrack, sequence, track, dispatch);
	return null;
});

const Transport = ({ svg, isPlaying, setIsPlaying }) => {
	useTransport(svg, isPlaying, setIsPlaying);
	return null;
};

const StepMarker = ({ svg, step, isPlaying, data, color }) => {
	useStepMarker(svg, step, isPlaying, data, color);
	return null;
};

const Container = styled.div`
	grid-area: 'b';
	display: flex;
	justify-content: center;
	align-items: center;
`;

export default Sequencer;
