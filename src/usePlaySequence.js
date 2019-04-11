import { useState, useEffect } from 'react';
import { useMIDIClock, useMIDIOutput, useInternalMIDIClock } from '@react-midi/hooks';

const notes = [36, 37, 38, 39];

const usePlaySequence = (input, output, sequence, tempo = 115) => {
	const { noteOn, noteOff } = useMIDIOutput(output);
	const [step, isPlaying, setIsPlaying, setTempo] = useTwoWayClock(input, output, 6, tempo);
	const currentStep = step % sequence[0].length;
	const notesOff = (step) => {
		sequence.forEach((ring, i) => {
			const val = ring[step];
			if (val <= 0) return false;
			noteOff(notes[i], val, 10);
		});
	};
	const notesOn = (step) => {
		sequence.forEach((ring, i) => {
			const val = ring[step];
			if (val <= 0) return false;
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
