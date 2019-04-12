import React, { useState, useReducer } from 'react';
import styled from 'styled-components';
import usePlaySequence from './usePlaySequence';
import { useRing, useOuterRing } from './useRing';

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
			// If value isn't changing, don't rerender
			if (state[action.ringIndex][action.stepIndex] === action.value) return state;
			return state.map((r, i) =>
				i === action.ringIndex
					? r.map((s, i) => (i === action.stepIndex ? action.value : s))
					: r
			);
		default:
			break;
	}
};

/// I'm changing useRing to use data instead of arcs!

const Sequencer = ({ input, output }) => {
	const [svg, setSvg] = useState(null);
	const [ring, setRing] = useState(0);
	const [sequence, dispatch] = useReducer(reducer, initialSequence);
	const [step, isPlaying, setIsPlaying] = usePlaySequence(input, output, sequence);
	useRing(svg, 0, ring, sequence[0], setRing, dispatch);
	useRing(svg, 1, ring, sequence[1], setRing, dispatch);
	useRing(svg, 2, ring, sequence[2], setRing, dispatch);
	useRing(svg, 3, ring, sequence[3], setRing, dispatch);
	useRing(svg, 4, ring, sequence[4], setRing, dispatch);
	useRing(svg, 5, ring, sequence[5], setRing, dispatch);
	useRing(svg, 6, ring, sequence[6], setRing, dispatch);
	useRing(svg, 7, ring, sequence[7], setRing, dispatch);
	useOuterRing(svg, step, sequence[0]);
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
