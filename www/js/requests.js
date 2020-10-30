function getGroupsBackend(async=true){
	var urlAdminGroups = apiBaseUrl+"/admin/groups";
	$.ajax({
		method: "GET",
		url: urlAdminGroups,
		contentType: "application/json",
		async: async,
		headers : { "authorization" : ("Bearer " + token) },
		success: function(data) {
			localStorage.setItem("groups",JSON.stringify(data.groups));
		},
		error: function() {
			alert('Groups falló');
		}
	});
}
setInterval(getGroupsBackend, 90 * 1000);
function getGroupsLocalStorage(){
	return JSON.parse(localStorage.getItem("groups"));
}
function getGroups(refresh=false){
	var groups = store.state.groups;
	if (groups.length!=0) return groups;
	groups = getGroupsLocalStorage();
	if(groups==null || refresh){
		getGroupsBackend(false);
	}
	return getGroupsLocalStorage();
}


function getUserProfile(uid){
	var urlAdminGroups = apiBaseUrl+"/users/"+uid.toString();
	var response;
	$.ajax({
		method: "GET",
		url: urlAdminGroups,
		contentType: "application/json",
		async: false,
		headers : { "authorization" : ("Bearer " + token) },
		success: function(data) {
			response = data;
		},
		error: function() {
			alert('Groups falló');
		}
	});
	return response;
}


function getUserGroups(uid){
	var urlAdminUsersGroups = apiBaseUrl+"/users/"+uid.toString()+"/groups";
	var userGroups;
	$.ajax({
		method: "GET",
		url: urlAdminUsersGroups,
		contentType: "application/json",
		async: false,
		headers : { "authorization" : ("Bearer " + token) },
		success: function(data) {
			userGroups = data.groups;
		},
		error: function() {
			alert('User\'s Groups falló');
		}
	});
	return userGroups;
}


function deleteGroup(gid){
	if (gid==0){
		alert("Error: group_id = 0");
		return;
	}
	var url = "/admin/groups/"+gid;
	do_request(url, null, true, "DELETE").then(
		function(data) {
			alert('El grupo fue eliminado.');
			if (store.state.currentGroupId.toString()==gid.toString()){
				store.setCurrentGroupId(0);
			}
			refreshEverything();
		}).catch(
			function() {
				alert('Falló la eliminación del grupo.');
			}
		);
}

function changeGroupName(gid,groupName){
	if (gid==0){
		alert("Error: group_id = 0");
		return;
	}
	if(groupName==""){
		alert("Error: el nombre del grupo no puede quedar vacío");
		return;
	}
	var url = "/admin/groups/" + gid.toString(); 
	var payload = { name : groupName, users_to_add : [], users_to_remove : [] };
	do_request(url,payload,true,"PUT").then( refreshEverything ).catch(function(err) {alert('Error, no se pudo renombrar el grupo.') })
}



function deleteMember(gid,uid,role){
	if (gid=="" || gid==0){
		alert("error");
		return;
	}
	var currentName = getGroupNameById(gid);
	var uidnumber = parseInt(uid,10);
	var payload = { name : currentName, users_to_add : [  ], users_to_remove :[{user_id : uidnumber, role : role }] };
	var url = "/admin/groups/" + gid.toString(); 
	function onSuccess(data) {
		//var u = getUserById(uidnumber);
		//alert( "El usuario " + u.user_name + " en su rol de "+ roleInSpanish(role) + " fue removido del grupo " + gid.toString()+": "+encodeHTML(groupName) ); 
		refreshEverything();
		alert("El usuario fue removido del grupo");
	}
	do_request(url,payload,true,"PUT").then( onSuccess ).catch(
		function(err) {
			alert('Error, no se pudo quitar el rol del usuario en el grupo.');
		}
	)
}

function deleteMemberDelegate(gid,uid,role){
	groupName = getGroupNameById(gid);
	if (gid!=""){
		var uidnumber = parseInt(uid,10);
		var payload = { user_id : uidnumber, role : role };
		var url = apiBaseUrl+"/delegate/remove/" + gid.toString(); 
		$.ajax({
			method: "DELETE",
			url: url,
			data : JSON.stringify(payload),
			contentType: "application/json",
			async: false,
			headers : { "authorization" : ("Bearer " + token) },
			success: function(data) {
				alert( "El usuario " + uid + " en su rol de "+ roleInSpanish(role) + " fue removido del grupo " + gid.toString()+": "+encodeHTML(groupName) ); 
			},
			error: function() {
				alert('Error, no se pudo quitar el rol del usuario en el grupo.');
			}
		});
	}else{
		alert("error");
	}
}

