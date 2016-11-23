angular.module('elfyApp')
.controller('UsersIndexController', UsersIndexController)
.controller('ProfileController', ProfileController)
.controller('UserEditController', UserEditController)
.controller('ProfileEditController', ProfileEditController);

UsersIndexController.$inject = ['User'];
function UsersIndexController(User) {
  const usersIndex = this;

  usersIndex.all = User.query();
}

ProfileController.$inject = ['User', '$state', '$auth', '$http', '$scope', '$rootScope'];
function ProfileController(User, $state, $auth, $http, $scope, $rootScope) {
  const profile = this;
  const userData = $auth.getPayload();
  profile.menuVisible = false;

  $rootScope.$on('$stateChangeStart', () => {
    profile.menuVisible = false;
  });

  function toggleMenu() {
    profile.menuVisible = !profile.menuVisible;
  }

  profile.toggleMenu = toggleMenu;


  let id = $state.params.id;

  profile.usersMatches;

  const usersId = userData._id;


  if (id === '') {
    id = usersId;
  }


  // is user viewing own profile?


  function isOwnProfile() {
    return usersId === id ? true : false;
  }

  User.get({ id }, (user) => {
    profile.user = user;
    profile.randomLike = profile.user.likes[Math.floor(Math.random()*profile.user.likes.length)];
    getGifts(profile.randomLike,'etsy');
  });
  profile.isLoggedIn = $auth.isAuthenticated;




  // const match = ;
  // User.get({match: match._id }, (matchedUser) => {
  //   profile.match = matchedUser;
  // });



  function addLikes() {
    event.preventDefault();

    if(!profile.user.likes.includes(profile.likeToAddToArray)) {

      profile.user.likes.push(profile.likeToAddToArray);
      profile.likeToAddToArray = '';
      profile.user.$update((res) => {
        return res;
      });
      profile.message = '';
    } else {
      profile.message = 'You already like that';
    }
  }

  function addDislikes() {
    event.preventDefault();

    if(!profile.user.dislikes.includes(profile.dislikeToAddToArray)) {

      profile.user.dislikes.push(profile.dislikeToAddToArray);
      profile.dislikeToAddToArray = '';
      profile.user.$update((res) => {
        return res;
      });
      profile.message = '';
    } else {
      profile.message = 'You already dislike that';
    }
  }

  // function deleteLike($index) {
  //   console.log(profile);
  //   profile.user.likes.$remove(() => {
  //     $state.go('profile');
  //   });
  // }

  function removeLike(thing, index) {

    const $index = profile.user.likes.indexOf(thing);
    profile.user.likes.splice($index, 1);
    profile.user.$update(() => {
      $state.reload();
    });
  }

  function removeDislike(thing, index) {
    const $index = profile.user.dislikes.indexOf(thing);
    profile.user.dislikes.splice($index, 1);
    profile.user.$update(() => {
      $state.reload();
    });
  }
  // profile.remove = remove;

  function addImage() {

    profile.user.profileImage = profile.imageToAdd;

    profile.user.$update(() => {
      $state.reload();

    });
  }


  function getUserGroups() {
    profile.usersGroups =[];
    const requestURL = 'users/groups/' + id;
    $http({
      url: requestURL,
      method: 'GET'
    }).then((data) => {
      profile.usersGroups = data.data;

    }, (response)  => {
      console.log(response);
    });
  }

  function searchForMatch(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
      if (myArray[i]['match'] === nameKey) {
        return myArray[i];
      }
    }
  }


  function getUserMatches() {
    profile.usersCurrentMatches ={};
    profile.usersMatches = [];
    const requestURL = 'users/groups/' + id;
    $http({
      url: requestURL,
      method: 'GET'
    }).then((data) => {
      profile.usersCurrentMatches = data.data;
      profile.usersCurrentMatches.forEach((obj)=>{
        const resultObject = searchForMatch(id, obj.matches);
        if (resultObject !== undefined) {
          profile.usersMatches.push(resultObject);
        }
      });
    }, (response)  => {
      console.log(response);
    });
  }

  function getGifts(keyword,site) {
    profile.loaded = false;
    profile.giftArray =[];
    profile.site = site;

    const requestURL = '/gifts/'+site+'/'+keyword;

    if (site === 'amazon') {

      return $http({
        url: requestURL,
        method: 'GET'
      }).then((data) => {
        profile.giftArray = data.data.Items.Item.splice(0,12);
        profile.loaded = true;

      }, (response)  => {
        console.log(response);
      });
    } else if (site === 'etsy') {

      return $http({
        url: requestURL,
        method: 'GET'
      }).then((data) => {

        profile.loaded = true;

        for (let i=0; i < 12 && i < data.data.results.length; i++) {

          // transpose ETSY formatted response in amzn response format & add to giftArray
          const etsyItem = {
            DetailPageURL: data.data.results[i].url,
            MediumImage: {
              URL: data.data.results[i].MainImage.url_170x135
            },
            ItemAttributes: {
              ListPrice: {
                FormattedPrice: data.data.results[i].price
              }
            }
          };
          profile.giftArray.push(etsyItem);
        }
        console.log(profile.giftArray);

      }, (response)  => {
        console.log(response);
      });
    }


  }
  getUserGroups();
  getUserMatches();

  profile.add = addLikes;
  profile.getGifts = getGifts;
  profile.addDislikes = addDislikes;
  profile.removeLike = removeLike;
  profile.removeDislike = removeDislike;

  profile.isOwnProfile = isOwnProfile;
  profile.giftArray = [];
  profile.loaded = false;
  profile.addImage = addImage;


}

ProfileEditController.$inject = ['User', '$state'];
function ProfileEditController(User, $state) {
  const profileEdit = this;
  profileEdit.profile = User.get($state.params);
  function update() {
    User.update(profileEdit.profile, () => {
      $state.go('profile', $state.params);
    });
  }
  this.update = update;
}

UserEditController.$inject = ['User', '$state'];
function UserEditController(User, $state) {
  const userEdit = this;

  userEdit.user = User.get($state.params);

  function update() {
    userEdit.user.$update(() => {
      $state.go('usersShow', $state.params);

    });
  }

  this.update = update;

}
