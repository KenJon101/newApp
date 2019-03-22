// ################################################################################################
// Setup + Configuration
// ################################################################################################

// let userVerified = localStorage.getItem('verified') == 'true'

// if (!userVerified) {
//   window.location.href = '/index.html';
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
  //  await showUserData();
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
        let {avatar} = doc.data();

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

// let skills = [];
// $(document).ready(async () => {
//     skills = await getSkills();
//     buildSkillsForm(skills);
//
// });

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
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'https://us-central1-cproject-9bb5f.cloudfunctions.net/getItems',
            dataType: "json",
            method: 'POST',
            crossDomain: true,
            data: {skills: skills, uid: getUserId()},
            success: (data) => {
                resolve(data)
            }
        });
    });
}

function buildSkillsForm(skills, type, appendTo) {
    if(type) {
        let form = $('<form/>', {
            'id': 'artist-skills-form'
        });
        let labelTitle = '';
        let buttonText = '';
        if(type=== 'skills') {
            labelTitle = 'Select the skills you have:';
            buttonText = 'Save skills';
        } else {
            labelTitle = 'Select the skills you need:';
            buttonText = 'Save need skills';
        }
        form.append($('<h4>', {html: labelTitle}));
        skills.forEach(function (skill) {
            let label = $('<label>').append($('<input>', {
                type: 'checkbox',
                value: skill.index,
                name: 'skill_select[]'
            })).append(skill.label).css('display', 'block');
            form.append(label.clone());
        });
        form.append($('<button>', {type: 'submit', html: buttonText}));
        form.on('submit', async function (e) {
            e.preventDefault();
            e.stopPropagation();
            let selected = $(this).find('input[type="checkbox"]:checked').toArray().map(item => parseInt(item.value,  10));
            if(type === 'skills') {
                // save skills
                getPublicUserDoc().update({skills: selected});
                buildSkillsForm(skills, 'needed-skills', appendTo);
            } else if(type === 'needed-skills') {
                // save need skills
                getPublicUserDoc().update({neededSkills: selected}).then(async response => {
                    let randomUsers = await getRandomUsersFromServer(selected, 5);
                    getPublicUserDoc().update({
                        recommendedUsers: randomUsers.map(usr => usr.userUID)
                    }).then(response => {
                        $(appendTo).html('');
                        displayUsers(randomUsers, appendTo);
                    });
                });
                // fetch random users, save random users
              //  let skills = await getRandomUsersFromServer(selected, 5);
            } else {

            }
            // const selected = $(this).find('input[type="radio"]:checked').toArray().map(item => item.value);
            // let skills = await getRandomUsersFromServer(selected, 5);
            // console.log(skills);
            // displayUsers(skills);
            // return false;
        });
        $(appendTo).html('').append(form);
    }
}


function displayUsers(users, appendTo) {
    let div = $('<div>');
    users.forEach(function (user) {
        let userDiv = $('<div>', {
            class: "profile-text-block2 oneByFive"
        });
        userDiv.append($('<p>').append($('<img>', {src: user.avatar})));
        userDiv.append('<p>' + user.firstname + '</p>');
        userDiv.append('<a href="mailto:' + user.email + '">' + user.email + '</a>');
        div.append(userDiv);
    });
    $(appendTo).html(div.html());
}

async function getUsersByIds(ids) {
    let allUsers = [];

    const col = getColRefUser();
    await Promise.all(ids.map(async id => {
        const snap = await col.where('userUID', '==', id).get();
        if (snap.docs.length) {
            allUsers = allUsers.concat(snap.docs);
        }
        return null;    // id does not exist (anymore)
    }))  ;

    const  users = allUsers;
    return users.map(doc => doc.data());
}

let loggedUser = null;
let skills = [];
$(document).ready(async () => {
    skills = await getSkills();
    await initSkillSelection();
    // await checkUserAgreed();

    loggedUser = await getUser();
    if (!loggedUser.agreed) {
        // undefined or false
        // show modal
        $("#profile-modal").css('display', "block");
        return;
    }
    if((!loggedUser.skills || loggedUser.skills.length === 0) || (!loggedUser.neededSkills || loggedUser.neededSkills.length === 0)) {
        // build form
        let type = null;
        if (!loggedUser.skills || loggedUser.skills.length === 0) {
            type = 'skills';
        } else if (!loggedUser.neededSkills || loggedUser.neededSkills.length === 0) {
            type = 'needed-skills';
        }
        buildSkillsForm(skills, type, '#skills-form-container');
    } else {
        let recommendedUsers = await getUsersByIds(loggedUser.recommendedUsers);
        displayUsers(recommendedUsers, '#skills-form-container');
    }
});