function deleteMemberAndDeactivateAdmin(gid,uid,role){
	var error = false;
	groupName = getGroupNameById(gid);
	var uidnumber = parseInt(uid,10);
	if (gid!=""){
		var updateGroup = { name : groupName, users_to_add : [  ], users_to_remove :[{user_id : uidnumber, role : role }] };
		var url = apiBaseUrl+"/admin/groups/" + gid.toString(); 
		$.ajax({
			method: "PUT",
			url: url,
			data : JSON.stringify(updateGroup),
			contentType: "application/json",
			async: false,
			headers : { "authorization" : ("Bearer " + token) },
			success: function(data) {
				return 0;
			},
			error: function() {
				error = true;
			}
		});
	}else{
		error = true;
	}

	var updateGroup = { name : "Usuarios inactivos", users_to_add : [ {user_id : uidnumber, role : role } ], users_to_remove :[] };
	var url = apiBaseUrl+"/admin/groups/1"; 
	$.ajax({
		method: "PUT",
		url: url,
		data : JSON.stringify(updateGroup),
		contentType: "application/json",
		async: false,
		headers : { "authorization" : ("Bearer " + token) },
		success: function(data) {

		},
		error: function() {
			error = true;
		}
	});
	if (error){
		alert("Error al quitar e inactivar.");
		return;
	}
	alert( "El usuario " + uid + " fue inactivado y removido del grupo " + gid.toString()+": "+encodeHTML(groupName) + "en su rol de "+role);
	refreshEverything();
}



function deleteMemberAndDeactivateDelegate(gid,uid,role){
	groupName = getGroupNameById(gid);
	if (gid!=""){
		var uidnumber = parseInt(uid,10);
		var payload = { user_id : uidnumber, role : role };
		var url = apiBaseUrl+"/delegate/deactivate/" + gid.toString(); 
		$.ajax({
			method: "DELETE",
			url: url,
			data : JSON.stringify(payload),
			contentType: "application/json",
			async: false,
			headers : { "authorization" : ("Bearer " + token) },
			success: function(data) {
				alert( "El usuario " + uid + " fue inactivado y removido del grupo " + gid.toString()+": "+encodeHTML(groupName) + "en su rol de "+role); 
			},
			error: function() {
				alert('Error, no se pudo quitar e inactivar.');
			}
		});
	}else{
		alert("error");
	}
}

function ackDelegate(gid,uid,role){
	groupName = getGroupNameById(gid);
	if (gid!=""){
		var uidnumber = parseInt(uid,10);
		var payload = { user_id : uidnumber, role : role };
		var url = apiBaseUrl+"/delegate/ack/" + gid.toString(); 
		$.ajax({
			method: "POST",
			url: url,
			data : JSON.stringify(payload),
			contentType: "application/json",
			async: false,
			headers : { "authorization" : ("Bearer " + token) },
			success: function(data) {
				alert( "El usuario " + uid + " fue marcado como contactado."); 
			},
			error: function() {
				alert('Error, no se pudo marcar al usuario como contactado.');
			}
		});
	}else{
		alert("error");
	}
}



function newGroup(groupName){
	var url = "/admin/groups"; 
	if(groupName==""){
		alert("El nombre del grupo no puede quedar vacío");
		return;
	}	
	var payload = { name : groupName, users : [] };
	do_request(url,payload,true,"POST").then(
		function(data) {
			alert('Grupo creado correctamente!');
			refreshEverything();
		}
	).catch(
		function() {
			alert('Error: el grupo no fue creado.');
		}
	)
}


function postGroup(name, userRoles ){
	var url = apiBaseUrl+"/admin/groups";
	var response;
	if(name!=""){
		var newGroupData = { name : name, users : userRoles };
		$.ajax({
			method: "POST",
			url: url,
			data : JSON.stringify(newGroupData),
			contentType: "application/json",
			async: false,
			headers : { "authorization" : ("Bearer " + token) },
			success: function(data,statusText,xhr) {
				response = xhr.status;
			},
			error: function() {
				response = xhr.status;
			}
		});
		return response;
	}else{
		return 401;
	}
}
function removeUserRolesFromGroup(group_id, groupName, userRoles){
	var updateGroup = { name : groupName, users_to_add : [ ], users_to_remove : userRoles };
	var url = apiBaseUrl+"/admin/groups/" + group_id.toString(); 
	var response;
	$.ajax({
		method: "PUT",
		url: url,
		data : JSON.stringify(updateGroup),
		contentType: "application/json",
		async: false,
		headers : { "authorization" : ("Bearer " + token) },
		success: function(data,statusText,xhr) {
			response = xhr.status;
		},
		error: function() {
			response = xhr.status;
		}
	});
	return response;
}


function getGroup(groupId){
	var urlAdminGroup = apiBaseUrl+"/groups/"+groupId.toString() ;
	var group;
	$.ajax({
		method: "GET",
		url: urlAdminGroup,
		contentType: "application/json",
		async: false,
		headers : { "authorization" : ("Bearer " + token) },
		success: function(data) {
			group = data;
		},
		error: function() {
			alert('Get group falló');
		}
	});
	return group;
}


