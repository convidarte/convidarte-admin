function getGroups(){
	var urlAdminGroups = apiBaseUrl+"/admin/groups";
	$.ajax({
		method: "GET",
		url: urlAdminGroups,
		contentType: "application/json",
		async: false,
		headers : { "authorization" : ("Bearer " + token) },
		success: function(data) {
			groups = data.groups;
		},
		error: function() {
			alert('Groups falló');
		}
	});
	return groups;
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



function deleteGroupOnClick() {
	// TODO separar en request y parte de leer html
	boton = event.target;
	gid = boton.value;
	if (currentGroupId.toString()==gid.toString()){
		currentGroupId=0;
		if (currentTab=="groups"){
			document.getElementById("ppal").innerHTML="<h2>Clickear en \"Detalle\" para ver el detalle de los usuarios de un grupo</h2>";
		}
	}
	var r = confirm("Seguro que quiere eliminar el grupo "+ gid.toString() +"?");
	if (r){
		var url = apiBaseUrl+"/admin/groups/"+gid; 
		$.ajax({
			method: "DELETE",
			url: url,
			contentType: "application/json",
			async: false,
			headers : { "authorization" : ("Bearer " + token) },
			success: function(data) {
				alert('El grupo fue eliminado.');
				refreshEverything();
			},
			error: function() {
				alert('Falló la eliminación del grupo.');
			}
		});
	}
}

function changeGroupName(){
	// TODO separar en request y parte de leer html
	var groupName = document.getElementById("newName").value;
	if (currentGroupId !=0 && groupName!=""){
		var updateGroup = { name : groupName, users_to_add : [], users_to_remove : [] };
		var url = apiBaseUrl+"/admin/groups/" + currentGroupId.toString(); 
		$.ajax({
			method: "PUT",
			url: url,
			data : JSON.stringify(updateGroup),
			contentType: "application/json",
			async: false,
			headers : { "authorization" : ("Bearer " + token) },
			success: function(data) {
				refreshEverything();
			},
			error: function() {
				alert('Error, no se pudo renombrar el grupo.');
			}
		});

		refreshEverything();
	}else{
		alert("error");
	}
}

function deleteMember(gid,uid,role){
	groupName = getGroupNameById(gid);
	if (gid!=""){
		var uidnumber = parseInt(uid,10);
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
				alert( "El usuario " + uid + " en su rol de "+role+ " fue removido del grupo " + gid.toString()+": "+encodeHTML(groupName) ); 
			},
			error: function() {
				alert('Error, no se pudo quitar el rol del usuario en el grupo.');
			}
		});
	}else{
		alert("error");
	}
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
				alert( "El usuario " + uid + " en su rol de "+role+ " fue removido del grupo " + gid.toString()+": "+encodeHTML(groupName) ); 
			},
			error: function() {
				alert('Error, no se pudo quitar el rol del usuario en el grupo.');
			}
		});
	}else{
		alert("error");
	}
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




function newGroup(){
	// TODO separar en request y parte de leer html
	var url = apiBaseUrl+"/admin/groups"; 
	name = document.getElementById("newGroupName").value;
	if(name!=""){
		var newGroupData = { name : name, users : [] };
		$.ajax({
			method: "POST",
			url: url,
			data : JSON.stringify(newGroupData),
			contentType: "application/json",
			async: false,
			headers : { "authorization" : ("Bearer " + token) },
			success: function(data) {
				alert('Grupo creado correctamente!');
				refreshEverything();
			},
			error: function() {
				alert('Falló la creación del nuevo grupo.');
			}
		});
	}else{
		alert("El nombre del grupo no puede quedar vacío!");
	}
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


function getUsers(){
	var urlAdminUsers = apiBaseUrl+"/admin/users";
	var allUsers;
	$.ajax({
		method: "GET",
		url: urlAdminUsers,
		contentType: "application/json",
		async: false,
		headers : { "authorization" : ("Bearer " + token) },
		success: function(data) {
			allUsers = data.users;
		},
		error: function() {
			alert('Users falló');
		}
	});
	return allUsers;
}

function getUserRoles(){
	var urlAdminUsers = apiBaseUrl+"/admin/users/roles?only_available=true";
	$.ajax({
		method: "GET",
		url: urlAdminUsers,
		contentType: "application/json",
		async: false,
		headers : { "authorization" : ("Bearer " + token) },
		success: function(data) {
			users = data.user_roles;
		},
		error: function() {
			alert('Users falló');
		}
	});
	return users;
}


function getUsersFiltered(){ //separar en request y leer el form
	var urlAdminUsers = apiBaseUrl+"/admin/users/roles?only_available=true";
	currentNeighborhood = document.getElementById("selectNeighborhood").value;
	currentCity = document.getElementById("selectCity").value;
	if(currentNeighborhood!=""){
		urlAdminUsers+="&neighborhood="+currentNeighborhood;
	}
	if(currentCity!=""){
		urlAdminUsers+="&city="+currentCity;
	}
	
	showCooks = document.getElementById("cookCheckbox").checked;
	showDrivers = document.getElementById("driverCheckbox").checked;
	showDelegates = document.getElementById("delegateCheckbox").checked;

	function filterRoles(u){
		if(showCooks && (u.role == "cook")){
			return true;
		}
		if(showDrivers && (u.role == "driver")){
			return true;
		}
		if(showDelegates && (u.role=="delegate")){
			return true;
		}
		return false;
	};

	$.ajax({
		method: "GET",
		url: urlAdminUsers,
		contentType: "application/json",
		async: false,
		headers : { "authorization" : ("Bearer " + token) },
		success: function(data) {
			users = data.user_roles.filter(filterRoles);
		},
		error: function() {
			alert('Users falló');
		}
	});
	return users;
}


function addRole(uid,role){
	if(uid!=0){
		var urlAddUserRole = apiBaseUrl+"/admin/users/"+ uid.toString() +"/roles";
		$.ajax({
			method: "POST",
			url: urlAddUserRole,
			contentType: "application/json",
			data :"{\"role\": \"" + role + "\"}",
			async: false,
			headers : { "authorization" : ("Bearer " + token) },
			success: function(data) {
				allUsers = getUsers();
				refreshEverything();
			},
			error: function() {
				alert('Error no se pudo agregar el rol delegado al usuario.');
			}
		});
	}
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
	g = getElementInOrderedListById(groups, parseInt(groupId,10), "group_id");
	if( g === null ){
		return "";
	}
	return g.name
}

function getGroupAdminEndpointById(groupId){
	return getElementInOrderedListById(groups, parseInt(groupId,10), "group_id");
}


function getUserWithRolesById(uid){
	return getElementInOrderedListById(users,uid,"user_id");
}

function getUserById(uid){
	return getElementInOrderedListById(allUsers,uid,"user_id");
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

