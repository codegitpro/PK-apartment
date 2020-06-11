import Geocode from "react-geocode";
 
Geocode.setApiKey("AIzaSyD95odkHlXFt0J8jcMl5uNxhPXWRMSCNq0");
Geocode.setLanguage("en");
Geocode.enableDebug();

export default Geocode;

// Get address from latidude & longitude.
Geocode.fromLatLng("48.8583701", "2.2922926").then(
  response => {
    const address = response.results[0].formatted_address;
    console.log(address);
  },
  error => {
    console.error(error);
  }
);
