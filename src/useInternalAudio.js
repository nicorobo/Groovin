import { useState, useEffect, useRef } from 'react';
import { useMIDIOutput } from '@react-midi/hooks';
const notes = { 36: 0, 37: 1, 38: 2, 39: 3, 40: 4, 41: 5, 42: 6, 43: 7 };
const samples = [
	require('./sounds/drum1.wav'),
	require('./sounds/drum2.wav'),
	require('./sounds/drum3.wav'),
	require('./sounds/drum4.wav'),
	require('./sounds/drum5.wav'),
	require('./sounds/drum6.wav'),
	require('./sounds/drum7.wav'),
	require('./sounds/drum8.wav'),
];

export const useInternalAudio = (output, useInternalAudio) => {
	const { noteOn, noteOff } = useMIDIOutput(output);
	const audio = useRef();
	const sounds = useRef([]);
	const nodes = useRef([]);
	useEffect(() => {
		audio.current = new (window.AudioContext || window.webkitAudioContext)();
		samples.forEach((s, i) => {
			fetch(s)
				.then((res) => res.arrayBuffer())
				.then((data) => audio.current.decodeAudioData(data))
				.then((buffer) => {
					sounds.current[i] = buffer; // Need to be explicit about order because fetch is async
				});
		});
		nodes.current = samples.map((s) => {
			const gain = audio.current.createGain();
			gain.connect(audio.current.destination);
			return gain;
		});
	}, []);
	const noteOnInternal = (note, velocity, channel) => {
		if (noteOn) noteOn(note, velocity, channel);
		if (!useInternalAudio) return false;
		const bufferNode = audio.current.createBufferSource();
		bufferNode.buffer = sounds.current[notes[note]];
		const gainNode = nodes.current[notes[note]];
		gainNode.gain.value = (1 / 127) * velocity;
		bufferNode.connect(gainNode);
		bufferNode.start();
	};
	const noteOffInternal = (note, velocity, channel) => {
		if (noteOff) noteOff(note, velocity, channel);
		return false;
	};

	return { noteOn: noteOnInternal, noteOff: noteOffInternal };
};
