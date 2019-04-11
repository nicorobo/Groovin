import React from 'react';
import { useMIDI, useMIDIConnectionManager } from '@react-midi/hooks';
import { MIDIConnectionManager } from '@react-midi/components';
import Sequencer from './Sequencer';

const App = () => {
	const [inputs, outputs] = useMIDI();
	const [input, setInput] = useMIDIConnectionManager(inputs);
	const [output, setOutput] = useMIDIConnectionManager(outputs);

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
			{input && <Sequencer input={input} output={output} />}
		</div>
	);
};

export default App;
