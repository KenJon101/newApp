
 const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');


admin.initializeApp();

const db = admin.firestore();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from a Severless Database!");
});

exports.getItems = functions.https.onRequest((req, res) => {
  res.header('Access-Control-Allow-Origin', '*');

  return cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(404).json({
        message: 'Not allowed'
      })
    }


    const skills = req.body.skills.split(',');
    const currentUID = req.body.uid;
    let n = 5;
    let users = [];
    let userRef = db.collection('users');


    return Promise.all(skills.map(skill_id => {
      return userRef.where('skills', 'array-contains', parseInt(skill_id, 10)).get()
        .then(snapshot => {
          if (snapshot && snapshot.docs && snapshot.docs.length) {

            snapshot.docs.forEach((item) => {
              let userData = item.data();
              let found = users.filter(usr => usr.userUID === userData.userUID);
              if (found.length === 0) {
                users.push(userData);
              }
            });
          }
          users = users.filter(usr => usr.userUID !== currentUID);
          return users;
        })
    })).then(data => {
      let ids = users;
      if (n >= users.length) {
        ids = users;
      } else {
        for (let i = 0; i < n; ++i) {
          const itemIndex = getRandomInt(0, users.length);
          const itemDoc = users.splice(itemIndex, 1)[0];
          ids.push(itemDoc);
        }
      }
      res.status(200).json(ids);
    }).catch(error => {
      res.status(error.code).json({
        message: `Something went wrong. ${error.message}`
      })
    })


  })
})

exports.getItems2 = functions.https.onRequest((req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') {
    return res.status(401).json({
      message: 'Not allowed'
    })
  }
  if (req.method === 'POST') {

    const item = req.body.item;
    return cors(req2, res2, () => {
      res.status(200).json(['test', req.body]);
    })
  }
})

exports.addItem = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(401).json({
        message: 'Not allowed'
      })
    }
    console.log(req.body)

    const item = req.body.item

    //database.push({ item });

    let items = [];
    return db.on('value', (snapshot) => {
      snapshot.forEach((item) => {
        items.push({
          id: item.key,
          items: item.val().item
        });
      });
      // return database.on('value', (snapshot) => {
      //   snapshot.forEach((item) => {
      //     items.push({
      //       id: item.key,
      //       items: item.val().item
      //     });
      //   });

      res.status(200).json(items)
    }, (error) => {
      res.status(error.code).json({
        message: `Something went wrong. ${error.message}`
      })
    })
  })
})

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// getRandomUsersFromServer([2])
