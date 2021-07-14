import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import postService from "../../services/posts";
import { Location } from "./location-slice";
import { UserState } from "./user-slice";

const prefix = "post";

type Comment = {
  _id: string;
  date: string;
  numUpVotes: number;
  numDownvotes: number;
  userId: string;
  username: string;
};

export interface Post extends NewPost {
  _id: string;
  numUpvotes: number;
  numDownvotes: number;
  date: string;
  comments: Comment[];
  username: string;
}

export type NewPost = {
  title: string;
  body: string;
  tag: string;
  location: Location;
  userId: string;
};

export enum PostSortType {
  POPULAR = "popular",
  NEW = "new",
}

export type PostState = {
  posts: Post[];
  sortType: PostSortType;
  locationFilter: Location;
  tagFilter?: string;
  currentPostID?: string;
};

const initialState: PostState = {
  posts: [],
  sortType: PostSortType.POPULAR,
  locationFilter: {
    name: "Vancouver",
    lat: 49.26,
    lon: -123.22,
  },
};

export const createPost = createAsyncThunk<Post, NewPost>(
  `${prefix}/createPost`,
  async (newPost, { rejectWithValue }) => {
    try {
      const response = await postService.create(newPost);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// TODO add some filter param after deciding how post fetching will work (getting all posts will suffice for now)
export const getPosts = createAsyncThunk<Post[]>(
  `${prefix}/getPosts`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await postService.getAll();

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getPostsByFilter = createAsyncThunk<Post[], PostState>(
  `${prefix}/getPostsByFilter`,
  async (postState: PostState, { rejectWithValue }) => {
    try {
      const response = await postService.getPostsByFilter(postState);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// TODO vote actions have race condition, should be updating on server
export const upvote = createAsyncThunk<
  Partial<Post> & { id: string },
  { post: Post; user: UserState }
>(`${prefix}/upvote`, async ({ post, user }, { rejectWithValue }) => {
  try {
    const response = await postService.update(post._id, {
      ...post,
      numUpvotes: post.numUpvotes + 1,
    });

    // TODO we should make one route each for upvoting/downvoting so we don't have to make redundant server calls
    // TODO do this logic when we implement auth
    // // update user
    // user.votedPosts[post.id] = { upvoted: true };
    // await userService.update(user.id as string, {
    //   ...user,
    // });

    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const downvote = createAsyncThunk<
  Partial<Post> & { id: string },
  { post: Post; user: UserState }
>(`${prefix}/downvote`, async ({ post, user }, { rejectWithValue }) => {
  try {
    const response = await postService.update(post._id, {
      ...post,
      numDownvotes: post.numDownvotes + 1,
    });

    // // update user
    // user.votedPosts[post.id] = { upvoted: true };
    // await userService.update(user.id as string, {
    //   ...user,
    // });

    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// TODO implement getPostByID action
// TODO implement comment action

export const postSlice = createSlice({
  name: prefix,
  initialState,
  reducers: {
    setSortType: (state, action: PayloadAction<PostSortType>) => {
      state.sortType = action.payload;
    },
    setLocationFilter: (state, action: PayloadAction<Location>) => {
      state.locationFilter = action.payload;
    },
    setTagFilter: (state, action: PayloadAction<string>) => {
      state.tagFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
    builder.addCase(getPosts.rejected, (state, action) => {
      return { ...initialState };
    });
    builder.addCase(getPostsByFilter.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
    builder.addCase(getPostsByFilter.rejected, (state, action) => {
      return { ...initialState };
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts.push(action.payload);
    });
    builder.addCase(upvote.fulfilled, (state, action) => {
      const postToUpdate = state.posts.find(
        (post) => post._id === action.payload.id,
      );

      if (postToUpdate && action.payload.numUpvotes) {
        postToUpdate.numUpvotes = action.payload.numUpvotes;
      }
    });
    builder.addCase(downvote.fulfilled, (state, action) => {
      const postToUpdate = state.posts.find(
        (post) => post._id === action.payload.id,
      );

      if (postToUpdate && action.payload.numDownvotes) {
        postToUpdate.numDownvotes = action.payload.numDownvotes;
      }
    });
  },
});

export const { setSortType, setLocationFilter, setTagFilter } =
  postSlice.actions;
export default postSlice.reducer;
