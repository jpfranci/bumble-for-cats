import React, { Dispatch, SetStateAction, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  ButtonBase,
  Switch,
} from "@material-ui/core";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import ProfileButton from "./profile-button";
import CreateProfileDialog from "./create-profile-dialog";
import { setShowMatureContent } from "../../../redux/slices/post-slice";

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

const profileOptions = (user: any, classes: any, setModalOpen: any) => {
  if (user.id) {
    return <ProfileButton username={"mr_clean_mustache"} />;
  } else {
    return (
      <div>
        <Button
          variant="outlined"
          color="inherit"
          className={classes.menuButton}
          onClick={() => setModalOpen(true)}>
          Login
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          className={classes.menuButton}
          onClick={() => setModalOpen(true)}>
          Sign up
        </Button>
      </div>
    );
  }
};

const NavBar = () => {
  const [modalOpen, setModalOpen]: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] = useState<boolean>(false);
  const handleModalClose = () => {
    setModalOpen(false);
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
          <Typography variant="h6">Alpacow</Typography>
        </ButtonBase>
        <div className={classes.iconContainer}>
          <ButtonBase className={classes.menuButton}>
            <img
              src="./logo.png"
              alt="official alpacow logo"
              width={75}
              height={45}
            />
          </ButtonBase>
        </div>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={isMature}
                onChange={handleChange}
                name="checkedA"
              />
            }
            label="Show mature content"
          />
        </FormGroup>
        {profileOptions(user, classes, setModalOpen)}
        <CreateProfileDialog open={modalOpen} onClose={handleModalClose} />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
