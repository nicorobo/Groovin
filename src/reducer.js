import { loadState, saveState } from './local-storage';

const colors = [
	['#305f72', '#f1d1b5', '#f0b7a4', '#f18c8e', '#305f72', '#f1d1b5', '#f0b7a4', '#f18c8e'],
	['#F18E8F', '#F0A89C', '#F1C4AD', '#E7D2BC', '#C6D5D6', '#ACD1F0', '#BDC4F1', '#CEB5F1'],
	['#D4322E', '#F26E4A', '#FBAD68', '#FDDF95', '#E6F49D', '#ACDCA6', '#6AC1A5', '#3585B5'],
	['#D4322E', '#F26E4A', '#FBAD68', '#FDDF95', '#E0F3F8', '#ACD1F0', '#76ADCF', '#4470AA'],
	['#8260C2', '#7471BA', '#6780B2', '#5C8CAC', '#509AA5', '#44A69E', '#39B297', '#2EBF91'],
	['#113442', '#174B4E', '#1C615A', '#227865', '#288D72', '#32B184', '#35BA88', '#3585B5'],
];

const getInitialSequence = (layers, steps) => {
	const sequence = [];
	for (var i = 0; i < layers; i++) {
		const layer = [];
		for (var j = 0; j < steps; j++) {
			layer.push(0);
		}
		sequence.push(layer);
	}
	return sequence;
};

export const initialState = loadState() || {
	tracks: [
		{ name: 'Drum 1', note: 36, channel: 10, color: colors[0][0] },
		{ name: 'Drum 2', note: 37, channel: 10, color: colors[0][1] },
		{ name: 'Drum 3', note: 38, channel: 10, color: colors[0][2] },
		{ name: 'Drum 4', note: 39, channel: 10, color: colors[0][3] },
		{ name: 'Drum 5', note: 40, channel: 10, color: colors[0][4] },
		{ name: 'Drum 6', note: 41, channel: 10, color: colors[0][5] },
		{ name: 'Drum 7', note: 42, channel: 10, color: colors[0][6] },
		{ name: 'Drum 8', note: 43, channel: 10, color: colors[0][7] },
	],
	ring: 0,
	current: { index: 0, name: 'Loop 1', sequence: getInitialSequence(8, 16) },
	saved: [
		{ name: 'Loop 1', sequence: [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]] },
		{ name: 'Loop 2', sequence: [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]] },
	],
};

export const reducer = (state, action) => {
	let newState = state;
	let sequence = null;
	switch (action.type) {
		case 'updateValue':
			const { ringIndex, stepIndex, value } = action;
			// If value isn't changing, don't rerender
			if (state.current.sequence[ringIndex][stepIndex] === value) return state;
			sequence = state.current.sequence.map((r, i) =>
				i === ringIndex ? r.map((s, i) => (i === stepIndex ? value : s)) : r
			);
			newState = { ...state, current: { ...state.current, sequence } };
			break;
		case 'selectRing':
			const { ring } = action;
			// If value isn't changing, don't rerender
			if (state.ring === ring) return state;
			newState = { ...state, ring };
			break;
		case 'clearTrack':
			sequence = state.current.sequence.map((t, i) =>
				i === action.ring ? t.map((v) => 0) : t
			);
			newState = { ...state, current: { ...state.current, sequence } };
			break;
		default:
			break;
	}
	saveState(newState);
	return newState;
};
