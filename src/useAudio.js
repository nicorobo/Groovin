import { useEffect, useRef } from 'react';
import { useMIDIOutput } from '@react-midi/hooks';
import Tone from 'tone';
const notes = { 36: 0, 37: 1, 38: 2, 39: 3, 40: 4, 41: 5, 42: 6, 43: 7 };

export const useAudio = (output, sequencer) => {
	const { tracks, useInternalAudio } = sequencer;
	const { noteOn, noteOff } = useMIDIOutput(output);
	const instruments = useRef([]);
	useEffect(() => {
		instruments.current = tracks.map((t) => new Tone.Player(t.sample).toMaster());
	}, []);
	const noteOnInternal = (note, velocity, channel) => {
		if (noteOn) noteOn(note, velocity, channel);
		if (!useInternalAudio) return false;
		const db = Tone.gainToDb((1 / 127) * velocity);
		instruments.current[notes[note]].volume.value = db;
		instruments.current[notes[note]].start();
	};
	const noteOffInternal = (note, velocity, channel) => {
		if (noteOff) noteOff(note, velocity, channel);
		return false;
	};

	return { noteOn: noteOnInternal, noteOff: noteOffInternal };
};
