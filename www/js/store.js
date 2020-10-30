var store = {
	debug: true,
	state: {
		groups: [],
		availableUserRoles: [],
		users: [],
		currentUserId: 0,
		currentGroupId: 0,
		currentTab :"",
		refreshTime:0,
	},


	// CurrentUserId
	setCurrentUserId(uid){
		if (this.debug) console.log('setCurrentUserId ',uid);
		this.state.currentUserId  = uid;
	},
	// CurrentGroupId
	setCurrentGroupId(gid){
		if (this.debug) console.log('setCurrentGroupId ',gid);
		this.state.currentGroupId  = gid;
	},
	// CurrentTab
	setCurrentTab(tab){
		if (this.debug) console.log('setCurrenTab ',tab);
		this.state.currentTab  = tab;
	},
	// RefreshTime
	setRefreshTime(){
		if (this.debug) console.log('setRefreshTime ');
		this.state.refreshTime  = new Date().getTime();
	},
	

	// Groups
	setGroups(groups){
		if (this.debug) console.log('setGroups ');
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
		if (this.debug) console.log('setAvailableUserRoles ');
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
		if (this.debug) console.log('setUsers ');
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
	},
	refreshEverythingBackend(){
		this.setGroupsBackend();
		this.setAvailableUserRolesBackend();
		this.setUsersBackend();
		this.setRefreshTime();
	}
}


function refreshEverything() {
	if (currentSystem=="admin"){
		store.refreshEverythingBackend();
	}

}
setInterval( refreshEverything, 90 * 1000);
