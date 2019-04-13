import React, { useReducer } from 'react';
import { useMIDI, useMIDIConnectionManager } from '@react-midi/hooks';
import { MIDIConnectionManager } from '@react-midi/components';
import { reducer, initialState } from './reducer';
import TrackList from './TrackList';
import Sequencer from './Sequencer';

const App = () => {
	const [inputs, outputs] = useMIDI();
	const [input, setInput] = useMIDIConnectionManager(inputs);
	const [output, setOutput] = useMIDIConnectionManager(outputs);
	const [sequencer, dispatch] = useReducer(reducer, initialState);
	return (
		<div>
			<MIDIConnectionManager
				input={input}
				inputs={inputs}
				onInputChange={setInput}
				output={output}
				outputs={outputs}
				onOutputChange={setOutput}
			/>
			{output && <TrackList output={output} tracks={sequencer.tracks} dispatch={dispatch} />}
			{input && (
				<Sequencer
					input={input}
					output={output}
					sequencer={sequencer}
					dispatch={dispatch}
				/>
			)}
		</div>
	);
};

export default App;
