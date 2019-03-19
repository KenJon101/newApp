// ################################################################################################
// Setup + Configuration
// ################################################################################################

// let userVerified = localStorage.getItem('verified') == 'true'

// if (!userVerified) {
//   window.location.href = '/client/index.html';
// }

let userID = ""

const defaultAvatar = 'https://firebasestorage.googleapis.com/v0/b/cproject-9bb5f.appspot.com/o/screenProfile.png?alt=media&token=f13e0356-3f8d-4515-9314-851702b580bb'

var storage = firebase.storage();
var storageRef = storage.ref();

// user name
async function showUserData() {
  let uid = getUserId();
  firebase.firestore().collection("usersPrivate").doc(uid).onSnapshot(snap => {
    const userObj = snap.data();
    let name = userObj.firstname + " " + userObj.lastname;
    $('#user-name').text(name);

    showUserRecipes(getUserId(), userObj);
  });
}

(async function () {
  await showUserData();
})()

// avatar

// let imageInput = document.getDocumentById("image-file");
// imageInput.addEventListener("change", () => {
//   console.log(this);

// })

// let storageRef = firebase.storage().ref();
let uid = localStorage.getItem("uid")
let newFileRef = storageRef.child("images/" + uid);

function downloadImageToImgTag(url, imgId) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function (event) {
    var blob = xhr.response;
  };
  xhr.open('GET', url);
  xhr.send();

  var img = document.getElementById(imgId);
  img.src = url;
}

async function grabFile(e) {
  let file = e.target.files[0];
  await newFileRef.put(file);
  let url = await newFileRef.getDownloadURL();
  let uid = localStorage.getItem("uid");

  downloadImageToImgTag(url, "profileAvatar")

  await firebase.firestore().collection('users').doc(uid).set({
    avatar: url
  }, {
      merge: true
    });

}

// when page load, get the avatar
async function getAvatar() {
  let uid = localStorage.getItem("uid");
  if (uid) {
    let doc = await firebase.firestore().collection('users').doc(uid).get();
    let { avatar } = doc.data();

    downloadImageToImgTag(avatar, "profileAvatar");

  }
}

(async function () {
  await getAvatar();
})()




// ################################################################################################
// basic user setup
// ################################################################################################

document.getElementById("removePic").addEventListener("click", emptyAvatar);

async function emptyAvatar() {

  let userId = getUserId();
  document.querySelector('#profileAvatar').src = defaultAvatar;

  await firebase.firestore().collection('users').doc(userId).set({
    avatar: defaultAvatar
  }, {
      merge: true
    });


  // firebase.firestore().collection("users").doc(userID).set({
  //   "avatar": defaultAvatar || ""
  // }, {
  //   merge: true
  // })
}


// function grabFile(event) {
//   console.log(event.target.files[0].name);
//   let file_ref = storageRef.child(userID + '/' + event.target.files[0].name)
//   file_ref.put(event.target.files[0])
//     .then(function (snapshot) {
//       console.log(snapshot)
//       console.log('Uploaded a blob or file!');
//       file_ref.getDownloadURL().then(function (silly) {
//         console.log(silly);
//         //$('#profileAvatar').attr("src", silly)
//         document.querySelector('#profileAvatar').src = silly
//         firebase.firestore().collection("users").doc(userID).update({
//           "avatar": silly || ""
//         })
//       })
//     });

// }

$('#user-name').text('(loading...)');


// async function renderUser(user) {

//   // console.log('listenr 2');

//   // console.log('render user')
//   console.log(user)

//   if (user) {
//     console.log(user);
//     // User is signed in.
//     const { uid, firstname, email } = user;
//     userID = uid;

//     const snap = await firebase.firestore().collection('users').where(firebase.firestore.FieldPath.documentId(), '==', uid).get();
//     if (!snap.docs.length) {
//       console.log('something went wrong');
//       // alert('something went wrong. this user has no entry in `users` collection!');
//     }

//     console.log();
//     let user_user = snap.docs[0].data()
//     $('#user-name').text(user_user.firstname + ' (' + email + ')');
//     document.querySelector('#profileAvatar').src = user_user.avatar

//     // showUserRecipes(snap.docs[0].data());
//   }
//   else {
//     $('#user-name').text('<anonymous>');
//   }
// }

// ################################################################################################
// Additional user data
// ################################################################################################


//   firebase.firestore().collection("users").limit(4).get().then(users => {
//     if (!users.empty) {
//       const userData = users.docs[0].data();

