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
	setRefreshTime(){
		var t = new Date().getTime();
		this.setKey("refreshTime",t);		
	},
	setCityFilterValue(city){
		this.setKey("cityFilterValue",city);
		this.setUsersFiltered();
	},
	setNeighborhoodFilterValue(neighborhood){
		this.setKey("neighborhoodFilterValue",neighborhood);
		this.setUsersFiltered();
	},
	setRoleFilterValue(role){
		this.setKey("roleFilterValue",role);
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
				store.setKey("usersFiltered", data.user_roles.filter(filterRoles));
			}
		).catch(
			()=>console.log("error in setUsersFiltered")
		)
	},
	// Groups
	setGroupsBackend(){
		var url = "/admin/groups";
		do_request(url, null, true, "GET").then(
			function(data) {
				localStorage.setItem("storedGroups",JSON.stringify(data.groups));
				store.setKey("groups",data.groups);
			}).catch( function(err) { console.log('Request falló: '+ url); })
	},
	setGroupsLocalStorage(){
		var r = JSON.parse(localStorage.getItem("storedGroups"));
		if ( r !== null ){
			this.setKey("groups", r);
		}
	},
	// Available user roles
	setAvailableUserRolesBackend(){
		var url = "/admin/users/roles?only_available=true";
		do_request(url, null, true, "GET").then(
			function(data) {
				localStorage.setItem("storedUserRoles",JSON.stringify(data.user_roles));
				store.setKey("availableUserRoles", data.user_roles);
			}).catch( function(err) { console.log('Request falló: '+ url); })
	},
	setAvailableUserRolesLocalStorage(){
		var r = JSON.parse(localStorage.getItem("storedUserRoles"));
		if ( r !== null ){
			this.setKey("availableUserRoles", r);
		}
	},
	// Users
	setUsersBackend(){
		var url = "/admin/users";;
		do_request(url, null, true, "GET").then(
			function(data) {
				localStorage.setItem("storedUsers",JSON.stringify(data.users));
				store.setKey("users", data.users);
			}).catch( function(err) { console.log('Request falló: '+ url); })
	},
	setUsersLocalStorage(){
		var r = JSON.parse(localStorage.getItem("storedUsers"));
		if ( r !== null ){
			this.setKey("users", r);
		}
	},
	// function to recover everything from the local storage
	recoverStateFromLocalStorage(){
		console.log("recovering state from local storage");
		this.setGroupsLocalStorage();
		this.setAvailableUserRolesLocalStorage();
		this.setUsersLocalStorage();
		store.setRefreshTime();
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
setInterval(refreshEverything, 90 * 1000);
