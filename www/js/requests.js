function login(userName, password){
	var loginData = { user_name: userName, password : password };
	var url ="/auth/login";
	return do_request(url, loginData, false, "POST");
}

function getUserProfile(uid){
	return do_request("/users/"+uid.toString(), null, true,"GET");
}


function getUserGroups(uid){
	var urlAdminUsersGroups = "/users/"+uid.toString()+"/groups";
	return do_request(urlAdminUsersGroups, null, true, "GET");
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

function deleteGroupAndInactivateMembers(gid){
	if (gid==0){
		alert("Error: group_id = 0");
		return;
	}
	var url = "/admin/groups/"+gid+"/inactivate";
	do_request(url, null, true, "DELETE").then(
		function(data) {
			alert('El grupo fue eliminado correctamente.');
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



function combineGroups(gid1,gid2,combinedGroupName){
	var url = "/admin/groups/combine";
	var payload = { combined_group_name : combinedGroupName, first_group_id : gid1, second_group_id : gid2 };
	do_request(url, payload, true, "POST").then(
		function(data) {
			alert('El grupo fue combinado correctamente');
			store.setKey("currentGroupId", data["group_id"] );
			refreshEverything(); 
		}).catch(
			function() {
				alert('Falló la combinación de grupos.');
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
			//alert("El usuario fue removido del grupo");
		}
		var onError = function(err) {
			refreshEverything();
			//alert('Error, no se pudo quitar el rol del usuario en el grupo.');
		}
		do_request(url,payload,true,"DELETE").then( onSuccess ).catch( onError );
	}else{
		alert("error");
	}
}

function deleteMemberAndDeactivateAdmin(gid,uid,role){
	var errorCount = 0;
	var successCount=0;	
	var groupName = getGroupNameById(gid);
	var uidnumber = parseInt(uid,10);
	var onError = function(){
		if (errorCount==0){
			alert("Error al quitar e inactivar.");
		}
		errorCount++;
	}
	var onSuccess = function(){
		successCount++;
		if (successCount==2){
			alert( "El usuario " + uid + " fue inactivado y removido del grupo " + gid.toString()+": "+encodeHTML(groupName) + "en su rol de "+roleInSpanish(role));
			refreshEverything();
		}
	}
	if (gid!=""){
		var payloadRemove = { name : groupName, users_to_add : [  ], users_to_remove :[{user_id : uidnumber, role : role }] };
		var urlRemove = "/admin/groups/" + gid.toString(); 
		do_request(urlRemove, payloadRemove, true, "PUT").then(onSuccess).catch(onError);
		var payloadAdd = { name : "Usuarios inactivos", users_to_add : [ {user_id : uidnumber, role : role } ], users_to_remove :[] };
		var urlAdd = "/admin/groups/1"; 
		do_request(urlAdd,payloadAdd,true,"PUT").then(onSuccess).catch(onError);
	}
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
		//alert( "El usuario fue inactivado y removido del grupo."); 
	}
	var onError = function(err) {
		refreshEverything();
		//alert('Error, no se pudo quitar e inactivar.');
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
			//alert( "El usuario " + uid + " fue marcado como contactado.");
			refreshEverything();
	}
	var onError = function(err) {
			//alert('Error, no se pudo marcar al usuario como contactado.');
			refreshEverything();
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
	var urlAdminGroup = "/groups/"+groupId.toString() ;
	return do_request(urlAdminGroup, null, true, "GET");
}


function addUserRoleToGroup(userId, role, groupId, groupName){
	var payload = { name : groupName, users_to_add : [ {user_id : parseInt(userId,10), role : role } ], users_to_remove :[] };
	var url = "/admin/groups/" + groupId.toString();
	var onSuccess = function(data) {
		alert( "El usuario " + userId + " fue agregado al grupo " + groupId.toString()+": "+encodeHTML(groupName) ); 
		refreshEverything();
	}
	var onError = function(){
		alert('Error, no se pudo agregar el usuario al grupo.');
		console.log("Error al agregar al grupo (userId,groupId,role,groupName): ",userId, groupId, role, groupName);
	}
	console.log("addUserRoleToGroup: ", url, payload);
	do_request(url, payload, true, "PUT").then(onSuccess).catch(onError);
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

function inactivateUserRole(userId,role){
	addUserRoleToGroup(parseInt(userId,10), role, 1, "Usuarios inactivos"); // esto tiene que coincidir con las constantes del back, mas adelante vamos a tener un endpoint para que el front no necesite saber constantes del back!
}

function getGroupNameById(groupId){
	g = getElementInOrderedListById(store.state.groups, parseInt(groupId,10), "group_id");
	if( g === null ){
		return "";
	}
	return g["name"];
}

function getGroupAdminEndpointById(groupId){
	return getElementInOrderedListById(store.state.groups, parseInt(groupId,10), "group_id");
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

