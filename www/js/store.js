var store = {
	debug: true,
	state: {
		groups: [],
		availableUserRoles: [],
		users: [],
		currentUserId: 0,
	},
	// CurrentUserId
	setCurrentUserId(uid){
		if (this.debug) console.log('setCurrentUserId triggered');
		this.state.currentUserId  = uid;
	},

	// Groups
	setGroups(groups){
		if (this.debug) console.log('setGroups triggered');
		this.state.groups = groups;
	},
	setGroupsBackend(){
		var url = "/admin/groups";
		do_request(url, null, true, "GET").then(
			function(data) {
				localStorage.setItem("storedGroups",JSON.stringify(data.groups));
				store.setGroups(data.groups);
			}).catch( function(err) { console.log('Request falló: '+ url); })
	},
	setGroupsLocalStorage(){
		var r = JSON.parse(localStorage.getItem("storedGroups"));
		if ( r == null ){
			this.setGroupsBackend();
		}else{
			this.setGroups( r );
		}
	},


	// Available user roles
	setAvailableUserRoles(value){
		if (this.debug) console.log('setAvailableUserRoles triggered');
		this.state.availableUserRoles = value;
	},
	setAvailableUserRolesBackend(){
		var url = "/admin/users/roles?only_available=true";
		do_request(url, null, true, "GET").then(
			function(data) {
				localStorage.setItem("storedUserRoles",JSON.stringify(data.user_roles));
				store.setAvailableUserRoles(data.user_roles);
			}).catch( function(err) { console.log('Request falló: '+ url); })
	},
	setAvailableUserRolesLocalStorage(){
		var r = JSON.parse(localStorage.getItem("storedUserRoles"));
		if ( r == null ){
			this.setAvailableUserRolesBackend();
		}else{
			this.setAvailableUserRoles( r );
		}
	},

	// Users
	setUsers(value){
		if (this.debug) console.log('setUsers triggered');
		this.state.users = value;
	},
	setUsersBackend(){
		var url = "/admin/users";;
		do_request(url, null, true, "GET").then(
			function(data) {
				localStorage.setItem("storedUsers",JSON.stringify(data.users));
				store.setUsers(data.users);
			}).catch( function(err) { console.log('Request falló: '+ url); })
	},
	setUsersLocalStorage(){
		var r = JSON.parse(localStorage.getItem("storedUsers"));
		if ( r == null ){
			this.setUsersBackend();
		}else{
			this.setUsers( r );
		}
	},


	// function to recover everything from the local storage
	recoverStateFromLocalStorage(){
		this.setGroupsLocalStorage();
		this.setAvailableUserRolesLocalStorage();
		this.setUsersLocalStorage();
	}
}

setInterval( () => store.setGroups(getGroups()), 15 * 1000);
setInterval( store.setAvailableUserRolesBackend, 90 * 1000);
setInterval( store.setUsersBackend, 90 * 1000);

