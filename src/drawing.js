import { useEffect, useState, useRef, useMemo } from 'react';
import { select, pie, arc, mouse } from 'd3';
import Tone from 'tone';
const width = 520;
const height = 520;

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
	const contentRing = useRef(null);
	const outlineRing = useRef(null);
	const [edit, setEdit] = useState(false);
	const [stepData, setStepData] = useState(0);
	const [stepIndex, setStepIndex] = useState(null);
	const d = edit ? data.map((d, i) => (i === stepIndex ? stepData : d)) : data;
	const arcs = useMemo(() => pie().value(1)(d), [d]);
	const [outer, inner] = useMemo(() => getRadii(index, activeIndex), [index, activeIndex]);
	// Maybe move the event handlers to their appropriate effects so the function isn't created every time
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
		if (stepIndex === null || stepIndex !== selected.index) {
			if (stepIndex !== null) {
				dispatch({ type: 'updateValue', track: index, step: stepIndex, value: stepData });
			}
			setStepIndex(selected.index);
		}
		setStepData(value);
	};

	const handleMouseup = (e) => {
		setEdit(false);
		setStepIndex(null);
		dispatch({ type: 'updateValue', track: index, step: stepIndex, value: stepData });
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
	}, [edit, stepIndex, d]);

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
			const getArc = arc()
				.innerRadius(inner)
				.outerRadius(outer);
			const getPathFromArc = arc()
				.innerRadius(inner)
				.outerRadius((d) =>
					index === activeIndex
						? inner + ((outer - inner) / 127) * d.data
						: d.data > 0
						? outer
						: inner
				);
			contentRing.current
				.selectAll('path')
				.data(arcs)
				.join('path')
				.attr('fill', (d) => track.color)
				.attr('d', getPathFromArc)
				.attr('stroke', '#eee')
				.attr('stroke-width', 1);

			outlineRing.current
				.on('mousedown', handleMousedown)
				.selectAll('path')
				.data(arcs)
				.join('path')
				.attr('fill', '#fff')
				.style('cursor', () => (activeIndex === index ? 'crosshair' : 'pointer'))
				.attr('stroke', '#eee')
				.attr('stroke-width', 1)
				.transition()
				.attr('duration', 500)
				.attr('d', getArc);
		}
	}, [node, activeIndex, d]);
};

export const useStepMarker = (node, step, isPlaying, data, color) => {
	const arcs = useMemo(() => pie().value(1)(data), []);
	const getArc = arc()
		.innerRadius(256)
		.outerRadius(260);
	useEffect(() => {
		if (node) {
			const f = select(node)
				.append('g')
				.attr('transform', `translate(${width / 2},${height / 2})`);
			f.selectAll('path')
				.data(arcs)
				.join('path')
				.attr('fill', (d, i) => (i === step && isPlaying ? color : 'transparent'))
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
					.on('click', () => {
						Tone.context.resume();
						setIsPlaying(true);
					});
			}
			return () => f.remove();
		}
	}, [node, isPlaying]);
};
