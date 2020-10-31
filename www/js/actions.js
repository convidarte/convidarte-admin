// aca pongo lo que pasa al clickear cosas

//  se llama al clickear "ver detalle de grupo"
function showGroup(){
	var gid = event.target.value;
	store.setCurrentGroupId(gid);
	currentlyDividingGroup = false;
	userRolesNewGroup = {};
	showGroupById(gid);
}


// se llama al cambiar el filtrar por barrio
function selectNeighborhoodChanged(){
	currentPage=0;
	var neighborhood = document.getElementById("selectNeighborhood").value;
	store.setNeighborhoodFilterValue(neighborhood)	
	refreshEverything();
}
// se llama al cambiar el filtrar por localidad
function selectCityChanged(){
	currentPage=0;
	var city = document.getElementById("selectCity").value;
	store.setCityFilterValue(city)	
	refreshEverything();
}

function selectRoleChanged(){
	currentPage=0;
	var role = document.getElementById("selectRole").value;
	store.setRoleFilterValue(role)	
	refreshEverything();
}

// borra un user-role de un grupo
function deleteMemberOnClick(){
	var boton = event.target;
	var s = boton.value;
	var gid = s.split(" ")[0];
	var uid = s.split(" ")[1];
	var role = s.split(" ")[2];
	if ( confirm("Seguro que quiere quitar del grupo al usuario "+ uid.toString() +"?") ){
		if(currentSystem=="admin"){
			deleteMember(gid,uid,role);
		}
		if (currentSystem=="delegate"){
			deleteMemberDelegate(gid,uid,role);
		}
	}
}


// borra un user-role de un grupo, agreega el usuario a inactivos
function deleteMemberAndInactivateOnClick(){
	var boton = event.target;
	var s = boton.value;
	var gid = s.split(" ")[0];
	var uid = s.split(" ")[1];
	var role = s.split(" ")[2];
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

function deleteGroupOnClick() {
	var boton = event.target;
	var gid = boton.value;
	if ( confirm("Seguro que quiere eliminar el grupo "+ gid.toString() +"?") ){
		deleteGroup(gid);
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
	var newName = document.getElementById("dividedGroupNewName").value;
	var gid = store.state.currentGroupId;
	if(newName!=""){
		var userRoles = []
		for(x in userRolesNewGroup){
			var uid = parseInt(x.split(",")[0],10);
			var role = x.split(",")[1];
			userRoles.push({user_id: uid ,role: role});
		}
		var res = postGroup(newName,userRoles);
		if(res==201){
			var currentGroupName  = getGroupNameById(gid);
			res = removeUserRolesFromGroup(gid,currentGroupName,userRoles);
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


function downloadGroupDetailTable(){
	var gid = store.state.currentGroupId;
	if(gid!=0){
		name = encodeHTML(getGroupNameById(gid));
		downloadElementAsPDF("groupDetailTablePrintable", "grupo "+gid.toString()+" - "+ name + " - " + getDateString() +".pdf", "avoid");
	}
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


function addUserRoleOnClick(){
	var boton = event.target;
	var uid = parseInt(boton.getAttribute("data-uid"),10);
	var role = boton.getAttribute("data-role");
	addRole(uid,role);
	$("#modalAddRole").modal('hide');
}


function changeGroupNameOnClick(){
	var groupName = document.getElementById("newName").value;
	var gid = store.state.currentGroupId;
	changeGroupName(gid,groupName);
}
