
let loginButton = document.getElementById("login");

let logoutButton = document.getElementById("logout");
// logout handler
if (logoutButton) {

  logoutButton.addEventListener('click', logoutUser);
}


function getNewRandom(min, max, randArr) {
  let rand = Math.floor(Math.random() * (1 + max - min)) + min;
  if (randArr.includes(rand)) {
    rand = getNewRandom(min, max, randArr);
  }
  return rand;
}
// let joinButton = document.getElementById("join");

// TODO: 
//  1. only show joinButton when not logged in. 
//  2. After pressing join or login button: user logs in via google (signIn function)
//  3. use the resulting user id to check if user is in database
//  4. if in database, then go to profilepage
//  5. if not in database, then go to registration form
//  6. When submitting registration form, enter user info into database, then go to profilepage
//    (code for step 6 is in index.js)

// utiles
// function getAuth0Lock() {

//   var lock = new Auth0Lock(
//     'g1nwySoK6ECNSN60SZF06Pujt2W6nUcL',
//     'project101.auth0.com'
//   );

//   return lock;
// }

// firebase.auth().onAuthStateChanged((result) => {
//   console.log('auth changed')
//   console.log(result)
// });


// firebase.auth().signOut().then(function() {
//   // Sign-out successful.



// }).catch(function(error) {
//   // An error happened.
// });


async function getLoggedInUser() {
  let result = await firebase.auth().onAuthStateChanged();
  return result;
}

async function renderUser(user) {
  let loggedIn = await getLoggedInUser();
  if (!loggedIn) {
    // not logged in
    loginButton.style.display = "block";
    logoutButton.style.display = "none";
  } else {
    loginButton.style.display = "none";
    logoutButton.style.display = "block";
  }
}

// const config = {
//   apiKey: "AIzaSyA1W6fgbxENa7AbChzrZuKVRFSiQwBauLg",
//   authDomain: "cproject-9bb5f.firebaseapp.com",
//   databaseURL: "https://cproject-9bb5f.firebaseio.com",
//   projectId: "cproject-9bb5f",
//   storageBucket: "cproject-9bb5f.appspot.com",
//   messagingSenderId: "926906729227"
// }
// firebase.initializeApp(config);

async function signIn() {
  console.log("signing in...")
  var provider = new firebase.auth.GoogleAuthProvider();
  //provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

  try {
    let result = await firebase.auth().signInWithPopup(provider);
    let id = result.additionalUserInfo.profile.id;

    console.log('Login result: ', result);
    // store user
    localStorage.setItem("uid", id);

    let doc = await firebase.firestore().collection('users').doc(id).get();
    let userInFB = doc.data();

    if (userInFB) {
      // already in firebase
      window.location.href = '/profilepage.html';
    } else {
      // create user in firebase
      let { picture, email, given_name, family_name } = result.additionalUserInfo.profile;

      let publicUserData = {
        avatar: picture,
        firstname: given_name,
        userUID: id,
        agreed: 0
      };

      let privateUserData = {
        firstname: given_name,
        lastname: family_name,
        email,
        recipes: [],
        phone: ""
      };


      await Promise.all([
        firebase.firestore().collection('usersPrivate').doc(id).set(privateUserData),
        firebase.firestore().collection('users').doc(id).set(publicUserData)
      ]);

      // getRandomRecipes(5).then(function(randomRecipeIds) {
      //   userObj.recipes = randomRecipeIds
      //   //firebase.firestore().collection('users').doc(id).set(userObj);
      //   firebase.firestore().collection("users").doc(uid).set({
      //     avatar: picture,
      //     email,
      //     firstname: given_name,
      //     lastname: family_name,
      //     phone: "",
      //     recipes: randomRecipeIds,
      //     userUID: id
      //   }).then(() => {
      //       console.log("User saved");
      //       //window.location.href = 'profilepage.html';
      //   }).catch(console.error);
      // });


      window.location.href = '/signupModal.html';

    }

  } catch (error) {
    console.log(error)

  }

  // return firebase.auth().signInWithPopup(provider).then(async function (result) {
  //   // finished logging in!
  //   console.log('Login result: ', result);
  //   let id = result.profile.id;
  //   debugger;
  //   try {
  //     let user = await firebase.firestore().collection('users').get(id);
  //     console.log('user here')
  //     console.log(user);
  //     debugger;
  //   } catch (err) {
  //     // user does not exist
  //     console.log('user does not exist');
  //     debugger;
  //   }


  // }).catch(function (error) {
  //   // Handle Errors here.
  //   var errorCode = error.code; 
  //   var errorMessage = error.message;
  //   // The email of the user's account used.
  //   var email = error.email;
  //   // The firebase.auth.AuthCredential type that was used.
  //   var credential = error.credential;
  //   // [START_EXCLUDE]
  //   if (errorCode === 'auth/account-exists-with-different-credential') {
  //     console.log('You have already signed up with a different auth provider for that email.');
  //   } else {
  //     console.log('[ERROR] ', error);
  //     console.error(error);
  //   }
  //   // [END_EXCLUDE]
  // });
}

$(document).ready(() => {

  $('#homeLogin, #login').on('click', async (e) => {
    e.preventDefault();
    const authResult = await signIn();
  });
});





//let agreeButton = document.getElementById("agreeToTermsConditions");
// logout handler

if (false) {
  agreeButton.addEventListener('click', async (e) => {
    e.preventDefault();
    //let userObj = await getUser();
    getPublicUserDoc().update({ agreed: 1 }).then(() => {
      window.location.href = '/profilepage.html';
    });
  });
}


let noAgreeButton = document.getElementById("noAgreeToTermsConditions");
// logout handler
if (noAgreeButton) {
  noAgreeButton.addEventListener('click', (e) => {
    e.preventDefault();
    deleteMyAccount();
  });
}



let deleteMyAccountButton = document.getElementById("deleteMyAccount");
// logout handler
if (deleteMyAccountButton) {
  deleteMyAccountButton.addEventListener('click', (e) => {
    e.preventDefault();
    var result = confirm("Want to delete your account?");
    if (result) {
      //Logic to delete the item
      localStorage.setItem('verified', 'false')
      deleteMyAccount();
      logoutUser();
    }
  });
}

function getUserId() {
  return localStorage.getItem("uid");
}

/**
 * Get private and public data of current user,
 * merged into one object.
 */
async function getUser() {
  let uid = getUserId();
  if (uid) {
    const [userPublic] = await Promise.all([
      getPublicUserDoc().get()
    ]);

    return userPublic.data();
  }
  return null;
}

function getPublicUserDoc() {
  return firebase.firestore().collection('users').doc(getUserId());
}
function getPrivateUserDoc() {
  return firebase.firestore().collection('usersPrivate').doc(getUserId());
}

function logoutUser(e) {
  // console.log('here')
  // alert("aaa")
  e.preventDefault();
  logoutUserAndRemoveStoredData();
}
function logoutUserAndRemoveStoredData() {

  localStorage.removeItem('uid');
  localStorage.removeItem('verified');
  firebase.auth().signOut();
  setTimeout(function () {
    window.location.href = '/index.html';
  }, 10);
}
async function deleteMyAccount() {
  await Promise.all([
    getPublicUserDoc().delete(),
    getPrivateUserDoc().delete()
  ]);
  
  logoutUserAndRemoveStoredData();
}



function enableLoginLogoutButton() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // is logged
      $('#login').hide();
      $('#logout').show();
    } else {
      // No user is signed in.
      $('#login').show();
      $('#logout').hide();
    }
  });
}
            
enableLoginLogoutButton();