//       console.log("Got user:", userData);
//       const userDataDiv = document.getElementById('userData');
//       userDataDiv.innerHTML = JSON.stringify(userData.email);
//     }
//   }).catch(err => {
//     console.error(err);
//   });
// } else {
//   console.error("No user found");
//   // User is signed out.
//   // ...




// ################################################################################################
// Recipe Debugging
// ################################################################################################

// maintain the "all recipes" list
// see basic example in official documentation: https://firebase.google.com/docs/firestore/query-data/get-data
// const $recipeList = $('#debug-recipe-list');
// $recipeList.text('loading...');
// firebase.firestore().collection("recipes").onSnapshot(function (querySnapshot) {
//   $recipeList.empty(); // clear list

//   // set count
//   $('#debug-recipes-count').text(querySnapshot.size);

//   // add all recipes
//   console.log(querySnapshot)
//   let n = 0
//   querySnapshot.forEach(function (doc) {
//     if (n < 5) {
//       const id = doc.id;
//       const recipe = doc.data();
//       const $recipeEl = $(`<li id="recipe-${id}">${recipe.title}</li>`);
//       $recipeList.append($recipeEl);
//     }
//     n++
//   });
// });


// async function debugShowRandomRecipes(n) {
//   $('#debug-random-recipes').text('loading...');

//   // get recipe ids
//   const ids = await getRandomRecipeIds(n);
//   const recipes = await getRecipesById(ids);
//   console.log(recipes)
//   // $('#debug-random-recipes').text(recipes.slice(0,5).map(r => r && r.title || '<not found>').join('\n'));
// }

// init modal

// check if user agreed



async function checkUserAgreed() {
  // get user obj
  // get the agreed

  let user = await getUser();

  let agreed = user.agreed;

  if (!agreed) {
    // undefined or false
    // show modal
    $("#profile-modal").css('display', "block");
  }

}

let skills = [];
$(document).ready(async () => {
  skills = await getSkills();
  buildSkillsForm(skills);

});
async function getSkills() {
  const snap = await firebase.firestore().collection("skills").get();
  if (snap.docs.length) {
    return snap.docs.map(item => item.data());
  }
  return [];
}
async function getRandomUsersBySkill(skills, n) {
  let userRef = getColRefUser();


  let allItems = [];

  await Promise.all(skills.map(async skill_id => {
    const snap = await userRef.where('skills', 'array-contains',
      parseInt(skill_id, 10)).get();
    if (snap.docs.length) {
      allItems = allItems.concat(snap.docs);
    }
    return null;    // id does not exist (anymore)
  })).catch(e => console.log(e));



  const recipes = allItems;
  let ids = [];
  if (n >= recipes.length) {
    ids = recipes.map(doc => doc.data());
  } else {
    for (let i = 0; i < n; ++i) {
      const itemIndex = getRandomInt(0, recipes.length);
      const itemDoc = recipes.splice(itemIndex, 1)[0];
      ids.push(itemDoc).data();
    }
  }

  return ids.filter(item => item.userUID != getUserId());
}

function getRandomUsersFromServer(skills) {
  $.post('https://us-central1-cproject-9bb5f.cloudfunctions.net/getItems', { skills: skills, uid: getUserId() }, function (response) {
    console.log(response)
  })
}
function buildSkillsForm(skills) {
  let form = $('<form/>', {
    'id': 'artist-skills-form'
  });
  skills.forEach(function (skill) {
    let label = $('<label>').append($('<input>', {
      type: 'radio',
      value: skill.index,
      name: 'skill_select'
    })).append(skill.label).css('display', 'block');
    form.append(label.clone());
  });
  form.append($('<input>', { type: 'submit', value: 'Submit' }));
  form.on('submit', async function (e) {

    e.preventDefault();
    e.stopPropagation();
    const selected = $(this).find('input[type="radio"]:checked').toArray().map(item => item.value);
    let skills = await getRandomUsersBySkill(selected, 5);
    console.log(skills);
    displayUsers(skills);
    return false;
  });
  $('#form-placeholder').append(form);
}

function displayUsers(users) {
  users = users.concat(users, users);
  delete users[0];
  let div = $('<div>');
  users.forEach(function (user) {
    let userDiv = $('<div>', {
      class: "profile-text-block2 oneByFive"
    });
    userDiv.append($('<p>').append($('<img>', { src: user.avatar })));
    userDiv.append('<p>' + user.firstname + '</p>');
    userDiv.append('<a href="mailto:' + user.email + '">' + user.email + '</a>');
    div.append(userDiv);
  });
  $('#users-container').html(div.html());
}
// please pause this for a few minutes ok... i will type with the mic off
(async function () {
  await checkUserAgreed();
})();

initSkillSelection();
