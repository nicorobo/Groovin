import React, { useEffect, useState, useRef } from 'react';
import { select, pie, arc, mouse, event } from 'd3';
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
const App = () => {
	return <Vis />;
};

const Vis = () => {
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

const getRadii = (index, activeIndex) => {
	const mainRadius = 250;
	const collapsedWidth = 15;
	const activeWidth = 140;
	const outer =
		mainRadius -
		(index * collapsedWidth + (activeIndex < index ? activeWidth - collapsedWidth : 0));
	const inner = outer - (activeIndex === index ? activeWidth : collapsedWidth);
	return [outer, inner];
};

const colors = ['#305f72', '#f1d1b5', '#f0b7a4', '#f18c8e'];

const useRing = (node, index, activeIndex, arcs, setActiveIndex) => {
	const contentRing = useRef(null);
	const outlineRing = useRef(null);
	const [outer, inner] = getRadii(index, activeIndex);
	const getArc = arc()
		.innerRadius(inner)
		.outerRadius(outer);
	const getPathFromArc = arc() // maybe memoize callback to outer/inner/activeIndex
		.innerRadius(inner)
		.outerRadius((d) =>
			index === activeIndex
				? inner + ((outer - inner) / 127) * d.data
				: d.data > 0
				? outer
				: inner
		);
	useEffect(() => {
		if (node) {
			contentRing.current = select(node)
				.append('g')
				.attr('transform', `translate(${width / 2},${height / 2})`);

			outlineRing.current = select(node)
				.append('g')
				.attr('transform', `translate(${width / 2},${height / 2})`)
				.on('click', () => setActiveIndex(index));
		}
	}, [node]);

	useEffect(() => {
		if (node) {
			contentRing.current
				.selectAll('path')
				.data(arcs)
				.join('path')
				.attr('fill', (d) => colors[index])
				.attr('d', getPathFromArc);

			outlineRing.current
				.selectAll('path')
				.data(arcs)
				.join('path')
				.attr('fill', 'transparent')
				.attr('stroke', '#eee')
				.attr('d', getArc);
		}
	}, [node, activeIndex, arcs]);
};

export default App;
