// aca pongo lo que pasa al clickear cosas

//  se llama al clickear "ver detalle de grupo"
function showGroup(){
	currentGroupId = event.target.value;
	showGroupById(currentGroupId);
}

// se llama al cambiar el filtrar por barrio
function selectNeighborhoodChanged(){
	currentPage=0;
	refreshEverything();
}
// se llama al cambiar el filtrar por localidad
function selectCityChanged(){
	currentPage=0;
	refreshEverything();
}

// borra un user-role de un grupo
function deleteMemberOnClick(){
	boton = event.target;
	s = boton.value;
	gid = s.split(" ")[0];
	uid = s.split(" ")[1];
	role = s.split(" ")[2];
	deleteMember(gid,uid,role);
	refreshEverything();
}

// borra un user-role de un grupo, agreega el usuario a inactivos
function deleteMemberAndInactivateOnClick(){
	boton = event.target;
	s = boton.value;
	gid = s.split(" ")[0];
	uid = s.split(" ")[1];
	role = s.split(" ")[2];
	deleteMember(gid,uid,role);
	inactivateUserRole(uid,role);
	refreshEverything();
}

function inactivateUserRoleOnClick(){
	boton = event.target;
	s = boton.value;
	uid = s.split(" ")[0];
	role = s.split(" ")[1];
	inactivateUserRole(uid,role);
	refreshEverything();
}


function addUserRoleInGroupProfileOnClick(){
	gid = document.getElementById("newGroupId").value;
	role = document.getElementById("newRole").value;
	groupName = getGroupNameById(gid);
	addUserRoleToGroup(currentUserId, role, gid, groupName);

}

//  se llama al clickear "ver detalle de usuario"
function showUserProfile(){
	if(currentTab=="profile"){
		s = event.target.value;
		num = parseFloat(s.split(":")[0]);
		if (num.toString()!="NaN"){
			currentUserId = num;
			showUserById(currentUserId);
		}
	}
}

// se llama cuando se clickea el boton de "mostrar solo los que no tienen lat/long"
function toggleWithoutAddress(){
	if(onlyUsersWithoutAddress){
		onlyUsersWithoutAddress = false;
		event.target.innerHTML = "Mostrar solamente usuarios que no están en el mapa";
	} else {
		onlyUsersWithoutAddress = true;
		event.target.innerHTML = "Mostrar todos los usuarios";
	}
	currentPage=0;
	refreshEverything();
}

// paginacion +1
function nextPage(){
	if(currentPage+1 < numberPages){
		currentPage++;
	}
	refreshEverything();
}

// paginacion -1
function previousPage(){
	if(currentPage-1 >= 0){
		currentPage--;
	}
	refreshEverything();
}

function downloadGroupDetailTable(){
	if(currentGroupId!=0){
		name = encodeHTML(getGroupNameById(currentGroupId));
		downloadElementAsPDF("groupDetailTablePrintable", "grupo "+currentGroupId.toString()+" - "+ name + " - " + getDateString() +".pdf", "avoid");
	}
}

function getDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day =`${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`
}


//TODO esta es muy parecida a la que sigue!!!
function assignGroupGroups(){
	boton = event.target;
	i = boton.value;
	u = users[i];
	role = u.role; // cook
	user_role_id = u.role_id; // uint
	user_id = u.user_id; // uint
	group_id = document.getElementById("selectGroup"+i.toString()).value;
	groupName = getGroupNameById(group_id);
	if (group_id!=""){
		addUserRoleToGroup(u.user_id, u.role, group_id, groupName);
		refreshEverything();
	}else{
		alert("Debe seleccionar un grupo.");
	}
}

function assignGroupMap(){
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


function addRoleToCurrentUserOnClick(){
	boton = event.target;
	role = boton.value;
	addRole(currentUserId,role);
	refreshEverything();
}


