import React, { useState } from 'react';
import styled from 'styled-components';
import usePlaySequence from './usePlaySequence';
import { useRing, useStepMarker, useTransport } from './drawing';

const width = 520;
const height = 520;

const Sequencer = ({ input, output, sequencer, dispatch }) => {
	const { tracks, current, activeTrack } = sequencer;
	const sequence = current.sequence;
	const [svg, setSvg] = useState(null);
	const [step, isPlaying, setIsPlaying] = usePlaySequence(input, output, sequencer);
	for (var i = 0; i < tracks.length; i++) {
		useRing(svg, i, activeTrack, sequence[i], tracks[i], dispatch);
	}
	useStepMarker(svg, step, isPlaying, sequence[0], tracks[activeTrack].color);
	useTransport(svg, isPlaying, setIsPlaying);
	return (
		<Container>
			<svg ref={setSvg} height={height} width={width} />
		</Container>
	);
};

const Container = styled.div`
	grid-area: 'b';
	display: flex;
	justify-content: center;
	align-items: center;
`;

export default Sequencer;
