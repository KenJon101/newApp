
/**
 * Utility function to generate a random int in given range
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getColRefUser() {
  return firebase.firestore().collection("users");
}