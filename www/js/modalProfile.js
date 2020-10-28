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

