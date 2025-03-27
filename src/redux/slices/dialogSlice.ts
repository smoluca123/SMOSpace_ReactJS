import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type AuthDialogTypeString = 'verify-email';

interface DialogSliceType {
  authDialog: {
    isOpen: boolean;
    dialogType: AuthDialogTypeString;
  };
}
const initialState: DialogSliceType = {
  authDialog: { isOpen: false, dialogType: 'verify-email' },
};

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    setAuthDialogOpen: (
      state,
      action: {
        payload: {
          isOpen?: boolean;
          dialogType?: AuthDialogTypeString;
        };
      },
    ) => ({
      authDialog: {
        ...state.authDialog,
        isOpen: action.payload.isOpen ?? state.authDialog.isOpen,
        dialogType: action.payload.dialogType || state.authDialog.dialogType,
      },
    }),
  },
});

export const { reducer: dialogReducer } = dialogSlice;
export const { setAuthDialogOpen } = dialogSlice.actions;
export const selectDialog = (state: RootState) => state.dialog;
