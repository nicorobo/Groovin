import React, { useReducer } from 'react';
import styled from 'styled-components';
import { useMIDI, useMIDIConnectionManager } from '@react-midi/hooks';
import { MIDIConnectionManager } from '@react-midi/components';
import { reducer, initialState } from './reducer';
import TrackList from './TrackList';
import Sequencer from './Sequencer';
import Settings from './Settings';
if (process.env.NODE_ENV !== 'production') {
	const whyDidYouRender = require('@welldone-software/why-did-you-render');
	whyDidYouRender(React);
}

const App = () => {
	const [inputs, outputs, hasMIDI] = useMIDI();
	const [input, setInput] = useMIDIConnectionManager(inputs);
	const [output, setOutput] = useMIDIConnectionManager(outputs);
	const [sequencer, dispatch] = useReducer(reducer, initialState);
	const { activeTrack, soloed, tracks, tempo, useInternalAudio } = sequencer;
	return (
		<Container>
			{hasMIDI && (
				<MIDIConnectionManager
					input={input}
					inputs={inputs}
					onInputChange={setInput}
					output={output}
					outputs={outputs}
					onOutputChange={setOutput}
				/>
			)}
			<TrackList
				output={output}
				activeTrack={activeTrack}
				soloed={soloed}
				tracks={tracks}
				dispatch={dispatch}
			/>
			<Sequencer input={input} output={output} sequencer={sequencer} dispatch={dispatch} />
			<Settings
				tracks={tracks}
				tempo={tempo}
				useInternalAudio={useInternalAudio}
				dispatch={dispatch}
			/>
		</Container>
	);
};

const Container = styled.div`
	height: 100%;
	display: grid;
	grid-template-columns: 200px auto 200px;
	grid-template-rows: auto 40px;
	grid-template-areas: 'a b c' 'd d d';
`;
export default App;
