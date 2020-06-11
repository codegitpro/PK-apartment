import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import FormHelperText from "@material-ui/core/FormHelperText";
import { makeStyles } from "@material-ui/core/styles";
import GeoCoderInput from "../geocoder/GeoCoderInput";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  select: {
    marginTop: theme.spacing(1),
  },
  selectLabel: {
    background: "#fff",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

function ApartmentForm({
  apartment,
  formError,
  submitButtonText = "Create Apartment",
  handleSubmit,
  history,
}) {
  const classes = useStyles();
  const [name, setName] = useState(apartment ? apartment.name : "");
  const [nameError, setNameError] = useState(null);
  const [description, setDescription] = useState(
    apartment ? apartment.description : ""
  );
  const [descriptionError, setDescriptionError] = useState(null);
  const [size, setSize] = useState(apartment ? apartment.size : "");
  const [sizeError, setSizeError] = useState(null);
  const [price, setPrice] = useState(apartment ? apartment.price : "");
  const [priceError, setPriceError] = useState(null);
  const [rooms, setRooms] = useState(apartment ? apartment.rooms : "");
  const [roomsError, setRoomsError] = useState(null);
  const [location, setLocation] = useState(
    apartment ? apartment.location : null
  );
  const [address, setAddress] = useState(apartment ? apartment.address : "");
  const [addressError, setAddressError] = useState(null);
  const validateForm = () => {
    let hasError = false;
    if (name.length === 0) {
      setNameError("Name is required");
      hasError = true;
    }

    if (description.length === 0) {
      setDescriptionError("Description is required");
      hasError = true;
    }

    if (size.length === 0) {
      setSizeError("Floor area size is required");
      hasError = true;
    } else if (isNaN(size)) {
      setSizeError("Floor area size is invalid");
      hasError = true;
    }

    if (price.length === 0) {
      setPriceError("Price per month is required");
      hasError = true;
    } else if (isNaN(price)) {
      setPriceError("Price per month is invalid");
      hasError = true;
    }

    if (rooms.length === 0) {
      setRoomsError("Number of rooms is required");
      hasError = true;
    } else if (!Number.isInteger(parseFloat(rooms))) {
      setRoomsError("Number of rooms must be integer");
      hasError = true;
    }

    if (!location) {
      setAddressError("Address is required");
      hasError = true;
    }

    return !hasError;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const formData = {
      name,
      description,
      size,
      price,
      rooms,
      location,
      address,
    };

    handleSubmit(formData);
  };

  const cancel = (e) => {
    e.preventDefault();
    history.push("/apartments");
  };

  return (
    <div className={classes.paper}>
      <form className={classes.form} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="off"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(null);
              }}
              error={!!nameError}
            />
            {nameError && <FormHelperText error>{nameError}</FormHelperText>}

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              autoComplete="off"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setDescriptionError(null);
              }}
              error={!!descriptionError}
            />
            {descriptionError && (
              <FormHelperText error>{descriptionError}</FormHelperText>
            )}

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="size"
              label="Floor area size"
              name="size"
              autoComplete="off"
              value={size}
              onChange={(e) => {
                setSize(e.target.value);
                setSizeError(null);
              }}
              error={!!sizeError}
            />
            {sizeError && <FormHelperText error>{sizeError}</FormHelperText>}

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="price"
              label="Price per month"
              name="price"
              autoComplete="off"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setPriceError(null);
              }}
              error={!!priceError}
            />
            {priceError && <FormHelperText error>{priceError}</FormHelperText>}

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="rooms"
              label="Number of rooms"
              name="rooms"
              autoComplete="off"
              value={rooms}
              onChange={(e) => {
                setRooms(e.target.value);
                setRoomsError(null);
              }}
              error={!!roomsError}
            />
            {roomsError && <FormHelperText error>{roomsError}</FormHelperText>}

            {formError && <FormHelperText error>{formError}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={6}>
            <GeoCoderInput
              hasError={!!addressError}
              address={apartment ? apartment.address : null}
              location={apartment ? apartment.location : null}
              onChange={(add, loc) => {
                setAddress(add);
                setLocation(loc);
                setAddressError(null);
              }}
            />
            {addressError && (
              <FormHelperText error>{addressError}</FormHelperText>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={submitForm}
            >
              {submitButtonText}
            </Button>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={cancel}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default withRouter(ApartmentForm);
