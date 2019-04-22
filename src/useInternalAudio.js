import { useState, useEffect, useRef } from 'react';
const notes = { 36: 0, 37: 1, 38: 2, 39: 3, 40: 4, 41: 5, 42: 6, 43: 7 };
const samples = [
	require('./sounds/drum1.wav'),
	require('./sounds/drum2.wav'),
	require('./sounds/drum3.WAV'),
	require('./sounds/drum4.WAV'),
	require('./sounds/drum5.wav'),
	require('./sounds/drum6.wav'),
	require('./sounds/drum7.wav'),
	require('./sounds/drum8.wav'),
];

export const useInternalAudio = () => {
	const audio = useRef();
	const sounds = useRef([]);
	const nodes = useRef([]);
	useEffect(() => {
		audio.current = new (window.AudioContext || window.webkitAudioContext)();
		samples.forEach((s) => {
			fetch(s)
				.then((res) => res.arrayBuffer())
				.then((data) => audio.current.decodeAudioData(data))
				.then((buffer) => {
					sounds.current.push(buffer);
				});
		});
		nodes.current = samples.map((s) => {
			const gain = audio.current.createGain();
			gain.connect(audio.current.destination);
			return gain;
		});
	}, []);
	const noteOnInternal = (note, velocity) => {
		const bufferNode = audio.current.createBufferSource();
		bufferNode.buffer = sounds.current[notes[note]];
		const gainNode = nodes.current[notes[note]];
		// console.log((1 / 127) * velocity);
		gainNode.gain.value = (1 / 127) * velocity;
		bufferNode.connect(gainNode);
		// console.log(bufferNode);
		bufferNode.start();
	};
	const noteOffInternal = (note, velocity) => {
		return false;
	};

	return { noteOnInternal, noteOffInternal };
};
