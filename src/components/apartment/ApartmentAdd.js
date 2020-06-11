import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ApartmentForm from './ApartmentForm';
import { createApartment } from "../../services";


const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }
}));

export default function ApartmentAdd({ history }) {
  const classes = useStyles();
  const [submitError, setSubmitError] = useState(null);

  const submitForm = async (formData) => {
    try {
      await createApartment(formData);
      history.push("/apartments");
    } catch (e) {
      setSubmitError(e.message);
    }
  };

  return (
    <Container component="main" maxWidth="md" className={classes.container}>
      <Typography variant="h4">Create Apartment</Typography>
      <CssBaseline />
      <ApartmentForm
        submitButtonText="Create Apartment"
        formError={submitError}
        handleSubmit={submitForm}
      />
    </Container>
  );
}
