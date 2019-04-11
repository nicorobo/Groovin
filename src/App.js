import React, { useEffect, useState, useRef } from 'react';
import { select, pie, arc, mouse, event } from 'd3';
const width = 500;
const height = 500;
const getInitialSequence = (layers, steps) => {
	const sequence = [];
	for (var i = 0; i < layers; i++) {
		const layer = [];
		for (var j = 0; j < steps; j++) {
			layer.push(Math.floor(Math.random() * 127));
		}
		sequence.push(layer);
	}
	return sequence;
};

const initialSequence = getInitialSequence(4, 16);

const App = () => {
	return <Vis />;
};

const Vis = () => {
	const [ref, setRef] = useState(null);
	const [sequence, setSequence] = useState(initialSequence);
	useRing(ref, 100, 250, sequence[0]);
	return <svg ref={setRef} height={height} width={width} />;
};

const useRing = (node, inner, outer, data) => {
	const arcs = pie().value(1)(data);
	const getArc = arc()
		.innerRadius(inner)
		.outerRadius(outer);
	const handleClick = (a, b, c) => {
		console.log(event);
	};
	useEffect(() => {
		if (node) {
			const g2 = select(node)
				.append('g')
				.attr('transform', `translate(${width / 2},${height / 2})`);
			g2.selectAll('path')
				.data(arcs)
				.enter()
				.append('path')
				.attr('fill', 'blue')
				.attr('d', (d) => {
					const getA = arc()
						.innerRadius(inner)
						.outerRadius(inner + ((outer - inner) / 127) * d.data);
					return getA(d);
				});
			const g = select(node)
				.append('g')
				.attr('transform', `translate(${width / 2},${height / 2})`);
			g.selectAll('path')
				.data(arcs)
				.enter()
				.append('path')
				.attr('fill', 'transparent')
				.attr('stroke', '#eee')
				.attr('d', getArc)
				.on('click', handleClick);
		}
	}, [node, data]);
};

export default App;
