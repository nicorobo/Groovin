const key = 'patterning';

export const loadState = () => {
	try {
		const serializedState = localStorage.getItem(key);
		if (!serializedState) return undefined;
		return JSON.parse(serializedState);
	} catch (err) {
		return undefined;
	}
};

export const saveState = (state) => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem(key, serializedState);
	} catch (err) {}
};
