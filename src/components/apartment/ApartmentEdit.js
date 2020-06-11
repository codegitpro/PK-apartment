import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ApartmentForm from "./ApartmentForm";
import { updateApartment, fetchApartment } from "../../services";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function ApartmentEdit({ history }) {
  const classes = useStyles();
  const [apartment, setApartment] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const { apartmentId } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const fetched = await fetchApartment(apartmentId);
        setApartment(fetched);
      } catch (e) {
        history.push("/apartments");
      }
    }

    fetchData();
  }, [history, apartmentId]);

  const submitForm = async (formData) => {
    try {
      await updateApartment(apartmentId, formData);
      history.push("/apartments");
    } catch (e) {
      setSubmitError(e.message);
    }
  };

  return (
    <Container component="main" maxWidth="md" className={classes.container}>
      <Typography variant="h4">Update Apartment</Typography>
      <CssBaseline />
      {apartment && (
        <ApartmentForm
          apartment={apartment}
          submitButtonText="Update Apartment"
          formError={submitError}
          handleSubmit={submitForm}
        />
      )}
    </Container>
  );
}
