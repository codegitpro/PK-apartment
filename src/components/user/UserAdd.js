import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import UserForm from './UserForm';
import { createUser } from "../../services";


const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }
}));

export default function UserAdd({ history }) {
  const classes = useStyles();
  const [submitError, setSubmitError] = useState(null);

  const submitForm = async (formData) => {
    try {
      await createUser(formData);
      history.push("/users");
    } catch (e) {
      setSubmitError(e.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Typography variant="h4">Create User</Typography>
      <CssBaseline />
      <UserForm
        submitButtonText="Create User"
        formError={submitError}
        handleSubmit={submitForm}
      />
    </Container>
  );
}
