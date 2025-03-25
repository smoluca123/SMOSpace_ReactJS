import { IPostDataType } from '@/lib/types/interfaces';
import { RootState } from '@/redux/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PostState {
  newPosts: IPostDataType[];
  hasNewPost: boolean;
}

const initialState: PostState = {
  newPosts: [],
  hasNewPost: false,
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    addNewPosts: (state, action: PayloadAction<IPostDataType>) => {
      return {
        ...state,
        hasNewPost: true,
        newPosts: [action.payload, ...state.newPosts],
      };
    },
    resetHasNewPost: (state) => {
      return {
        ...state,
        hasNewPost: false,
      };
    },
    resetNewPosts: (state) => {
      return {
        ...state,
        newPosts: [],
      };
    },
  },
});

export const { addNewPosts, resetHasNewPost, resetNewPosts } = postSlice.actions;
export const { reducer: postReducer } = postSlice;
export const selectPost = (state: RootState) => state.post;
