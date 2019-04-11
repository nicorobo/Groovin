import { useEffect, useState, useRef } from 'react';
import { select, arc, mouse } from 'd3';
const width = 500;
const height = 500;

const colors = ['#305f72', '#f1d1b5', '#f0b7a4', '#f18c8e'];
const getRadii = (index, activeIndex) => {
	const mainRadius = 200;
	const collapsedWidth = 15;
	const activeWidth = 140;
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

const useRing = (node, index, activeIndex, arcs, setActiveIndex, dispatch) => {
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
		dispatch({ type: 'updateValue', ringIndex: index, stepIndex: selected.index, value });
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
			contentRing.current = select(node)
				.append('g')
				.attr('transform', `translate(${width / 2},${height / 2})`);

			outlineRing.current = select(node)
				.append('g')
				.attr('transform', `translate(${width / 2},${height / 2})`)
				.on('click', () => setActiveIndex(index))
				.on('mousedown', handleMousedown);
			return () => {
				contentRing.current.remove();
				outlineRing.current.remove();
			};
		}
	}, [node, activeIndex]);

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
				.attr('stroke', '#333')
				.attr('d', getArc);
		}
	}, [node, activeIndex, arcs]);
};

export default useRing;
