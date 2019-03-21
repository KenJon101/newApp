
async function initSkillSelection() {
  firebase.firestore().collection('userSkills').doc(getUserId()).onSnapshot(snap => {
    const data = snap.data();
    if (data && data.skillList && data.skillList.length) {
      $('.choose-skill-block').hide();
      $('.choose-musician-block').show();

      //const { skillList } = data;

    }
    else {
      $('.choose-skill-block').show();
      $('.choose-musician-block').hide();
    }
  });
}

async function selectSkills(type) {

  // get the value of the selected skills from the HTML element
  // NOTE: We are using an attribute selector (the attribute being "name") https://www.w3schools.com/css/css_attribute_selectors.asp
  const selectedSkills = $('.skills-form [name="skills[]"]:checked').toArray().map(el => el.value);

  if (selectedSkills.length == 0) {
    alert('select at least one skill');
    return;
  }
  if(type==='skill') {
    // save the selected skills to database
    await firebase.firestore().collection('userSkills').doc(getUserId()).set({
      skillList: selectedSkills
    });
    $('.choose-skill-block').show();
    $('.choose-musician-block').hide();
  }else
  if(type==='musician') {
    // save the selected skills to database
    await firebase.firestore().collection('userMusicians').doc(getUserId()).set({
      skillList: selectedSkills
    }).then(async response => {
      let users = getRandomUsersFromServer([1,2,3], 5).then(data => {
        displayUsers(data);
      });
    });
    $('.skills-form').hide();

  }
}