import { createSlice } from "@reduxjs/toolkit";

export const companySlice = createSlice({
  name: "companySlice",
  initialState: { id: null, name: "", vatNumber: "", company: {}},
  reducers: {
    setCurrentCompany: (state, action) => {
      const { id, name, vatNumber, companyCode, type, owner } = action.payload;
      state.id = id;
      state.name = name;
      state.vatNumber = vatNumber;
      state.companyCode = companyCode;
      state.type = type;
      state.owner = owner;
      // Per compatibilità quando leggo i dati da customer e da qui:
      state.company = { id, name, vatNumber, companyCode, type, owner  }
    },
  },
});


// Export actions -----------------------------------------------------------------------------------------------------------------------------------------------------
export const {
  setCurrentCompany,
} = companySlice.actions;

// Export selectors -----------------------------------------------------------------------------------------------------------------------------------------------------
export const selectCurrentCompany = ({ company }) => company;
export const selectTenant_v2 = ({ company }) => company.id;

// Reducer export -----------------------------------------------------------------------------------------------------------------------------------------------------
export default companySlice.reducer;
