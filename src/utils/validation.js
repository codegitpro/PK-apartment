export const validateEmail = (email) => {
  var mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;
  if(email.match(mailformat)) {
    return true;
  }
  return false;
}
