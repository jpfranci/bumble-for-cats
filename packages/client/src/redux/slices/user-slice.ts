import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import userService, {
  LoginCredentials,
  SignupInfo,
} from "../../services/users";
import { createPost, downvote, Post, upvote } from "./post-slice";

const prefix = "user";

export type UserState = {
  _id?: string; // if id doesn't exist, user is not logged in
  username?: string;
  email?: string;
  reputation?: number;
  // password?: string (shouldn't be stored on client)
  posts: Post[];
  votedPosts: { [id: string]: { upvoted: boolean } }; // TODO idk if this is best way to do it
};

const initialState: UserState = {
  _id: undefined,
  username: undefined,
  email: undefined,
  posts: [],
  votedPosts: {},
};

export const signup = createAsyncThunk<UserState, SignupInfo>(
  `${prefix}/signup`,
  async (signupInfo: SignupInfo, { rejectWithValue }) => {
    try {
      return await userService.signup(signupInfo);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const login = createAsyncThunk<UserState, LoginCredentials>(
  `${prefix}/login`,
  async (loginCredentials, { rejectWithValue }) => {
    try {
      return await userService.login(loginCredentials);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// TODO implement getPosts action
// TODO implement update action
// TODO implement logout action

export const userSlice = createSlice({
  name: prefix,
  initialState,
  reducers: {
    logout: (state) => {
      return { ...initialState };
    },
    setUser: (state, action: PayloadAction<UserState>) => {
      state._id = action.payload._id;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signup.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    });
    builder.addCase(signup.rejected, (state, action) => {
      return { ...state };
    });
    builder.addCase(login.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    });
    builder.addCase(login.rejected, (state, action) => {
      return { ...state };
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts.push(action.payload);
    });
    builder.addCase(upvote.fulfilled, (state, action) => {
      state.votedPosts[action.payload.id] = {
        upvoted: true,
      };
    });
    builder.addCase(downvote.fulfilled, (state, action) => {
      state.votedPosts[action.payload.id] = {
        upvoted: false,
      };
    });
  },
});

export const { logout, setUser } = userSlice.actions;

export default userSlice.reducer;
