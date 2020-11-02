var store = {
	debug: true,
	state: {
		currentTab :"",

		currentUserId: 0,
		currentGroupId: 0,
		
		cityFilterValue: "",
		neighborhoodFilterValue: "",
		roleFilterValue: "cook",
		onlyAvailableFilterValue: true,
		usersFiltered: [], // filtered user roles

		groups: [], // all groups
		availableUserRoles: [], // all available user roles
		users: [], // all users

		token:"",
		refreshTime:0,
	},
	setKey(key,value){
		if (this.debug) console.log('storing ', key);
		this.state[key]=value;
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
		var t = new Date().getTime();
		if (this.debug) console.log('setRefreshTime ', t);
		this.state.refreshTime  = t;
	},

	setCityFilterValue(city){
		if (this.debug) console.log('setCityFilterValue ',city);
		this.state.cityFilterValue=city;
		this.setUsersFiltered();
	},
	setNeighborhoodFilterValue(neighborhood){
		if (this.debug) console.log('setNeighborhoodFilterValue ',neighborhood);
		this.state.neighborhoodFilterValue=neighborhood;
		this.setUsersFiltered();
	},
	setRoleFilterValue(role){
		if (this.debug) console.log('setRoleFilterValue ',role);
		this.state.roleFilterValue=role;
		this.setUsersFiltered();
	},
	setUsersFiltered(){
		if (this.debug) console.log('setUsersFiltered');
		var url = "/admin/users/roles?only_available=" + this.state.onlyAvailableFilterValue.toString();
		var currentNeighborhood = this.state.neighborhoodFilterValue;
		var currentCity = this.state.cityFilterValue;
		if(currentNeighborhood!=""){
			url+="&neighborhood="+currentNeighborhood;
		}
		if(currentCity!=""){
			url+="&city="+currentCity;
		}

		do_request(url,null,true,"GET").then(
			function(data){
				currentRole = store.state.roleFilterValue;
				function filterRoles(u){
					return currentRole == u.role;
				};
				store.state.usersFiltered = data.user_roles.filter(filterRoles);
			}
		).catch(
			()=>console.log("error in setUsersFiltered")
		)
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
		this.setUsersFiltered();
	}
}


function refreshEverything() {
	if (store.state.currentSystem=="admin"){
		store.refreshEverythingBackend();
	}
	store.setRefreshTime();
}
setInterval( refreshEverything, 90 * 1000);