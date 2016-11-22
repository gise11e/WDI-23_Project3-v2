angular.module('elfyApp')
  .factory('Group', Group);

Group.$inject = ['$resource'];
function Group($resource) {

  return new $resource('/groups/:id', { id: '@_id' }, {
    update: { method: 'PUT' },
    getGroups: {method: 'GET', isArray: true}
  });
}
