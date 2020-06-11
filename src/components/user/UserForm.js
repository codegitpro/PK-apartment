import React, { useState } from "react";
import { withRouter } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import { validateEmail } from "../../utils/validation";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: '100%'
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

function UserForm({ user, formError, submitButtonText='Create User', handleSubmit, history }) {
  const classes = useStyles();
  const [name, setName] = useState(user ? user.name : "");
  const [nameError, setNameError] = useState(null);
  const [email, setEmail] = useState(user ? user.email : "");
  const [emailError, setEmailError] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [role, setRole] = useState(user ? user.role : "client");

  const validateForm = () => {
    let hasError = false;
    if (name.length === 0) {
      setNameError("Name is required");
      hasError = true;
    }
    if (email.length === 0) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("Email is invalid");
      hasError = true;
    }
    if (user === null && password.length === 0) {
      setPasswordError("Password is required");
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
      email,
      role
    };
    if (password.length > 0) {
      formData['password'] = password;
    }
    
    handleSubmit(formData);
  };

  const cancel = (e) => {
    e.preventDefault();
    history.push("/users");
  };

  return (
    <div className={classes.paper}>
      <form className={classes.form} noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Full Name"
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
          id="email"
          label="Email Address"
          name="email"
          autoComplete="off"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(null);
          }}
          error={!!emailError}
        />

        {emailError && <FormHelperText error>{emailError}</FormHelperText>}

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="off"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(null);
          }}
          error={!!passwordError}
        />
        {passwordError && (
          <FormHelperText error>{passwordError}</FormHelperText>
        )}

        <FormControl variant="outlined" fullWidth className={classes.select}>
          <InputLabel
            id="demo-simple-select-filled-label"
            className={classes.selectLabel}
          >
            Role
          </InputLabel>
          <Select
            id="role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
            }}
          >
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="realtor">Realtor</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>

        {formError && <FormHelperText error>{formError}</FormHelperText>}

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
      </form>
    </div>
  );
}

export default withRouter(UserForm);