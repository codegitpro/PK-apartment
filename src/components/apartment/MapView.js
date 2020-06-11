import React, { useState, useEffect } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import AppsIcon from "@material-ui/icons/Apps";
import RoomIcon from "@material-ui/icons/Room";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  inline: {
    display: "inline",
    verticalAlign: "text-bottom",
  },
  meta: {
    marginBottom: "16px",
  },
}));

function MapView({ apartments, google, selectedApartment }) {
  const classes = useStyles();
  const [activeMarker, setActiveMarker] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showingInfoWindow, setShowingWindow] = useState(false);
  const [bounds, setBounds] = useState(null);
  const [activeApartment, setActiveApartment] = useState(false);

  const onClickMarker = (props, marker) => {
    setActiveMarker(marker);
    setSelectedPlace(props);

    setShowingWindow(true);
  };

  const onCloseInfoWindow = () => {
    setActiveMarker(null);
    setShowingWindow(false);
  };

  const onClickMap = () => {
    if (showingInfoWindow) {
      setShowingWindow(false);
    }
  };

  useEffect(() => {
    if (google) {
      let newBounds = new google.maps.LatLngBounds();
      for (let i = 0; i < apartments.length; i++) {
        newBounds.extend(apartments[i].location);
      }
      setBounds(newBounds);
    }

    if (activeApartment !== selectedApartment) {
      setActiveApartment(selectedApartment);
    }
  }, [apartments, selectedApartment]);

  return (
    <Map
      className="map"
      google={google}
      onClick={onClickMap}
      center={activeApartment ? activeApartment.location : null}
      style={{ height: "100%", position: "relative", width: "100%" }}
      bounds={bounds}
    >
      {apartments &&
        apartments.map((apartment) => (
          <Marker
            key={apartment.id}
            apartment={apartment}
            onClick={onClickMarker}
            position={apartment.location}
          />
        ))}
      <InfoWindow
        marker={activeMarker}
        onClose={onCloseInfoWindow}
        visible={showingInfoWindow}
      >
        {selectedPlace ? (
          <div>
            <Typography
              variant="body1"
              color="textPrimary"
              className={classes.meta}
            >
              $ {selectedPlace.apartment.name}
            </Typography>

            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.meta}
            >
              $ {selectedPlace.apartment.price}
            </Typography>

            <Typography
              variant="caption"
              display="block"
              className={classes.meta}
            >
              <AspectRatioIcon className={classes.inline} fontSize="small" />{" "}
              {selectedPlace.apartment.size} sqft -{" "}
              <AppsIcon className={classes.inline} fontSize="small" />{" "}
              {selectedPlace.apartment.rooms} rooms
            </Typography>

            <Typography
              variant="caption"
              display="block"
              className={classes.meta}
            >
              <RoomIcon className={classes.inline} fontSize="small" />{" "}
              {selectedPlace.apartment.address}
            </Typography>

            <Typography variant="caption" display="block" gutterBottom>
              {selectedPlace.apartment.description}
            </Typography>
          </div>
        ):<div></div>}
      </InfoWindow>
    </Map>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyD95odkHlXFt0J8jcMl5uNxhPXWRMSCNq0",
})(MapView);
