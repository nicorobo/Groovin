import { useEffect, useState, useRef, useMemo } from 'react';
import { select, pie, arc, mouse } from 'd3';
const width = 500;
const height = 500;

const getRadii = (index, activeIndex) => {
	const mainRadius = 250;
	const collapsedWidth = 10;
	const activeWidth = 120;
	const outer =
		mainRadius -
		(index * collapsedWidth + (activeIndex < index ? activeWidth - collapsedWidth : 0));
	const inner = outer - (activeIndex === index ? activeWidth : collapsedWidth);
	return [outer, inner];
};

const getDistance = (pointA, pointB) => {
	const a = pointA[0] - pointB[0];
	const b = pointA[1] - pointB[1];
	return Math.sqrt(a * a + b * b);
};

const getValue = (dist, inner, outer) => {
	if (dist <= inner) return 0;
	else if (dist >= outer) return 127;
	return Math.floor(((dist - inner) / (outer - inner)) * 127);
};

export const useRing = (node, index, activeIndex, data, track, dispatch) => {
	const arcs = useMemo(() => pie().value(1)(data), [data]);
	const contentRing = useRef(null);
	const outlineRing = useRef(null);
	const [edit, setEdit] = useState(false);
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

	const handleMousedown = (a, b) => {
		if (activeIndex === index) setEdit(true);
	};

	const handleMousemove = (e) => {
		const pos = mouse(node);
		const center = [width / 2, height / 2];
		const distance = getDistance(pos, center);
		const angle = Math.atan2(pos[0] - center[0], center[1] - pos[1]);
		const realAngle = angle > 0 ? angle : 2 * Math.PI + angle;
		const selected = arcs.find((a) => a.startAngle <= realAngle && realAngle <= a.endAngle);
		const value = getValue(distance, inner, outer);
		dispatch({ type: 'updateValue', track: index, step: selected.index, value });
	};

	const handleMouseup = (e) => {
		setEdit(false);
	};

	useEffect(() => {
		if (edit) {
			select('html').on('mousemove', handleMousemove);
			select('html').on('mouseup', handleMouseup);
		}
		return () => {
			select('html').on('mousemove', null);
			select('html').on('mouseup', null);
		};
	}, [edit]);

	useEffect(() => {
		if (node) {
			outlineRing.current = select(node)
				.append('g')
				.attr('transform', `translate(${width / 2},${height / 2})`)
				.on('click', () => dispatch({ type: 'selectTrack', track: index }));
			contentRing.current = select(node)
				.append('g')
				.attr('transform', `translate(${width / 2},${height / 2})`)
				.style('pointer-events', 'none');

			return () => {
				contentRing.current.remove();
				outlineRing.current.remove();
			};
		}
	}, [node]);

	useEffect(() => {
		if (node) {
			contentRing.current
				.selectAll('path')
				.data(arcs)
				.join('path')
				.attr('fill', (d) => track.color)
				.attr('d', getPathFromArc)
				.attr('stroke', '#333')
				.attr('stroke-width', 0.5);

			outlineRing.current
				.on('mousedown', handleMousedown)
				.selectAll('path')
				.data(arcs)
				.join('path')
				.attr('fill', '#fff')
				.style('cursor', () => (activeIndex === index ? 'crosshair' : 'pointer'))
				.attr('stroke', '#333')
				.attr('stroke-width', 0.5)
				.transition()
				.attr('duration', 500)
				.attr('d', getArc);
		}
	}, [node, activeIndex, data]);
};

export const useOuterRing = (node, step, isPlaying, data) => {
	const arcs = useMemo(() => pie().value(1)(data), []);
	const getArc = arc()
		.innerRadius(60)
		.outerRadius(250);
	useEffect(() => {
		if (node) {
			const f = select(node)
				.append('g')
				.attr('transform', `translate(${width / 2},${height / 2})`);
			f.selectAll('path')
				.data(arcs)
				.join('path')
				.attr('fill', (d, i) =>
					i === step && isPlaying ? 'rgba(255, 255, 255, .5)' : 'transparent'
				)
				.attr('d', getArc)
				// .attr('stroke', (d, i) => (i === step ? '#333' : 'none'))
				.style('pointer-events', 'none');
			return () => f.remove();
		}
	}, [node, step, isPlaying]);
};

export const useTransport = (node, isPlaying, setIsPlaying) => {
	useEffect(() => {
		if (node) {
			const f = select(node)
				.append('g')
				.attr('transform', `translate(${width / 2},${height / 2})`)
				.style('cursor', 'pointer')
				.attr('fill', '#555');
			if (isPlaying) {
				f.append('rect')
					.attr('x', -25)
					.attr('y', -25)
					.attr('width', 50)
					.attr('height', 50)
					.on('click', () => setIsPlaying(false));
			} else {
				f.append('polygon')
					.attr('points', '26.5 5 58 58 -5 58')
					.attr('transform', 'rotate(90.000000) translate(-26.500000, -40.500000)')
					.on('click', () => setIsPlaying(true));
			}
			return () => f.remove();
		}
	}, [node, isPlaying]);
};
