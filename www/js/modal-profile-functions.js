function urlUserProfile(u){
	return '/?perfil/'+u["user_id"].toString()+"/"+u["name"].trim()+"-"+u["last_name"].trim();
}

function showModalProfile(uid){
	store.setCurrentUserId(uid);	
	$("#modalProfile").modal();
	var u = getUserById(uid);
	window.history.pushState('perfil', '', urlUserProfile(u));
}

function refreshModalProfile(uid){
	u = getUserById(uid);
	$("#modalProfile").attr("data-uid",uid);
	address = (u.address.street+" " + u.address.number +" "+ u.address.floor_and_apartment).trim();

	if(u.address.province=="CABA"){
		neighborhoodCityProvince = u.address.neighborhood+", "+"CABA";
	}else{
		neighborhoodCityProvince = u.address.city + ", " + u.address.province;
	}

	addressGoogle = prepareAddressGoogleMaps(u.address.street, u.address.number, u.address.city, u.address.province);
	urlMaps = "https://www.google.com/maps/search/"+encodeURI(addressGoogle);

	$(".modalUserId").html( "#" + u.user_id );
	$(".modalAlias").html( "@" + encodeHTML(u.user_name) );
	$("#modalProfileRoles").html( u.roles.map(roleInSpanish).join( ", " ) );
	$(".modalFullName").html( encodeHTML(u.name) +" "+ encodeHTML(u.last_name) );
	$("#modalProfileCellphone").html( encodeHTML(u.cellphone) );
	$("#modalProfileEmail").html( encodeHTML(u.email) );
	$("#modalProfileFullAdress").html( encodeHTML(address+", "+neighborhoodCityProvince) );
	$("#modalProfileUrlGoogleMaps").attr("href", urlMaps);
	$("#modalProfileUsersGroups").html( tableWithGroupsOfUser(u) );
	$("#modalProfileInactivateUser").attr("data-userid-inactivate", u.user_id);
	$("#modalProfileInactivateUser").attr("data-role-inactivate", u.roles[0]);

	$("#modalProfileShareButton").attr("data-uid",uid);
	$("#modalProfileAddToGroupButton").attr("data-uid",uid);
	$("#modalProfileAddRoleButton").attr("data-uid",uid);


	var coords = { lat: parseFloat(u.address.latitude), lng: parseFloat(u.address.longitude) };
	if(userMarkerMapProfile==null){
		userMarkerMapProfile = new google.maps.Marker({});
	}
	userMarkerMapProfile.setPosition(coords);
	userMarkerMapProfile.setLabel({text:u["user_name"],fontWeight:"bold",fontSize: "18px"});
	
	userMarkerMapProfile.setMap(mapProfile)
	centerMapOn(mapProfile,coords.lat,coords.lng);
}

function tableWithGroupsOfUser(u){
	uid = u.user_id;
	userGroups = getUserGroups(uid);
	if (userGroups.length==0){
		return "<p>El usuario " + u["user_name"] + " no pertenece a ningún grupo.</p>";
	}
	t = "<table><thead><tr><th>Id grupo</th><th>Nombre grupo</th><th>Roles</th><th></th></tr>   </thead><tbody>";
	for ( var i=0; i<userGroups.length; i++){
		g = userGroups[i];
		gid = g.group_id;
		for (var j = 0; j < g.roles.length; j++){
			role = g.roles[j];
			t+= "<tr><td>" +gid.toString() +"</td><td>"+encodeHTML(g.name)+"</td><td>"+roleInSpanish(role)+"</td><td>"+deleteRoleButton(gid,uid,role)+"</td></tr>";
		}
	}
	t+="</tbody></table>";
	return t;
}

// Obtiene los grupos del usuario para mostrar en la tabla general
function groupsOfUser(u){
	uid = u.user_id;
	userGroups = getUserGroups(uid);
	g = userGroups[0];
	t = "<td>";
	if (typeof g === "undefined") {
		t+= getGroupSelectHTML( "selectGroup" + uid.toString() ) + "<button id=\"agregar"+ uid.toString() + "\" onclick=\"assignGroup()\" value=\""+ uid.toString() +"\" name=\""+encodeHTML(u.user_name) +"\" visible=\"1\"  > Agregar </button>";
	} else {
		for ( var i=0; i<userGroups.length; i++){
			g = userGroups[i];
			gid = g.group_id;
			for (var j = 0; j < g.roles.length; j++){
				role = g.roles[j];
				t+= encodeHTML(g.name);
			}
		}
	}
	t+="</td>";
	return t;
}