function addUserRoleToGroup(user_id, role, group_id, groupName){
		var updateGroup = { name : groupName, users_to_add : [ {user_id : user_id, role : role } ], users_to_remove :[] };
		var url = apiBaseUrl+"/admin/groups/" + group_id.toString(); 
		$.ajax({
			method: "PUT",
			url: url,
			data : JSON.stringify(updateGroup),
			contentType: "application/json",
			async: false,
			headers : { "authorization" : ("Bearer " + token) },
			success: function(data) {
				alert( "El usuario " + user_id + " fue agregado al grupo " + group_id.toString()+": "+encodeHTML(groupName) ); 
				refreshEverything();
			},
			error: function() {
				alert('Error, no se pudo agregar el usuario al grupo.');
			}
		});
}

//----------------------------------------------------------------------
// userList 
function getUserListBackend( async=true ){
	var urlAdminUsers = apiBaseUrl+"/admin/users";
	$.ajax({
		method: "GET",
		url: urlAdminUsers,
		contentType: "application/json",
		async: async,
		headers : { "authorization" : ("Bearer " + token) },
		success: function(data) {
			localStorage.setItem("userList",JSON.stringify(data.users));
		},
		error: function() {
			alert('Users falló');
		}
	});
}
setInterval(getUserListBackend, 90 * 1000);
function getUserListLocalStorage(){
	return JSON.parse(localStorage.getItem("userList"));
}
function userList(refresh=false){
	var users = store.state.users;
	if (users.length!=0) return users;
	users = getUserListLocalStorage();
	if(users==null || refresh){
		getUserListBackend(false);
	}
	return getUserListLocalStorage();
}
//----------------------------------------------------------------------

// userRoles
/*
function getUserRolesBackend( async=true ){
	var urlAdminUsers = apiBaseUrl+"/admin/users/roles?only_available=true";
	$.ajax({
		method: "GET",
		url: urlAdminUsers,
		contentType: "application/json",
		async: async,
		headers : { "authorization" : ("Bearer " + token) },
		success: function(data) {
			localStorage.setItem("userRoles",JSON.stringify(data.user_roles));
		},
		error: function() {
			alert('Users falló');
		}
	});
}
setInterval(getUserRolesBackend, 90 * 1000);
function getUserRolesLocalStorage(){
	return JSON.parse(localStorage.getItem("userRoles"));
}
*/
function getUserRoles(refresh=false){
	return store.state.availableUserRoles;
	/*
		var userRoles = store.state.availableUserRoles;
		if (userRoles.length!=0) return userRoles;
		userRoles = getUserRolesLocalStorage();
		if(userRoles==null || refresh){
			getUserRolesBackend(false);
		}
		return getUserRolesLocalStorage();
	*/
}

//----------------------------------------------------------------------

function getUsersFiltered(){
	return store.state.usersFiltered;
}


function addRole(uid,role){
	if(uid==0){
		return;
	}
	var url = "/admin/users/"+ uid.toString() +"/roles";
	do_request(url, {role: role}, true,"POST").then(
		function(data){
			//userList(refresh=true);
			refreshEverything();
		}
	).catch(function(err){
		if (err.code != "user_role_already_exists"){	
			alert("Error no fue posible otorgar el rol ", err.code);
			return;
		}
		refreshEverything();
	});
}

function inactivateUserRole(uid,role){
	addUserRoleToGroup(parseInt(uid,10), role, 1, "Usuarios inactivos"); // esto tiene que coincidir con las constantes del back, mas adelante vamos a tener un endpoint para que el front no necesite saber constantes del back!
}


//------------------------------------------------------
// TODO estas deberían ir en otro archivo, las pongo aca por el orden de carga


function checkHasNoCoordinates(user){
	return user.address.latitude.toString()=="0";
}

function getGroupNameById(groupId){
	g = getElementInOrderedListById(getGroups(), parseInt(groupId,10), "group_id");
	if( g === null ){
		return "";
	}
	return g.name
}

function getGroupAdminEndpointById(groupId){
	return getElementInOrderedListById(getGroups(), parseInt(groupId,10), "group_id");
}


function getUserWithRolesById(uid){
	return getElementInOrderedListById(userList(),uid,"user_id");
}

function getUserById(uid){
	return getElementInOrderedListById(userList(),uid,"user_id");
}

// xs an array of x such that its elements are strictly ordered by x[keyName]
// returns the element x of xs such that x[keyName]=idElement
// null if no  such element
function getElementInOrderedListById(xs,idElement, keyName){
	// busqueda binaria
	a = 0;
	b = xs.length;
	while( b-a > 1){
		c = Math.round( (a+b)/2 );
		if ( xs[c][keyName] > idElement ){
			b=c;
		}else{
			a=c;
		}
	}
	x = xs[a];
	if( x[keyName] == idElement ){
		return x;
	}
	return null;
}

