import { useState, useEffect, useRef } from 'react';
import { useMIDIClock, useInternalMIDIClock } from '@react-midi/hooks';
import { useInternalAudio } from './useInternalAudio';

const usePlaySequence = (input, output, sequencer) => {
	const { tracks, tempo, current, soloed } = sequencer;
	const sequence = current.sequence;
	const { noteOn, noteOff } = useInternalAudio(output, sequencer.useInternalAudio);
	const [step, isPlaying, setIsPlaying, setTempo] = useTwoWayClock(input, output, 6, tempo);
	const currentStep = step % sequence[0].length;
	const notesOff = (step) => {
		sequence.forEach((track, i) => {
			const val = track[step];
			if (val <= 0) return false;
			noteOff(tracks[i].note, val, tracks[i].channel);
		});
	};
	const notesOn = (step) => {
		sequence.forEach((track, i) => {
			const val = track[step];
			const isSoloed = i === soloed;

			if (val <= 0 || (tracks[i].muted && !isSoloed) || (soloed !== null && !isSoloed))
				return false;
			noteOn(tracks[i].note, val, tracks[i].channel);
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
	useEffect(() => {
		setTempo(tempo);
	}, [tempo]);
	return clock;
};

export default usePlaySequence;
