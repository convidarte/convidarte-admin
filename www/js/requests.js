function getUserProfile(uid){
	var urlAdminGroups = apiBaseUrl+"/users/"+uid.toString();
	var response;
	$.ajax({
		method: "GET",
		url: urlAdminGroups,
		contentType: "application/json",
		async: false,
		headers : { "authorization" : ("Bearer " + store.state.token) },
		success: function(data) {
			response = data;
		},
		error: function() {
			console.log('Get user profile falló');
		}
	});
	return response;
}


function getUserGroups(uid){
	if (! uid) {return [];}
	var urlAdminUsersGroups = apiBaseUrl+"/users/"+uid.toString()+"/groups";
	var userGroups;
	$.ajax({
		method: "GET",
		url: urlAdminUsersGroups,
		contentType: "application/json",
		async: false,
		headers : { "authorization" : ("Bearer " + store.state.token) },
		success: function(data) {
			userGroups = data.groups;
		},
		error: function() {
			console.log('User\'s Groups falló');
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
				store.setKey("currentGroupId", 0);
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
	if (gid!=""){
		var uidnumber = parseInt(uid,10);
		var payload = { user_id : uidnumber, role : role };
		var url = "/delegate/remove/" + gid.toString(); 
		var onSuccess = function(data) {
			refreshEverything();
			alert("El usuario fue removido del grupo");
		}
		var onError = function(err) {
			alert('Error, no se pudo quitar el rol del usuario en el grupo.');
		}
		do_request(url,payload,true,"DELETE").then( onSuccess ).catch( onError );
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
			headers : { "authorization" : ("Bearer " + store.state.token) },
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
		headers : { "authorization" : ("Bearer " + store.state.token) },
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
	if (gid==""){
		alert("error");
		return;
	}
	var uidnumber = parseInt(uid,10);
	var payload = { user_id : uidnumber, role : role };
	var url = "/delegate/deactivate/" + gid.toString();
	var onSuccess = function(data) {
		refreshEverything();
		alert( "El usuario fue inactivado y removido del grupo."); 
	}
	var onError = function(err) {
		alert('Error, no se pudo quitar e inactivar.');
	}
	do_request(url,payload,true,"DELETE").then( onSuccess ).catch( onError );
}

function ackDelegate(gid,uid,role){
	groupName = getGroupNameById(gid);
	if (gid==""){
		alert("error");
		return
	}
	var uidnumber = parseInt(uid,10);
	var payload = { user_id : uidnumber, role : role };
	var url = "/delegate/ack/" + gid.toString();
	var onSuccess = function(data) {
			alert( "El usuario " + uid + " fue marcado como contactado.");
			refreshEverything();
	}
	var onError = function(err) {
			alert('Error, no se pudo marcar al usuario como contactado.');
	}
	do_request(url,payload,true,"POST").then( onSuccess ).catch( onError );
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
	if(name!=""){
		return do_request("/admin/groups",{ name : name, users : userRoles }, true,"POST");
	}
}

function removeUserRolesFromGroup(group_id, groupName, userRoles){
	if (groupName!=""){
		var url = "/admin/groups/" + group_id.toString(); 
		var updateGroup = { name : groupName, users_to_add : [ ], users_to_remove : userRoles };
		return do_request(url,updateGroup, true,"PUT");
	}
}


function getGroup(groupId){
	var urlAdminGroup = apiBaseUrl+"/groups/"+groupId.toString() ;
	var group=null;
	$.ajax({
		method: "GET",
		url: urlAdminGroup,
		contentType: "application/json",
		async: false,
		headers : { "authorization" : ("Bearer " + store.state.token) },
		success: function(data) {
			group = data;
		},
		error: function() {
			console.log('Get group falló');
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
			async: true,
			headers : { "authorization" : ("Bearer " + store.state.token) },
			success: function(data) {
				alert( "El usuario " + user_id + " fue agregado al grupo " + group_id.toString()+": "+encodeHTML(groupName) ); 
				refreshEverything();
			},
			error: function() {
				alert('Error, no se pudo agregar el usuario al grupo.');
				console.log("error",user_id, group_id, role, groupName);
			}
		});
}



function addRole(uid,role){
	if(uid==0){
		return;
	}
	var url = "/admin/users/"+ uid.toString() +"/roles";
	do_request(url, {role: role}, true,"POST").then(
		function(data){
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

function getGroupNameById(groupId){
	g = getElementInOrderedListById(store.state.groups, parseInt(groupId,10), "group_id");
	if( g === null ){
		return "";
	}
	return g.name
}

function getGroupAdminEndpointById(groupId){
	return getElementInOrderedListById(store.state.groups, parseInt(groupId,10), "group_id");
}

function getUserById(uid){
	return getElementInOrderedListById(store.state.users, uid, "user_id");
}

// xs an array of x such that its elements are strictly ordered by x[keyName]
// returns the element x of xs such that x[keyName]=idElement
// null if no  such element
function getElementInOrderedListById(xs,idElement, keyName){
	// busqueda binaria
	a = 0;
	b = xs.length;
	if (b==0) return null;
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

