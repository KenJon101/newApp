
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

async function selectSkills(evt) {
  evt.preventDefault();

  // get the value of the selected skills from the HTML element
  // NOTE: We are using an attribute selector (the attribute being "name") https://www.w3schools.com/css/css_attribute_selectors.asp
  const selectedSkills = $('.choose-skill-block [name="skills[]"]:checked').toArray().map(el => el.value);

  if (selectedSkills.length == 0) {
    alert('select at least one skill');
    return;
  }

  // save the selected skills to database
  await firebase.firestore().collection('userSkills').doc(getUserId()).set({
    skillList: selectedSkills
  });
}