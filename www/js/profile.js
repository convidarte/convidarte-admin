function showModalProfile(uid){
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

	$("#modalProfile").modal();

	window.history.pushState('perfil', '', '/perfil/'+uid.toString());
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
	alert("Pendiente de implementar");
/*
	s+="<h3>Agregar roles asumibles:</h3>";
	if(u.roles.indexOf("cook")<0){
		s+="<button id=\"addCookRole\" value=\"cook\" style=\"background-color:Salmon;\" onclick=\"addRoleToCurrentUserOnClick()\"> Agregar chef como rol asumible</button><br/><br/>";
	}
	if(u.roles.indexOf("driver")<0){
		s+="<button id=\"addDriverRole\" value=\"driver\" style=\"background-color:SpringGreen;\" onclick=\"addRoleToCurrentUserOnClick()\"> Agregar distribuidor como rol asumible</button><br/><br/>";
	}
	if(u.roles.indexOf("delegate")<0){
		s+="<button id=\"addDelegateRole\" value=\"delegate\" style=\"background-color:MediumPurple;\" onclick=\"addRoleToCurrentUserOnClick()\"> Agregar delegado como rol asumible</button><br/><br/>";
	}
*/
}

function shareUserProfile(){
	alert("Pendiente de implementar");
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

