import React, { useState, useReducer } from 'react';
import styled from 'styled-components';
import { pie } from 'd3';
import usePlaySequence from './usePlaySequence';
import useRing from './useRing';

const width = 500;
const height = 500;

const getInitialSequence = (layers, steps) => {
	const sequence = [];
	for (var i = 0; i < layers; i++) {
		const layer = [];
		for (var j = 0; j < steps; j++) {
			layer.push(0);
		}
		sequence.push(layer);
	}
	return sequence;
};
const initialSequence = getInitialSequence(8, 16);

const reducer = (state, action) => {
	switch (action.type) {
		case 'updateValue':
			return state.map((r, i) =>
				i === action.ringIndex
					? r.map((s, i) => (i === action.stepIndex ? action.value : s))
					: r
			);
			break;
		default:
			break;
	}
};

const Sequencer = ({ input, output }) => {
	const getArcs = pie().value(1);
	const [svg, setSvg] = useState(null);
	const [ring, setRing] = useState(0);
	const [sequence, dispatch] = useReducer(reducer, initialSequence);
	const [step, isPlaying, setIsPlaying] = usePlaySequence(input, output, sequence);
	useRing(svg, 0, ring, getArcs(sequence[0]), setRing, dispatch);
	useRing(svg, 1, ring, getArcs(sequence[1]), setRing, dispatch);
	useRing(svg, 2, ring, getArcs(sequence[2]), setRing, dispatch);
	useRing(svg, 3, ring, getArcs(sequence[3]), setRing, dispatch);
	useRing(svg, 4, ring, getArcs(sequence[4]), setRing, dispatch);
	useRing(svg, 5, ring, getArcs(sequence[5]), setRing, dispatch);
	useRing(svg, 6, ring, getArcs(sequence[6]), setRing, dispatch);
	useRing(svg, 7, ring, getArcs(sequence[7]), setRing, dispatch);
	return (
		<Container>
			<svg ref={setSvg} height={height} width={width} />
		</Container>
	);
};
const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 2rem;
`;

export default Sequencer;
