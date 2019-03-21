
// Recipe management code.

const RecipeCategory = {
  guitar: 1,
  bass: 2,
  drums: 3,
  keyboard: 4,
  brass: 5,
  other: 6
};

function getCategoryByName(categoryName) {
  const category = RecipeCategory[categoryName];
  if (!category) {
    throw new Error('Invalid categoryName: ' + categoryName);
  }
  return category;
}


function getRecipeCollectionRef() {
  return firebase.firestore().collection("userSkills");
}

function getSkillsByUID(uid) {
  var userSkills = firebase.firestore().collection('userSkills').doc(uid).get().then(function (doc) {
    
  });

}

async function showUserRecipes(uid, user) {
  console.log("Showing User Recipes");
  console.log("UID: " + uid);
  console.log("User: " + user);
  $('#recipe-view').hide();
  $('#recipe-choice').hide();

  //const recipeIds = user.recipes;
  const recipeIds = getSkillsByUID(uid);
  console.log("recipeIds: " + recipeIds);
  if (recipeIds && recipeIds.length) {
    console.log("User Has Recipes: " + recipeIds.length);
    $('#recipe-view').show();

    const recipes = await getRecipesById(recipeIds);
    $('#user-recipes-count').text(recipes.length);
    console.log("User Recipe Count: " + recipes.length);

    const $list = $('#user-recipes');
    $list.empty();     // clear list
    recipes.forEach(recipe => {
      const $li = $(`<li>${recipe.title}</li>`);
      $list.append($li);
    });
  }
  else {
    // user does not have recipes yet
    $('#recipe-choice').show();
    $('#recipe-choice input[type=checkbox]').on('click', (e) => {
      if ($('#recipe-choice input[type=checkbox]:checked').length > 3) {
        $(this).prop('checked', false);
        $(this).attr('checked', false);
        e.preventDefault();
        e.stopPropagation();
      }
    });
    $('#recipe-choice input[type=submit]').on('click', async evt => {
      evt.preventDefault();

      // get selected options
      var selectedCategories = $('#recipe-choice input[type=checkbox]:checked').toArray();
      // var recipeCollectionInput = radios.find(
      //  ({ type, checked }) => type === 'checkbox' && checked
      //);
      // for (var i = 0; i < radios.length; i++) {
      //   if (radios[i].type === 'radio' && radios[i].checked) {
      //     recipeCollection = radios[i].value;
      //   }
      // }

      if (!selectedCategories.length) {
        return;
      }

      const categoryNames = selectedCategories.map(item => item.value);

      const categoryIds = categoryNames.map(categoryName => getCategoryByName(categoryName))

      // await getRandomRecipes(5).then(function(randomRecipeIds) {
      //     userObj.recipes = randomRecipeIds
      // });
      const randomRecipeIds = await getRandomRecipeIds(categoryIds, 5);
      const userUpdate = {
        recipes: randomRecipeIds
      };

      await firebase.firestore().collection('usersPrivate').doc(uid).update(
        userUpdate
      );
      /*
            return await Promise.all(ids.map(async id => {
              const snap = await recipeColl.where(firebase.firestore.FieldPath.documentId(), '==', id).get();
              if (snap.docs.length) {
                return snap.docs[0].data();
              }
              return null;    // id does not exist (anymore)
            }));
            */
    });
  }
}

// async function getRandomRecipes(category, maxNumber) {
//   let randomArr = [];
//   await getRecipeCollectionRef().get().then(function (querySnapshot) {
//     const data = querySnapshot.docs;
//     const min = 1;
//     const max = data.length;
//     if (maxNumber < max) {
//       let randNumbers = [];
//       for (let i = 0; i < max; i++) {
//         if (randNumbers.length === maxNumber) {
//           break;
//         }
//         let rand = getNewRandom(min, max, randNumbers);
//         randNumbers.push(rand);
//         if (typeof data[rand] !== 'undefined') {
//           randomArr.push(data[rand]);
//         }
//       }

//     } else {
//       randomArr = data;
//     }
//   });
//   return randomArr.map(item => item.id).sort();
// }

/**
 * Get the given number of random recipes.
 * @param {*} n 
 */
async function getRandomRecipeIds(categoryIds, n) {
  let allRecipes = [];

  const recipeColl = getRecipeCollectionRef();
  await Promise.all(categoryIds.map(async id => {
    const snap = await recipeColl.where('category', '==', id).get();
    if (snap.docs.length) {
      allRecipes = allRecipes.concat(snap.docs);
    }
    return null;    // id does not exist (anymore)
  }))
  //return allRecipes;
  //const snap = await getRecipeCollectionRef().where('category', '==', category).get();
  //const recipes = snap.docs;
  const recipes = allRecipes;
  if (n >= recipes.length) {
    return recipes.map(doc => doc.id);
  } else {
    const ids = [];
    for (let i = 0; i < n; ++i) {
      const recipeIndex = getRandomInt(0, recipes.length);
      const recipeDoc = recipes.splice(recipeIndex, 1)[0];
      ids.push(recipeDoc.id);
    }
    return ids;
  }
}


async function getRecipesById(ids) {
  const recipeColl = getRecipeCollectionRef();

  // get all recipe data of given ids
  return await Promise.all(ids.map(async id => {
    const snap = await recipeColl.where(firebase.firestore.FieldPath.documentId(), '==', id).get();
    if (snap.docs.length) {
      return snap.docs[0].data();
    }
    return null;    // id does not exist (anymore)
  }));
}

async function getHighestRecipeIndex() {
  const recipeColl = getRecipeCollectionRef();
  const snap = await recipeColl.orderBy("index", 'desc').limit(1).get();

  if (snap.docs.length) {
    return snap.docs[0].data().index || 0;
  }
  return 0; // no recipe yet
}

/**
 * Example for recipeData: {title: 'some title'}
 * @param {object} recipeData 
 */
async function addRecipe(recipeData) {
  // TODO: this will cause a race condition. needs transaction.
  let lastIndex = await getHighestRecipeIndex();
  recipeData.index = lastIndex + 1;
  return getRecipeCollectionRef().add(recipeData);
}

async function debugAddRecipes(categoryName, n) {
  const category = getCategoryByName(categoryName);

  // get currently highest index (and keep adding to that index)
  let lastIndex = await getHighestRecipeIndex();

  // add recipes
  const promises = [];

  for (let i = 0; i < n; ++i) {
    const index = ++lastIndex;
    const newRecipePromise = getRecipeCollectionRef().add({
      title: 'recipe-' + index,
      category,
      index
    });
    promises.push(newRecipePromise);
  }

  // wait until all recipes have been added  
  const results = await Promise.all(promises);
  console.log('added ' + n + ' recipes.');
  return results;
}
