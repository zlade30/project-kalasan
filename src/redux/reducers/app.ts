import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type InitialStateProps = {
    showAddTree: boolean;
    trees: TreeProps[];
    showAddTreeInfo: boolean;
    selectedPosition: google.maps.LatLng | google.maps.LatLngLiteral;
    selectedBarangay: string;
    selectedTree: TreeProps | undefined;
    areas: AreaProps[];
    reportData: ReportProps | undefined;
    currentAccount: { username: string, password: string } | undefined
};

const initialState: InitialStateProps = {
    showAddTree: false,
    showAddTreeInfo: false,
    trees: [],
    selectedPosition: { lat: 0, lng: 0 },
    selectedBarangay: '',
    selectedTree: undefined,
    areas: [],
    reportData: undefined,
    currentAccount: undefined
};

export const slice = createSlice({
    initialState,
    name: 'app',
    reducers: {
        setShowAddTree: (state, action: PayloadAction<boolean>) => {
            state.showAddTree = action.payload
        },
        setShowAddTreeInfo: (state, action: PayloadAction<boolean>) => {
            state.showAddTreeInfo = action.payload
        },
        setTrees: (state, action: PayloadAction<TreeProps[]>) => {
            state.trees = action.payload
        },
        setSelectedPosition: (state, action: PayloadAction<google.maps.LatLng | google.maps.LatLngLiteral>) => {
            state.selectedPosition = action.payload
        },
        setSelectedBarangay: (state, action: PayloadAction<string>) => {
            state.selectedBarangay = action.payload
        },
        setSelectedTree: (state, action: PayloadAction<TreeProps | undefined>) => {
            state.selectedTree = action.payload
        },
        createTree: (state, action: PayloadAction<TreeProps>) => {
            state.trees = [action.payload, ...state.trees]
        },
        removeTree: (state, action: PayloadAction<string>) => {
            state.trees = state.trees.filter((item) => item.id !== action.payload);
        },
        updateTree: (state, action: PayloadAction<TreeProps>) => {
            state.trees = state.trees.map((item) => item.id === action.payload.id ? { ...action.payload } : item)
        },
        setAreas: (state, action: PayloadAction<AreaProps[]>) => {
            state.areas = action.payload
        },
        createArea: (state, action: PayloadAction<AreaProps>) => {
            state.areas = [action.payload, ...state.areas]
        },
        removeArea: (state, action: PayloadAction<string>) => {
            state.areas = state.areas.filter((item) => item.id !== action.payload);
        },
        updateArea: (state, action: PayloadAction<AreaProps>) => {
            state.areas = state.areas.map((item) => item.id === action.payload.id ? { ...action.payload } : item)
        },
        setReportData: (state, action: PayloadAction<ReportProps>) => {
            state.reportData = action.payload
        },
        setCurrentAcount: (state, action: PayloadAction<AccountProps | undefined>) => {
            state.currentAccount = action.payload
        }
    }
});

export const {
    setShowAddTree,
    setShowAddTreeInfo,
    setTrees,
    setSelectedBarangay,
    setSelectedPosition,
    setSelectedTree,
    createTree,
    removeTree,
    updateTree,
    createArea,
    removeArea,
    setAreas,
    updateArea,
    setReportData,
    setCurrentAcount
} = slice.actions;

export default slice.reducer;