function showAddToGroupModal(uid){
	u = getUserById(uid);
	$("#modalAddGroup").attr("data-uid",uid);
	$("#modalAddGroupSelectGroupContainer").html(getGroupSelectHTML("newGroupId"));
  	$("#modalAddGroupSelectRoleContainer").html(getRoleSelectHTML("newRole", u.roles ));
	$("#newUserRoleInGroup").attr("data-uid",uid);
	$("#modalAddGroup").modal();
}

function addUserRoleInGroupProfileOnClick(){
	btn = event.target;
	uid = parseInt(btn.getAttribute("data-uid"),10);
	gid = document.getElementById("newGroupId").value;
	role = document.getElementById("newRole").value;
	groupName = getGroupNameById(gid);
	addUserRoleToGroup(uid, role, gid, groupName);
}


function showGiveNewRoleModal(uid){
	var u = getUserWithRolesById(uid);
	var s = "";
	if(u.roles.indexOf("cook")<0){
		s+="<button id=\"addCookRole\" data-uid=\""+ uid.toString()+"\" data-role=\"cook\" style=\"background-color:Salmon;\" onclick=\"addUserRoleOnClick()\"> Agregar chef como rol asumible</button><br/><br/>";
	}
	if(u.roles.indexOf("driver")<0){
		s+="<button id=\"addDriverRole\"  data-uid=\""+ uid.toString()+"\" data-role=\"driver\" style=\"background-color:SpringGreen;\" onclick=\"addUserRoleOnClick()\"> Agregar distribuidor como rol asumible</button><br/><br/>";
	}
	if(u.roles.indexOf("delegate")<0){
		s+="<button id=\"addDelegateRole\"  data-uid=\""+ uid.toString()+"\" data-role=\"delegate\" style=\"background-color:MediumPurple;\" onclick=\"addUserRoleOnClick()\"> Agregar delegado como rol asumible</button><br/><br/>";
	}
	$("#modalAddRoleAvailableRoles").html(s);
	$("#modalAddRole").attr("data-uid",uid);
	$("#modalAddRole").modal();

}

function shareUserProfile(){
	var btn = event.target;
	var uid = btn.getAttribute("data-uid")
	var u = getUserById(uid);
	var url = window.location.origin+urlUserProfile(u);
	navigator.clipboard.writeText(url);
	alert("El link para compartir fue copiado al portapapeles");
}

function launchAddToGroupModal(){
	btn = event.target;
	uid = parseInt(btn.getAttribute("data-uid"),10);
	showAddToGroupModal(uid);
}

function launchGiveNewRoleModal(){
	btn = event.target;
	uid = parseInt(btn.getAttribute("data-uid"),10);
	showGiveNewRoleModal(uid);
}



function inactivateUserRoleOnClickModal(){
	boton = event.target;
	uid = boton.getAttribute("data-uid-inactivate");
	role = boton.getAttribute("data-role-inactivate");
	inactivateUserRole(uid, role);
	refreshEverything();
}

function showModalProfileTooltip(){
	event.preventDefault();
	uid = event.target.getAttribute("data-uid");
	showModalProfile(uid);
	return false;
}


function addUserRoleOnClick(){
	var boton = event.target;
	var uid = parseInt(boton.getAttribute("data-uid"),10);
	var role = boton.getAttribute("data-role");
	addRole(uid,role);
	$("#modalAddRole").modal('hide');
}


function assignGroup(){
	boton = event.target;
	uid = boton.value;
	u = getUserWithRolesById(uid);
	role = u.role; // cook
	user_role_id = u.role_id; // uint
	user_id = u.user_id; // uint
	group_id = document.getElementById("selectGroup"+uid.toString()).value;
	groupName = getGroupNameById(group_id);
	if (group_id!=""){
		addUserRoleToGroup(u.user_id, u.role, group_id, groupName);
		refreshEverything();
	}else{
		alert("Debe seleccionar un grupo.");
	}
}


// devuelve el html de un boton para sacar un user-role de un grupo.
function deleteRoleButton(gid,uid,role){
	var s = "<button id=\"delete_" + gid.toString() + "_" + uid.toString() + "_" + role + "\" type=\"button\" onclick=\"deleteMemberOnClick();\" value=\"" + gid.toString() + " " + uid.toString() + " " + role + "\">Quitar del grupo</button>";
	return s;
}


