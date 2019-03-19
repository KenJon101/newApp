$(function () {


  // const config = {
  //   apiKey: "AIzaSyA1W6fgbxENa7AbChzrZuKVRFSiQwBauLg",
  //   authDomain: "cproject-9bb5f.firebaseapp.com",
  //   databaseURL: "https://cproject-9bb5f.firebaseio.com",
  //   projectId: "cproject-9bb5f",
  //   storageBucket: "cproject-9bb5f.appspot.com",
  //   messagingSenderId: "926906729227"
  // }
  // firebase.initializeApp(config);

  // firebase.auth().onAuthStateChanged(user => {

  //   if (user) {
  //     window.location.href = '/client/profilepage.html';
  //   }
  //   else {

  //   }
  // });

  // var btnSignup = document.getElementById('btnSignup');
  // var txtEmail = document.getElementById('txtEmail');
  // var txtPassword = document.getElementById('txtPassword');

  // Registration-btnSignup
  // btnSignup.addEventListener('click', function (e) {
  //   var email = txtEmail.value;
  //   var password = txtPassword.value;
  //   var auth = firebase.auth();
  //   const fName = document.getElementById('fname').value;
  //   const lName = document.getElementById('lname').value;
  //   const phoneNumber = document.getElementById('phoneNumber').value;
  //   //const fs = new firebase.firestore.Firestore;
  //   console.log("fName:", fName);
  //   console.log("lName:", lName);
  //   console.log("phoneNumber:", phoneNumber);
  //   auth.createUserWithEmailAndPassword(email, password).then(async(userAuth) => {
  //       const {
  //         user
  //       } = userAuth;
  //       const {
  //         uid
  //       } = user;
  //       //localStorage.setItem("currentUserUID", JSON.stringify({uid: user.user.uid}));
  //        

//       // get 4 random recipes
  //       console.log('getting random recipes...');
  //       const randomRecipeIds = await getRandomRecipeIds(4);
  //       console.log('got random recipes:', randomRecipeIds);
  
//       //firebase.firestore().collection("users").add({
  //       firebase.firestore().collection("users").doc(uid).set({
  //         "email": email || "",
  //         "firstname": fName || "",
  //         "lastname": lName || "",
  //         "phone": phoneNumber || "",
  //         "userUID": user.uid,
  //         recipes: randomRecipeIds
  //       }).then(() => {
  //         //localStorage.setItem("currentUserUID", JSON.stringify({uid: uid}));
  //          
  //         window.location.href = '/client/profilepage.html';
//       }).catch(console.error);
  //       console.log("user:", user);
  //     })
  //     .catch(console.error);
  // });
  
  
// Login on the home page

  // var txtLoginEmail = document.getElementById('txtLoginEmail');
// var txtLoginPassword = document.getElementById('txtLoginPassword');
  
  // var txtLoginEmail2 = document.getElementById('txtLoginEmail2');
// var txtLoginPassword2 = document.getElementById('txtLoginPassword2');
  
  // var btnForgotPassword = document.getElementById('btnForgotPassword');
// btnForgotPassword.addEventListener('clic k', function(e){        
  //   var auth = firebase.auth();
  //   auth.sendPasswordResetEmail();
  // })
  
  
// Login
// var btnLogin = document.getElementById('btnLogin');
  // var txtLoginEmail = document.getElementById('txtLoginEmail');
  // var txtLoginPassword = document.getElementById('txtLoginPassword');
  
  // btnLogin.addEventListener('click', async function (e) {
//   e.preventDefault();
  //   //var email = txtLoginEmail.value;      
  //   //var password = txtLoginPassworlue;
  //   // const authResult = await signIn();
    
  //   // window.location.href = '/client/profilepage.html';
 });
  
  // join
// $('.join').on('click', function (event) {
  //   event.preventDefault();
  //   window.scrollTo(0, $('#register').offset().top - 70);
  //   return false;
  // });

  // Slider
  if(window.Swiper) {
    var swiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      paginationClickable: true,
      navigation: {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next'
      }
    });
  }
  
  // Opens curtains
$('.learn-more').on('click', function (event) {
  // Add class to open the curtain with CSS
  //$('.curtain footer').fadeOut(function () {
    //});
    $('body').addClass('loaded');
  
    // Removes the curtain after 1 second
  setTimeout(function () {
      $('.curtain').remove();
    }, 1000);
});

function checkLogIn () {
  console.log('checking log in');
}

function isLoggedIn() {
  return Boolean(localStorage.getItem('uid'));
}

if(isLoggedIn()) {
  $('.not-logged-in').hide();
} else {
  $('.logged-in').hide()
}

/*checkLogIn().then(function(user) {
  console.log(user)
  if(!user.exist) {
    $('.not-logged-in').show();
  }
});*/