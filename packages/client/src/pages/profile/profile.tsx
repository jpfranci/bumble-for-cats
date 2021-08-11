import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { HOME_PAGE, OTHER_PROFILE_PAGE } from "../../common/links";
import { useRouteMatch } from "react-router";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Link as RouterLink } from "react-router-dom";
import { Button, Link } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import ProfilePostList from "../common/profile/profile-post-list";
import EditProfileDialog from "./edit-profile-dialog";
import userService from "../../services/users";
import CircularProgress from "@material-ui/core/CircularProgress";
import { LoaderContainer } from "../post/post";
import { initialState } from "../../redux/slices/user-slice";

const StyledTopContainer = styled.div`
  margin: 7.5vh 14vw;
`;

const StyledProfileContainer = styled.div`
  margin: 2vh 0;
  padding: 3vh;
  border: 2px solid #000;
  border-radius: 2rem;
  min-width: 220px;
`;

const StyledColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const StyledRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const EditButton = styled(Button)`
  margin-left: 1.5em;
`;

const StyledText = styled.text`
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 2rem;
`;

const StyledPostContainer = styled.div`
  min-width: 300;
`;

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [editProfileModalOpen, setEditProfileModalOpen] = React.useState(false);
  const [showCreatedPosts, setShowCreatedPosts] = useState(true);
  const [user, setUser] = useState(initialState);

  const userState = useAppSelector((state) => state.user);

  const match = useRouteMatch<{ id: string }>(OTHER_PROFILE_PAGE);
  useEffect(() => {
    if (match) {
      userService
        .getUserProfile(match.params.id)
        .then((user) => setUser(user))
        .catch((error) => console.error(error))
        .finally(() => setIsLoading(false));
    } else {
      setUser(userState);
    }
  }, []);

  const handleEditProfileModalOpen = () => {
    setEditProfileModalOpen((prevOpen) => !prevOpen);
  };

  const handleEditProfileModalClose = () => {
    setEditProfileModalOpen(false);
  };

  const handleClose = () => {
    setEditProfileModalOpen(false);
  };
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    showRecent: boolean,
  ) => {
    setShowCreatedPosts(showRecent);
  };

  const fieldColor = { color: "#595959" };

  return (
    <span>
      {user._id ? (
        <StyledTopContainer>
          <StyledProfileContainer>
            <StyledColumnContainer>
              <StyledRowContainer>
                <h1 style={fieldColor}>{user.username}'s profile</h1>
                {userState._id === user._id ? (
                  <span>
                    <EditButton
                      variant="outlined"
                      color="primary"
                      onClick={handleEditProfileModalOpen}>
                      Edit
                    </EditButton>
                    <EditProfileDialog
                      open={editProfileModalOpen}
                      onClose={handleEditProfileModalClose}
                      username={user.username}
                      email={user.email}
                    />
                  </span>
                ) : null}
              </StyledRowContainer>

              <StyledColumnContainer>
                <StyledText>Email Address</StyledText>
                <text style={fieldColor}>{user.email}</text>
              </StyledColumnContainer>

              <StyledColumnContainer>
                <StyledText>Username </StyledText>
                <text style={fieldColor}>{user.username}</text>
              </StyledColumnContainer>

              <StyledText>Reputation: 🔥 {user.reputation}</StyledText>
            </StyledColumnContainer>
          </StyledProfileContainer>

          <StyledColumnContainer>
            <text
              style={{ fontSize: "1.5rem", margin: "1.2rem 0", ...fieldColor }}>
              Posts
            </text>
            <ToggleButtonGroup
              size="large"
              aria-label="outlined primary button group"
              exclusive
              onChange={handleChange}>
              <ToggleButton
                value={true}
                color="primary"
                selected={showCreatedPosts}>
                Created
              </ToggleButton>
              <ToggleButton
                value={false}
                color="primary"
                selected={!showCreatedPosts}>
                Upvoted
              </ToggleButton>
            </ToggleButtonGroup>

            <StyledPostContainer>
              <ProfilePostList
                showCreatedPosts={showCreatedPosts}
                handleClose={handleClose}
                maxSize={10}
                user={user}
              />
            </StyledPostContainer>
          </StyledColumnContainer>

          <Link component={RouterLink} to={HOME_PAGE}>
            <Button variant="outlined" color="primary">
              Back to home page
            </Button>
          </Link>
        </StyledTopContainer>
      ) : isLoading ? (
        <LoaderContainer>
          <CircularProgress />
        </LoaderContainer>
      ) : (
        <div>The post you're looking for doesn't exist...</div>
      )}
    </span>
  );
};

export default ProfilePage;
