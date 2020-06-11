import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import UserForm from "./UserForm";
import { updateUser, fetchUser } from "../../services";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function UserEdit({ history }) {
  const classes = useStyles();
  const [user, setUser] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const fetched = await fetchUser(userId);
        setUser(fetched);
      } catch (e) {
        history.push("/users");
      }
    }

    fetchData();
  }, [history, userId]);

  const submitForm = async (formData) => {
    if (!user) {
      return;
    }
    try {
      await updateUser(userId, formData);
      history.push("/users");
    } catch (e) {
      setSubmitError(e.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Typography variant="h4">Update User</Typography>
      <CssBaseline />
      {user && (
        <UserForm
          user={user}
          submitButtonText="Update User"
          formError={submitError}
          handleSubmit={submitForm}
        />
      )}
    </Container>
  );
}
