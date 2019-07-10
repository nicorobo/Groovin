import { useState, useEffect, useRef } from 'react';
import { useMIDIClock, useInternalMIDIClock } from '@react-midi/hooks';
import { useInternalAudio } from './useInternalAudio';
const notes = [36, 37, 38, 39, 40, 41, 42, 43];

const usePlaySequence = (input, output, sequencer, tempo = 115) => {
	const { tracks, current, soloed } = sequencer;
	const sequence = current.sequence;
	const { noteOn, noteOff } = useInternalAudio(output);
	const [step, isPlaying, setIsPlaying, setTempo] = useTwoWayClock(input, output, 6, tempo);
	const currentStep = step % sequence[0].length;
	const notesOff = (step) => {
		sequence.forEach((track, i) => {
			const val = track[step];
			if (val <= 0) return false;
			noteOff(notes[i], val, 10);
		});
	};
	const notesOn = (step) => {
		sequence.forEach((track, i) => {
			const val = track[step];
			if (val <= 0 || tracks[i].muted) return false;
			noteOn(notes[i], val, 10);
		});
	};
	useEffect(() => {
		if (isPlaying) notesOn(currentStep);
		return () => notesOff(currentStep);
	}, [step, isPlaying]);
	return [currentStep, isPlaying, setIsPlaying, setTempo];
};

const useTwoWayClock = (input, output, division, tempo) => {
	const [clock, setClock] = useState([0, false, null, null]);
	const [step, isPlaying] = useMIDIClock(input, division);
	const [stepI, isPlayingI, setIsPlaying, setTempo] = useInternalMIDIClock(
		output,
		division,
		tempo
	);
	// This bit is complicated, maybe overly so
	useEffect(() => {
		if (isPlaying && !isPlayingI && step !== clock.step) setClock([step, isPlaying]);
		else if (stepI !== clock.step) setClock([stepI, isPlayingI, setIsPlaying, setTempo]);
	}, [isPlaying, isPlayingI, step, stepI]);
	return clock;
};

export default usePlaySequence;
