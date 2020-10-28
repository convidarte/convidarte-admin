// aca pongo lo que pasa al clickear cosas

//  se llama al clickear "ver detalle de grupo"
function showGroup(){
	currentGroupId = event.target.value;
	currentlyDividingGroup = false;
	userRolesNewGroup = {};
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
	if ( confirm("Seguro que quiere quitar del grupo al usuario "+ uid.toString() +"?") ){
		if(currentSystem=="admin"){
			deleteMember(gid,uid,role);
		}
		if (currentSystem=="delegate"){
			deleteMemberDelegate(gid,uid,role);
		}
		refreshEverything();
	}
}


// borra un user-role de un grupo, agreega el usuario a inactivos
function deleteMemberAndInactivateOnClick(){
	boton = event.target;
	s = boton.value;
	gid = s.split(" ")[0];
	uid = s.split(" ")[1];
	role = s.split(" ")[2];
	if ( confirm("Seguro que quiere quitar e inactivar al usuario "+ uid.toString() +"?") ){
		if (currentSystem=="admin"){
			deleteMemberAndDeactivateAdmin(gid,uid,role);
		}
		if (currentSystem=="delegate"){
			deleteMemberAndDeactivateDelegate(gid,uid,role);
		}
		refreshEverything();
	}
}

function inactivateUserRoleOnClick(){
	boton = event.target;
	s = boton.value;
	uid = s.split(" ")[0];
	role = s.split(" ")[1];
	inactivateUserRole(uid,role);
	refreshEverything();
}

function inactivateUserRoleOnClickModal(){
	boton = event.target;
	uid = boton.getAttribute("data-uid-inactivate");
	role = boton.getAttribute("data-role-inactivate");
	inactivateUserRole(uid, role);
	refreshEverything();
}


function ackDelegateOnClick(){
	boton = event.target;
	s = boton.value;
	gid = s.split(" ")[0];
	uid = s.split(" ")[1];
	role = s.split(" ")[2];
	if (currentSystem=="delegate"){
		ackDelegate(gid,uid,role);
	}
	refreshEverything();
}

function showModalProfileTooltip(){
	event.preventDefault();
	uid = event.target.getAttribute("data-uid");
	showModalProfile(uid);
	return false;
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

// BEGIN DIVIDING GROUP
function divideGroupOnClick(){
	newName = document.getElementById("dividedGroupNewName").value;
	if(newName!=""){
		userRoles = []
		for(x in userRolesNewGroup){
			uid = parseInt(x.split(",")[0],10);
			role = x.split(",")[1];
			userRoles.push({user_id: uid ,role: role});
		}
		res = postGroup(newName,userRoles);
		if(res==201){
			currentGroupName  = getGroupNameById(currentGroupId);
			res = removeUserRolesFromGroup(currentGroupId,currentGroupName,userRoles);
			if (res== 200){
				alert("El grupo fue dividido correctamente.");
			}else{
				alert("El grupo nuevo fue creado. Error al quitar a los usuarios del grupo actual. Removerlos a mano.");
			}
			stopDividingGroupOnClick();
		}else{
			alert("Error: no se pudo dividir el grupo");
		}
	}else{
		alert("Error: el nombre del nuevo grupo no puede quedar vacío");
	}
}
function checkboxDivideGroupChange(){
	v = event.target.value;
	uid = parseInt(v.split("_")[0],10);
	role = v.split("_")[1];
	if (event.target.checked){
		userRolesNewGroup[ [uid,role] ]=true;
	}else{
		delete userRolesNewGroup[ [uid,role] ];
	}
}
// END DIVIDING GROUP

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


function addRoleToCurrentUserOnClick(){
	boton = event.target;
	role = boton.value;
	addRole(currentUserId,role);
	refreshEverything();
}

