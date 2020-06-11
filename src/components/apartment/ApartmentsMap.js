import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import AppsIcon from "@material-ui/icons/Apps";
import RoomIcon from "@material-ui/icons/Room";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import MapView from "./MapView";
import { fetchApartments } from "../../services";
import RangeSelectButton from "../popover/RangeSelectButton";
import CloseIcon from "@material-ui/icons/Close";

/**
 * Helper functions
 */
const parseRange = (min, max) => {
  let minVal = null;
  let maxVal = null;
  minVal = parseInt(min);
  maxVal = parseInt(max);
  if (isNaN(minVal) || minVal < 0) {
    minVal = null;
  }

  if (isNaN(maxVal) || maxVal < 0) {
    maxVal = null;
  }

  if (minVal && maxVal && minVal > maxVal) {
    minVal = null;
    maxVal = null;
  }

  return [minVal && String(minVal), maxVal && String(maxVal)];
};

const useStyles = makeStyles((theme) => ({
  list: {
    width: "400px",
    height: "100%",
    position: "fixed",
    left: "0",
    overflowY: "auto",
    "z-index": "-2",

    "-webkit-box-shadow": "6px 2px 9px -2px rgba(184,184,184,1)",
    "-moz-box-shadow": "6px 2px 9px -2px rgba(184,184,184,1)",
    "box-shadow": "6px 2px 9px -2px rgba(184,184,184,1)",

    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "calc(50% - 56px)",
      top: "calc(50% + 56px)",

      "-webkit-box-shadow": "0px -6px 9px -2px rgba(184,184,184,1)",
      "-moz-box-shadow": "0px -6px 9px -2px rgba(184,184,184,1)",
      "box-shadow": "0px -6px 9px -2px rgba(184,184,184,1)",
    },
  },
  mapContainer: {
    width: "calc(100% - 400px)",
    height: "100%",
    position: "fixed",
    right: "0",
    background: "#ffffff",
    "z-index": "-5",

    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "calc(50% - 56px)",
      top: "112px",
    },
  },
  main: {
    backgroundColor: "#000",
  },
  dropdownButton: {
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#fff",
    },
  },
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
    verticalAlign: "text-bottom",
  },
  meta: {
    marginBottom: "16px",
  },
  filterBar: {
    [theme.breakpoints.down("xs")]: {
      flexWrap: "wrap",
    },
  },

  clearButton: {
    backgroundColor: "#aaa",
    "&:hover": {
      backgroundColor: "#aaa",
    },
    textTransform: "none",
    borderRadius: 0,
    marginRight: "10px",

    [theme.breakpoints.down("xs")]: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
}));
export default function ApartmentsMap() {
  const classes = useStyles();
  const [apartments, setApartments] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [minSize, setMinSize] = useState(null);
  const [maxSize, setMaxSize] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [minRooms, setMinRooms] = useState(null);
  const [maxRooms, setMaxRooms] = useState(null);
  const [message, setMessage] = useState("Loading...");
  const [showClearFilterButton, setShowClearFilterButton] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchApartments({
          minSize,
          maxSize,
          minPrice,
          maxPrice,
          minRooms,
          maxRooms,
        });
        if (data.length == 0) {
          setMessage("No apartments found");
        }
        setApartments(data);
      } catch (e) {
        setFetchError(e.message);
      }
    }
    fetchData();

    const shouldShowClearButton =
      !!minSize ||
      !!maxSize ||
      !!minPrice ||
      !!maxPrice ||
      !!minRooms ||
      !!maxRooms;
    setShowClearFilterButton(shouldShowClearButton);
  }, [minSize, maxSize, minPrice, maxPrice, minRooms, maxRooms]);

  const onChangeSize = (min, max) => {
    const [minVal, maxVal] = parseRange(min, max);
    setMinSize(minVal);
    setMaxSize(maxVal);
  };

  const onChangePrice = (min, max) => {
    const [minVal, maxVal] = parseRange(min, max);
    setMinPrice(minVal);
    setMaxPrice(maxVal);
  };

  const onChangeRooms = (min, max) => {
    const [minVal, maxVal] = parseRange(min, max);
    setMinRooms(minVal);
    setMaxRooms(maxVal);
  };

  const onClearFilter = () => {
    setMinSize(null);
    setMaxSize(null);
    setMinPrice(null);
    setMaxPrice(null);
    setMinRooms(null);
    setMaxRooms(null);
  };

  return (
    <Container component="main" maxWidth="xl" className={classes.main}>
      <Toolbar className={classes.filterBar}>
        <RangeSelectButton
          min={minPrice}
          max={maxPrice}
          defaultText="Select price"
          prefix="$"
          onChange={onChangePrice}
        />

        <RangeSelectButton
          min={minSize}
          max={maxSize}
          defaultText="Select area size"
          surfix="sqft"
          onChange={onChangeSize}
        />
        <RangeSelectButton
          min={minRooms}
          max={maxRooms}
          defaultText="Select number of rooms"
          surfix="rooms"
          onChange={onChangeRooms}
        />
        {showClearFilterButton && (
          <Button className={classes.clearButton} onClick={onClearFilter}>
            Clear filters <CloseIcon />
          </Button>
        )}
      </Toolbar>
      <Card className={classes.list}>
        <List className={classes.root}>
          {apartments.length == 0 && (
            <ListItem>
              <ListItemText primary={message} />
            </ListItem>
          )}
          {apartments.map((apartment, idx) => (
            <React.Fragment key={apartment.id}>
              {idx > 0 && <Divider component="li" />}
              <ListItem
                onClick={(event) => {
                  setSelectedApartment(apartment);
                }}
                button
              >
                <ListItemText
                  component="div"
                  primary={apartment.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        variant="caption"
                        color="textPrimary"
                        className={classes.meta}
                      >
                        $ {apartment.price} per month
                      </Typography>

                      <Typography
                        variant="caption"
                        display="block"
                        className={classes.meta}
                      >
                        <AspectRatioIcon
                          className={classes.inline}
                          fontSize="small"
                        />{" "}
                        {apartment.size} sqft -{" "}
                        <AppsIcon className={classes.inline} fontSize="small" />{" "}
                        {apartment.rooms} rooms
                      </Typography>

                      <Typography
                        variant="caption"
                        display="block"
                        className={classes.meta}
                      >
                        <RoomIcon className={classes.inline} fontSize="small" />{" "}
                        {apartment.address}
                      </Typography>

                      <Typography
                        variant="caption"
                        display="block"
                        gutterBottom
                      >
                        {apartment.description}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Card>

      <div className={classes.mapContainer}>
        <MapView
          apartments={apartments}
          selectedApartment={selectedApartment}
        />
      </div>
    </Container>
  );
}
