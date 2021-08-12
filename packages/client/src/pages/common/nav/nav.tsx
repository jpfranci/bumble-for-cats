import React, { Dispatch, SetStateAction, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  ButtonBase,
  Switch,
  Link,
} from "@material-ui/core";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import ProfileButton from "../profile/profile-button";
import CreateProfileDialog from "./create-profile-dialog";
import LoginDialog from "./login-dialog";
import { setShowMatureContent } from "../../../redux/slices/post-slice";
import { Link as RouterLink } from "react-router-dom";
import { HOME_PAGE } from "../../../common/links";
import styled from "styled-components";
import LogoSVG from "../../../static/Alpacow-logo.svg";

// Using mui theme for consistent spacing
const useStyles = makeStyles((theme: any) => ({
  root: {
    flexGrow: 1,
  },
  iconContainer: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: theme.spacing(2),
  },
}));

const profileOptions = (
  user: any,
  classes: any,
  setSignUpModalOpen: any,
  setLoginModalOpen: any,
) => {
  if (user._id) {
    return <ProfileButton username={user.username} />;
  } else {
    return (
      <div>
        <Button
          variant="outlined"
          color="inherit"
          className={classes.menuButton}
          onClick={() => setLoginModalOpen(true)}>
          Login
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          className={classes.menuButton}
          onClick={() => setSignUpModalOpen(true)}>
          Sign up
        </Button>
      </div>
    );
  }
};

const BrandName = styled.h6`
  & > a {
    color: black;
    text-decoration: none;
  }
`;

const NavBar = () => {
  const [signUpModalOpen, setSignUpModalOpen]: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] = useState<boolean>(false);

  const [loginModalOpen, setLoginModalOpen]: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] = useState<boolean>(false);

  const handleSignUpModalClose = () => {
    setSignUpModalOpen(false);
  };

  const handleLoginModalClose = () => {
    setLoginModalOpen(false);
  };

  const dispatch = useAppDispatch();

  const user = useAppSelector((state: any) => state.user);
  const isMature = useAppSelector((state: any) => state.post.showMatureContent);
  const classes = useStyles();

  const handleChange = () => {
    dispatch(setShowMatureContent(!isMature));
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <ButtonBase>
          <Typography variant="h6">
            <Link component={RouterLink} to={HOME_PAGE} color="inherit">
              Alpacow
            </Link>
          </Typography>
        </ButtonBase>
        <div className={classes.iconContainer}>
          <ButtonBase className={classes.menuButton}>
            <img src={LogoSVG} alt="official alpacow logo" height={45} />
          </ButtonBase>
        </div>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={isMature} onChange={handleChange} />}
            label="Show mature content"
          />
        </FormGroup>
        {profileOptions(user, classes, setSignUpModalOpen, setLoginModalOpen)}
        <LoginDialog open={loginModalOpen} onClose={handleLoginModalClose} />
        <CreateProfileDialog
          open={signUpModalOpen}
          onClose={handleSignUpModalClose}
        />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
