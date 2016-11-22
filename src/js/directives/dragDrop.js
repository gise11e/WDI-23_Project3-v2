angular.module('elfyApp')
  .directive('dragDrop', dragDrop);

function dragDrop () {

  const reader = new FileReader();

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/dragDrop.html',
    scope: {
      base64: '='
    },
    link($scope, element) {

      $scope.base64 = null;
      $scope.active = false;

      reader.onload = () => {
        $scope.base64 = reader.result;
        $scope.$apply();
      };


      element
        .on('dragover', () => {
          $scope.active = true;
          $scope.$apply();
          console.log('yo you are hovering');
        })
        .on('dragover', (e) => {
          e.preventDefault();
        })
        .on('dragleave', () => {
          $scope.active = false;
          $scope.$apply();
        })
        .on('drop', (e) => {
          e.preventDefault();
          console.log('you dropped');
          const file = (e.dataTransfer.files || e.target.files)[0];

          reader.readAsDataURL(file);
        });
    }
  };
}
