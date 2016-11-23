angular.module('elfyApp')
.controller('GroupsNewController', GroupsNewController)
.controller('GroupsShowController', GroupsShowController)
.controller('GroupsEditController', GroupsEditController)
.controller('GroupsJoinController', GroupsJoinController);
// .controller('groupController', groupController);

GroupsNewController.$inject = ['Group', '$state', '$auth'];
function GroupsNewController(Group, $state, $auth) {
  const groupsNew = this;
  groupsNew.group = {};
  groupsNew.group.groupMembers= [];


  function createGroupProfile() {
    groupsNew.group.groupAdmin = $auth.getPayload()._id;
    groupsNew.group.groupMembers.push($auth.getPayload()._id);


    Group.save(groupsNew.group, (res) => {

      $state.go('groupProfile',{id: res._id});

    });
  }

  function addEmail() {
    event.preventDefault();
    groupsNew.emailArray.push(groupsNew.emailToAddToArray);
  }

  groupsNew.createGroupProfile = createGroupProfile;
  groupsNew.add = addEmail;
}

GroupsShowController.$inject = ['Group', '$state', '$auth', '$http'];
function GroupsShowController(Group, $state, $auth, $http) {
  const groupsShow = this;
  // console.log(groupsShow);
  groupsShow.group = Group.get($state.params);

  groupsShow.emailToAddToArray = '';
  groupsShow.emailArray = [];

  function drawMatches() {
    const token = `Bearer ${$auth.getToken()}`;
    const req = {
      method: 'PUT',
      url: '/groups/' + groupsShow.group._id + '/draw',
      headers: { authorizaton: token }
    };
    $http(req).then(() => alert('members matched - check your email!'));
  }

  const userData = $auth.getPayload();
  const usersId = userData._id;

  function isGroupAdmin() {
    console.log('Group admin ID:', groupsShow.group.groupAdmin._id, 'Users ID', usersId);
    console.log(groupsShow.group.groupAdmin._id === usersId ? true : false);
    return groupsShow.group.groupAdmin._id === usersId ? true : false;
  }

  function addEmail() {
    groupsShow.message ='';
    if(!groupsShow.emailArray.includes(groupsShow.emailToAddToArray)) {
      groupsShow.emailArray.push(groupsShow.emailToAddToArray);
      groupsShow.emailToAddToArray = '';

    } else {
      groupsShow.message = 'Email already added';
    }
  }
  function sendEmail() {
    console.log(groupsShow);
    const token = `Bearer ${$auth.getToken()}`;
    const req = {
      method: 'POST',
      url: '/sendEmail',
      headers: { authorizaton: token },
      data: { emailArray: groupsShow.emailArray, groupName: groupsShow.group.groupName, groupId: groupsShow.group._id }
    };

    $http(req)
    .then((res) => {
      groupsShow.emailArray = [];
      groupsShow.message = 'Your Invites Have Been Sent!';
      console.log(res);
    });
  }

  function deleteGroup() {
    groupsShow.group.$remove(() => {
      $state.go('groupsNew');
    });
  }

  groupsShow.delete = deleteGroup;
  groupsShow.isLoggedIn = $auth.isAuthenticated;
  groupsShow.addEmail = addEmail;
  groupsShow.sendEmail = sendEmail;
  groupsShow.drawMatches = drawMatches;
  groupsShow.isGroupAdmin = isGroupAdmin;
}


GroupsEditController.$inject = ['Group', '$state'];
function GroupsEditController(Group, $state) {
  const groupEdit = this;

  groupEdit.group = Group.get($state.params);

  function update() {
    groupEdit.group.$update(() => {
      $state.go('groupEdit', $state.params);
    });
  }

  this.update = update;

}



GroupsJoinController.$inject = ['Group', 'User','$state', '$auth', '$window'];
function GroupsJoinController(Group, User, $state, $auth, $window) {

  // check if user is logged in...
  if($auth.isAuthenticated()) {
    const userId = $auth.getPayload()._id;
    const groupId = $state.params.groupId;
    // if yes, get the group
    Group.get({ id: groupId }, (group) => {

      const isInGroup = group.groupMembers.filter(function(member){
        return member._id === userId;
      });

      if (isInGroup.length === 0) {
        group.groupMembers.push(userId);
        group.$update(() => {
          $state.go('groupProfile', {id: groupId });
        });

      } else {
        $state.go('groupProfile', {id: groupId });
      }
    });
  } else {
    console.log('hey');
    // if no, store the group Id in localStorage, redirect the user to login/register state(s)
    $window.localStorage.setItem('groupId', $state.params.groupId);
    $state.go('register');
  }

  // after login/register, if there is a group Id in localStorage, send the join request & remove the group Id



}
