angular.module('elfyApp')

.controller('MainController', MainController);

MainController.$inject = ['$auth', '$state', '$rootScope', '$http'];
function MainController($auth, $state, $rootScope, $http) {
  const main = this;

  main.isLoggedIn = $auth.isAuthenticated;
  main.message = null;
  main.menuVisible = false;


function toggleMenu() {
  if (main.menuVisible === false) {
    main.menuVisible = true;
  } else {
    main.menuVisible = false;
  }
}

  function logout() {
    $auth.logout()
    .then(() => {
      localStorage.removeItem('userId');
      main.menuVisible = true;
      $state.go('splash');

    });
  }

  // const protectedStates = ['register', 'login'];

  // function secureState(e, toSate) {
  //   main.message = null;
  //   if(!$auth.isAuthenticated() && protectedStates.includes(toSate.name)) {
  //     e.preventDefault();
  //     $state.go('login');
  //     main.message = 'You must be logged in to go there!';
  //
  //   }
  //
  // }
  //
  // $rootScope.$on('$stateChangeStart', secureState);

  main.logout = logout;
  main.toggleMenu = toggleMenu;


}
