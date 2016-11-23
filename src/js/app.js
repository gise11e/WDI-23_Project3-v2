angular
.module('elfyApp', ['ngMessages', 'ngResource', 'ui.router', 'satellizer'])
.config(Router)
.config(Auth);


Router.$inject = ['$stateProvider', '$urlRouterProvider'];
function Router($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('splash', {
    url: '/',
    templateUrl: '/templates/splash.html',
    controller: 'LoginController as login'
  })
  .state('profile', {
    url: '/profile/:id',
    templateUrl: '/templates/profile.html',
    controller: 'ProfileController as profile'
  })
  .state('groupsNew', {
    url: '/group/new',
    templateUrl: '/templates/groupNew.html',
    controller: 'GroupsNewController as groupsNew'
  })
  .state('groupProfile', {
    url: '/group/profile/:id',
    templateUrl: '/templates/groupProfile.html',
    controller: 'GroupsShowController as groupsShow'
  })
  .state('groupsEdit', {
    url: '/group/profile/:id/edit',
    templateUrl: '/templates/groupsEdit.html',
    controller: 'GroupsEditController as groupsEdit'
  })
  .state('register', {
    url: '/register',
    templateUrl: '/templates/register.html',
    controller: 'RegisterController as register'
  })
  .state('login', {
    url: '/login',
    templateUrl: '/templates/login.html',
    controller: 'LoginController as login'
  })
  .state('groupJoin', {
    url: '/join/:groupId',
    templateUrl: '/templates/login.html',
    controller: 'GroupsJoinController as groupsJoin'
  })
  .state('profileEdit', {
    url: '/profile/:id/edit',
    templateUrl: '/templates/profileEdit.html',
    controller: 'ProfileEditController as profileEdit'
  })
  .state('groupEdit', {
    url: '/group/:id/edit',
    templateUrl: '/templates/groupEdit.html',
    controller: 'GroupEditController as groupEdit'
  });

  $urlRouterProvider.otherwise('/');

}

Auth.$inject = ['$authProvider'];
function Auth($authProvider) {
  $authProvider.loginUrl = '/login';
  $authProvider.signupUrl = '/register';

  $authProvider.tokenPrefix = '';

  $authProvider.facebook({
    clientId: '1117238161723560'
  });

  console.log($authProvider);

}
