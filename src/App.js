import React, { useReducer } from 'react';
import { useMIDI, useMIDIConnectionManager } from '@react-midi/hooks';
import { MIDIConnectionManager } from '@react-midi/components';
import { reducer, initialState } from './reducer';
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
			{output && <RingList output={output} />}
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

const RingList = ({ output }) => {
	return <div>bob</div>;
};

export default App;
