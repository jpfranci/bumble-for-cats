import React, { useEffect } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import PostListItem from "./post-list-item";
import { getPostsByFilter } from "../../../redux/slices/post-slice";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 0 10vw;
`;

// TODO rename file to component name?
const PostList: React.FC = () => {
  const dispatch = useAppDispatch();

  const posts = useAppSelector((state) => {
    return state.post.posts;
  });

  const postState = useAppSelector((state) => state.post);

  const location = useAppSelector((state) => state.post.locationFilter);
  const sortType = useAppSelector((state) => state.post.sortType);
  const tagFilter = useAppSelector((state) => state.post.tagFilter);

  useEffect(() => {
    dispatch(getPostsByFilter(postState));
  }, [location, sortType, tagFilter]);

  return (
    <StyledContainer>
      {posts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </StyledContainer>
  );
};

export default PostList;
