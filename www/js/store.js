var store = {
  debug: true,
  state: {
    message: 'Hello!',
	groups: [],
	availableUsers: [],
  },
  setMessageAction (newValue) {
    if (this.debug) console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    if (this.debug) console.log('clearMessageAction triggered')
    this.state.message = ''
  },
  setGroups(groups){
	if (this.debug) console.log('setGroups triggered');
	this.state.groups = groups;
  },
  setAvailableUsers(users){
	if (this.debug) console.log('setAvailableUsers triggered');
	this.state.availableUsers = users;
  }

}


setInterval( () => store.setGroups(getGroups()), 15 * 1000);
setInterval( () => store.setAvailableUsers( getUserRoles() ), 15 * 1000);
