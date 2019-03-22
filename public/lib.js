
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

async function addTestSkils() {
  var skills = [
    {
      'label': 'Drums',
      'short_key': 'drums',
      'index':0
    },
    {
      'label': 'Bass rocker',
      'short_key': 'bass',
      'index': 1
    },
    {
      'label': 'Awesome voice',
      'short_key': 'voice',
      'index': 2
    },
    {
      'label': 'Piano destroyer :)',
      'short_key': 'piano',
      'index': 3
    },
    {
      'label': 'MC',
      'short_key': 'mc',
      'index': 4
    }
  ];
  skills.forEach(async skill => {
    await firebase.firestore().collection("skills").add(skill);
  });
}
async function addTestUsers() {
  for(var i=1; i++; i<5) {
    var uuid = Math.floor(Math.random() * 99999)+1;

    await firebase.firestore().collection("users").add({
      agreed: 1,
      avatar: 'https://placekitten.com/80/80',
      firstname: 'Nameuser' + i,
      lastname: 'Lastnameuser' + i,
      email: 'customemail' + i + '@example.com',
      phone: '+11234567890',
      userUID: uuid,
      verified: 1,
      skills: [
        Math.floor(Math.random() * 4)+1,
        Math.floor(Math.random() * 4)+1,
      ],
      neededSkills: [
        Math.floor(Math.random() * 4)+1,
        Math.floor(Math.random() * 4)+1,
      ],
      recommendedUsers: []
    }).then(response => {
      console.log(response)
    }).catch(err => {
      console.log(err)
    })
  }
}