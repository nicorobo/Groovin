import { loadState, saveState } from './local-storage';

const colors = [
	['#305f72', '#f1d1b5', '#f0b7a4', '#f18c8e', '#305f72', '#f1d1b5', '#f0b7a4', '#f18c8e'],
	['#F18E8F', '#F0A89C', '#F1C4AD', '#E7D2BC', '#C6D5D6', '#ACD1F0', '#BDC4F1', '#CEB5F1'],
	['#113442', '#174B4E', '#1C615A', '#227865', '#288D72', '#32B184', '#35BA88', '#3585B5'],
	['#8260C2', '#7471BA', '#6780B2', '#5C8CAC', '#509AA5', '#44A69E', '#39B297', '#2EBF91'],
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
		{
			name: 'Drum 1',
			note: 36,
			channel: 10,
			type: 'drum',
			color: colors[3][0],
			muted: false,
			sample: './sounds/drum1.mp3',
		},
		{
			name: 'Drum 2',
			note: 37,
			channel: 10,
			type: 'drum',
			color: colors[3][1],
			muted: false,
			sample: './sounds/drum2.mp3',
		},
		{
			name: 'Drum 3',
			note: 38,
			channel: 10,
			type: 'drum',
			color: colors[3][2],
			muted: false,
			sample: './sounds/drum3.mp3',
		},
		{
			name: 'Drum 4',
			note: 39,
			channel: 10,
			type: 'drum',
			color: colors[3][3],
			muted: false,
			sample: './sounds/drum4.mp3',
		},
		{
			name: 'Drum 5',
			note: 40,
			channel: 10,
			type: 'drum',
			color: colors[3][4],
			muted: false,
			sample: './sounds/drum5.mp3',
		},
		{
			name: 'Drum 6',
			note: 41,
			channel: 10,
			type: 'drum',
			color: colors[3][5],
			muted: false,
			sample: './sounds/drum6.mp3',
		},
		{
			name: 'Drum 7',
			note: 42,
			channel: 10,
			type: 'drum',
			color: colors[3][6],
			muted: false,
			sample: './sounds/drum7.mp3',
		},
		{
			name: 'Drum 8',
			note: 43,
			channel: 10,
			type: 'drum',
			color: colors[3][7],
			muted: false,
			sample: './sounds/drum8.mp3',
		},
	],
	tempo: 110,
	activeTrack: 0,
	soloed: null,
	useInternalAudio: false,
	current: { index: 0, name: 'Loop 1', sequence: getInitialSequence(8, 16) },
	saved: [
		{ name: 'Loop 1', sequence: [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]] },
		{ name: 'Loop 2', sequence: [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]] },
	],
};

export const reducer = (state, action) => {
	let newState = state;
	let sequence = null;
	console.log('HEYEYEYE: ', action);
	switch (action.type) {
		case 'updateValue':
			const { track, step, value } = action;
			// If value isn't changing, don't rerender
			if (state.current.sequence[track][step] === value) return state;
			sequence = state.current.sequence.map((r, i) =>
				i === track ? r.map((s, i) => (i === step ? value : s)) : r
			);
			newState = { ...state, current: { ...state.current, sequence } };
			break;
		case 'clearAll':
			newState = {
				...state,
				current: { ...state.current, sequence: getInitialSequence(8, 16) },
			};
			break;
		case 'selectTrack':
			const { track: t } = action;
			// If value isn't changing, don't rerender
			if (state.activeTrack === t) return state;
			newState = { ...state, activeTrack: t };
			break;
		case 'clearTrack':
			sequence = state.current.sequence.map((t, i) =>
				i === action.track ? t.map((v) => 0) : t
			);
			newState = { ...state, current: { ...state.current, sequence } };
			break;
		case 'muteTrack':
			newState = {
				...state,
				tracks: state.tracks.map((t, i) =>
					i === action.track ? { ...t, muted: !t.muted } : t
				),
			};
			break;
		case 'soloTrack':
			newState = { ...state, soloed: action.track === state.soloed ? null : action.track };
			break;
		case 'toggleInternalAudio':
			newState = { ...state, useInternalAudio: !state.useInternalAudio };
			break;
		case 'setTempo':
			newState = { ...state, tempo: action.tempo };
			break;
		case 'setChannel':
			newState = {
				...state,
				tracks: state.tracks.map((t, i) =>
					i === action.track ? { ...t, channel: action.channel } : t
				),
			};
			break;
		case 'setValue':
			newState = {
				...state,
				tracks: state.tracks.map((t, i) =>
					i === action.track ? { ...t, note: action.value } : t
				),
			};
			break;
		case 'setType':
			newState = {
				...state,
				tracks: state.tracks.map((t, i) =>
					i === action.track ? { ...t, type: action.trackType } : t
				),
			};
			break;
		default:
			break;
	}
	saveState(newState);
	return newState;
};
