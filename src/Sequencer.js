import React, { useState } from 'react';
import { pie } from 'd3';
import useRing from './useRing';
const width = 500;
const height = 500;
const getInitialSequence = (layers, steps) => {
	const sequence = [];
	for (var i = 0; i < layers; i++) {
		const layer = [];
		for (var j = 0; j < steps; j++) {
			const num = Math.floor(Math.random() * 127);
			layer.push(num > 50 ? num : 0);
		}
		sequence.push(layer);
	}
	return sequence;
};

const initialSequence = getInitialSequence(4, 16);

const Sequencer = () => {
	const getArcs = pie().value(1);
	const [svg, setSvg] = useState(null);
	const [ring, setRing] = useState(0);
	const [sequence, setSequence] = useState(initialSequence);
	useRing(svg, 0, ring, getArcs(sequence[0]), setRing);
	useRing(svg, 1, ring, getArcs(sequence[1]), setRing);
	useRing(svg, 2, ring, getArcs(sequence[2]), setRing);
	useRing(svg, 3, ring, getArcs(sequence[3]), setRing);
	return <svg ref={setSvg} height={height} width={width} />;
};

export default Sequencer;
