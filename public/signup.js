function validatePhoneNumber() {
  //YOU WILL NEED TO VALIDATE PHONE NUMBERS HERE
  var phoneNumber = $('#phoneNumber').val();

  firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
    .then(async function (confirmationResult) {

      window.confirmationResult = confirmationResult;

      $('.phone-validate').hide();
      $('.verify-code').show();
    });
}

function validatePhoneCode() {
  //Hide the verification section temporarily to prevent clicking twice
  //Show a "trying verification" text as well here
  var verificationCode = $("#verificationCode").val();
  window.confirmationResult.confirm(verificationCode)
    .then(async function (result) {
      var phoneNumber = $('#phoneNumber').val();
      let usersRef = getColRefUser();
      let snap = await usersRef.where('phone', '==', phoneNumber).get();
      let newPhoneNumber = false;
      if (snap.docs && snap.docs.length > 0) {
        newPhoneNumber = snap.docs.filter(item => item != phoneNumber).length === 0;
      } else {
        newPhoneNumber = true;
      }

      if (!newPhoneNumber) {
        alert('Phone number already registered');
        /// delete curent user
        await deleteMyAccount();
        //redirect
        window.location.href = '/';
      } else {
        await getPublicUserDoc().update({
          phone: phoneNumber
        });
      }


      console.log(result);

      //Verification ok, proceed... (hide the verification window to prevent trying again)
      gotoTermsAndConditions();

    }).catch(function (error) {
      //Unhide the verification section if there is an error so they can try again
      alert(error + " Please try again.");
    });
}

function gotoTermsAndConditions() {
  $(".phone-number-fields").hide();
  $("#termsConditionsSection").show();

  //agreeContainer
  var acceptTermsButton = document.createElement("button");
  acceptTermsButton.innerText = 'Accept';
  //acceptTermsButton.id = 'agreeToTermsConditions'
  //acceptTermsButton.className = 'my-button red'
  acceptTermsButton.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await getPublicUserDoc().update({
        agreed: 1,
        verified: 1
      });
      localStorage.setItem('verified', 'true');

      
      window.location.href = '/profilepage.html';
    }
    catch (err) {
      alert('Server error');
    }
  });


  document.querySelector('#agreeContainer').appendChild(acceptTermsButton);
}

$(document).ready(async function () {
  $('.verify-code').hide();

  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible',
    'callback': function (response) {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      onSignInSubmit();
    }
  });

  let userObj = await getUser();
  if (userObj) {
    if (userObj.agreed == 1) {
      window.location.href = '/profilepage.html';
    }
    else {
      $('#profile-modal').show();
    }
  }
  else {
    $('#profile-modal').show();
  }
});