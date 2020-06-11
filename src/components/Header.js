import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    textDecoration: "none",
    color: "#fff",
  },
  drawer: {
    width: "240px",
  },
  menuTools: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  menuList: {
    marginTop: theme.spacing(4),
  },
}));

function Header({ history }) {
  const classes = useStyles();
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    let role = null;
    if (auth) {
      role = auth.user.role;
      setRole(role);
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [history.location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleMobileMenu}
          edge="start"
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          <Link to="/" className={classes.logo}>
            Toptal Apartments
          </Link>
        </Typography>
        <div className={classes.menuTools}>
          {isAuthenticated && (
            <React.Fragment>
              {(role === "admin" || role === "realtor") && (
                <Button color="inherit" component={Link} to="/apartments">
                  Manage Apartments
                </Button>
              )}
              {role === "admin" && (
                <Button color="inherit" component={Link} to="/users">
                  Manage Users
                </Button>
              )}
            </React.Fragment>
          )}
          {isAuthenticated ? (
            <Button color="inherit" component={Link} to="/logout">
              Log Out
            </Button>
          ) : (
            <React.Fragment>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </React.Fragment>
          )}
        </div>
      </Toolbar>

      <SwipeableDrawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        onOpen={toggleMobileMenu}
        classes={{
          paper: classes.drawer,
        }}
      >
        <List className={classes.menuList}>
          {isAuthenticated && (
            <React.Fragment>
              {(role === "admin" || role === "realtor") && (
                <ListItem
                  button
                  onClick={toggleMobileMenu}
                  component={Link}
                  to="/apartments"
                >
                  <ListItemText>Manage Apartments</ListItemText>
                </ListItem>
              )}
              {role === "admin" && (
                <ListItem
                  button
                  onClick={toggleMobileMenu}
                  component={Link}
                  to="/users"
                >
                  <ListItemText>Manage Users</ListItemText>
                </ListItem>
              )}
            </React.Fragment>
          )}
          {isAuthenticated ? (
            <ListItem
              button
              onClick={toggleMobileMenu}
              component={Link}
              to="/logout"
            >
              <ListItemText>Log Out</ListItemText>
            </ListItem>
          ) : (
            <React.Fragment>
              <ListItem
                button
                onClick={toggleMobileMenu}
                component={Link}
                to="/login"
              >
                <ListItemText>Login</ListItemText>
              </ListItem>
              <ListItem
                button
                onClick={toggleMobileMenu}
                component={Link}
                to="/register"
              >
                <ListItemText>Register</ListItemText>
              </ListItem>
            </React.Fragment>
          )}
        </List>
      </SwipeableDrawer>
    </AppBar>
  );
}

export default withRouter(Header);
