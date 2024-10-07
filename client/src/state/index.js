import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: 'dark',
    userId: "63701cc1f03239b7f700000e",
};

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === 'light' ? "dark" : 'light';
        },
    },
});

// Export the action creator(s)
export const { setMode } = globalSlice.actions;

// Export the reducer as the default export
export default globalSlice.reducer;
