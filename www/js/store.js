/*
const vuexLocal = new window.VuexPersistence.VuexPersistence({
    storage: window.localStorage,
});*/


const store = new Vuex.Store({
	state: {
		debug: true,
		currentTab :"",
		currentUserId: 0,
		currentGroupId: 0,
		currentMyGroupId: 0,
		cityFilterValue: "",
		neighborhoodFilterValue: "",
		roleFilterValue: "cook",
		onlyAvailableFilterValue: true,
		usersFiltered: [], // filtered user roles
		systemUserRoles: [], // the roles of the user which is using the system
		groups: [], // all groups
		availableUserRoles: [], // all available user roles
		token:"",
		refreshTime:0,
	},
	mutations: {
		setKey(state, payload) {
			if (state.debug) console.log('storing ', payload.key);
			state[payload.key]=payload.value;
		},
		increaseRefreshTime(state){
			state.refreshTime+=1;
		},
	},
	//plugins: [vuexLocal.plugin,],
	strict: true,
});

function setKey(key, value){
	payload ={key:key, value:value};
	store.commit("setKey",payload);
}


function setRefreshTime(){
	var t = new Date().getTime();
	setKey("refreshTime", t);
}

function setCityFilterValue(city){
	setKey("cityFilterValue",city);
	setUsersFiltered();
}

function setNeighborhoodFilterValue(neighborhood){
	setKey("neighborhoodFilterValue",neighborhood);
	setUsersFiltered();
}

function setRoleFilterValue(role){
	setKey("roleFilterValue",role);
	setUsersFiltered();
}

function setUsersFiltered(){
	if (store.state.debug) console.log('setUsersFiltered');
	var url = "/admin/users/roles?only_available=" + store.state.onlyAvailableFilterValue.toString();
	var currentNeighborhood = store.state.neighborhoodFilterValue;
	var currentCity = store.state.cityFilterValue;
	var currentRole = store.state.roleFilterValue;
	if(currentNeighborhood!=""){
		url+="&neighborhood="+currentNeighborhood;
	}
	if(currentCity!=""){
		url+="&city="+currentCity;
	}
	url+="&role="+currentRole;
	do_request(url,null,true,"GET").then(
		data => {setKey("usersFiltered", data.user_roles);}
	).catch(
		() => console.log("error in setUsersFiltered")
	);
}

// Groups
function setGroupsBackend(){
	var url = "/admin/groups";
	do_request(url, null, true, "GET").then(
		function(data) {
			setKey("groups",data.groups);
		}).catch( function(err) { console.log('Request fall??: '+ url); })
}


// Available user roles
function setAvailableUserRolesBackend(){
	var url = "/admin/users/roles?only_available=true";
	do_request(url, null, true, "GET").then(
		function(data) {
			setKey("availableUserRoles", data.user_roles);
		}).catch( function(err) { console.log('Request fall??: '+ url); })
}


function refreshEverythingBackend(){
	if(store.state.currentTab=="groups"){
		setGroupsBackend();
	}
	if (store.state.currentTab=="users"){
		setGroupsBackend();
		setAvailableUserRolesBackend();
		setUsersFiltered();
	}
}

function refreshEverything() {
	if( store.state.systemUserRoles.indexOf("admin")>=0 ){
		refreshEverythingBackend();
	}
	setRefreshTime();
}

setInterval(refreshEverything, 90 * 1000);

