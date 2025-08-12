import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SystemState = {
    collapsed: boolean
    // partnerSearchParams: PartnerSearchParams
    isChangingCompany: boolean
    isMobile: boolean
    isOpenMenuMobile: boolean
}

const initialState: SystemState = {
    collapsed: false,
    isChangingCompany: false,
    isMobile: false,
    isOpenMenuMobile: false
}

export const systemSlice = createSlice({
    name: "systemState",
    initialState,
    reducers: {
        reset: () => initialState,
        setSidebarCollapse: (state, action: PayloadAction<Pick<SystemState, "collapsed">>) => {
            state.collapsed = action.payload.collapsed;
        },
        setIsMobile: (state, action: PayloadAction<Pick<SystemState, "isMobile">>) => {
            state.isMobile = action.payload.isMobile;
        },
        setIsOpenMenuMobile: (state, action: PayloadAction<Pick<SystemState, "isOpenMenuMobile">>) => {
            state.isOpenMenuMobile = action.payload.isOpenMenuMobile;
        },
        setIsChangingCompany: (state, action: PayloadAction<boolean>) => {
            state.isChangingCompany = action.payload
        }
    },
});

export const {
    setSidebarCollapse,
    reset,
    setIsChangingCompany,
    setIsMobile,
    setIsOpenMenuMobile
} = systemSlice.actions;
export default systemSlice.reducer;