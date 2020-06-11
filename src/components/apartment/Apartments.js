import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import EditIcon from "@material-ui/icons/Edit";
import moment from "moment-timezone";
import { fetchApartments, deleteApartment } from "../../services";
import { Toolbar } from "@material-ui/core";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  container: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function Apartments() {
  const classes = useStyles();
  const [apartments, setApartments] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  async function fetchData() {
    try {
      const data = await fetchApartments();
      setApartments(data);
    } catch (e) {
      setFetchError(e.message);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const onDelete = async (apartmentId) => {
    if (window.confirm("Are you sure you want to delete this apartment?")) {
      try {
        await deleteApartment(apartmentId);
        fetchData();
      } catch (e) {}
    }
  };

  return (
    <Container component="main" maxWidth="xl" className={classes.container}>
      <Typography variant="h4">Manage Apartments</Typography>
      <TableContainer component={Paper}>
        <Box display="flex" justifyContent="flex-end" m={1} p={1}>
          <Box p={1}>
            <Button
              color="secondary"
              variant="contained"
              component={Link}
              to="/apartments/new"
            >
              Add new apartment
            </Button>
          </Box>
        </Box>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell size="small" align="center">
                Actions
              </StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Floor area size</StyledTableCell>
              <StyledTableCell>Price per month</StyledTableCell>
              <StyledTableCell>Number of rooms</StyledTableCell>
              <StyledTableCell>Adress</StyledTableCell>
              <StyledTableCell>Realtor</StyledTableCell>
              <StyledTableCell>Created Date</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apartments.map((apartment) => (
              <TableRow key={apartment.id}>
                <StyledTableCell size="small" align="center">
                  <IconButton
                    aria-label="edit"
                    component={Link}
                    to={`/apartments/${apartment.id}/edit`}
                  >
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      onDelete(apartment.id);
                    }}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell>{apartment.name}</StyledTableCell>
                <StyledTableCell>{apartment.description}</StyledTableCell>
                <StyledTableCell>{apartment.size}</StyledTableCell>
                <StyledTableCell>$ {apartment.price}</StyledTableCell>
                <StyledTableCell>{apartment.rooms}</StyledTableCell>
                <StyledTableCell>{apartment.address}</StyledTableCell>
                <StyledTableCell>{apartment.realtor.name}</StyledTableCell>
                <StyledTableCell>
                  {moment(apartment.createdAt).format("MMMM D YYYY")}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {fetchError && (
          <Typography variant="body2" color="error">
            {fetchError}
          </Typography>
        )}
      </TableContainer>
    </Container>
  );
}
