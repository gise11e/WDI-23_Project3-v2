angular.module('elfyApp')
.controller('RegisterController', RegisterController)
.controller('LoginController', LoginController);

RegisterController.$inject = ['$auth', '$state'];
function RegisterController($auth, $state) {
  const register = this;
  register.user = {};

  function submit() {
    $auth.signup(register.user)
    .then(() => {
      $state.go('login');
    }).catch((response) => {
      console.log(response);
    });
  }

  register.submit = submit;
}


LoginController.$inject = ['User','$auth','$state', '$window'];

function LoginController(User, $auth, $state, $window) {
  const login = this;
  login.credentials = {};

  //forward state if authenticated
  if($auth.isAuthenticated()) {
    $state.go('profile');
  }

  function submit() {
    $auth.login(login.credentials)
    .then(() => {
      const payload = $auth.getPayload();
      const groupId = $window.localStorage.getItem('groupId');

      $window.localStorage.setItem('userId', payload._id);

      if(groupId) {
        $window.localStorage.removeItem('groupId');
        $state.go('groupJoin', { groupId });
      } else {
        $state.go('profile');
      }
    });
  }

  function authenticate(provider) {
    $auth.authenticate(provider)
    .then(() => {
      $state.go('profile');
    });
  }


  login.submit = submit;
  login.authenticate = authenticate;
}
