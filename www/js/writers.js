
// devuelve el html de un boton para sacar un user-role de un grupo.
function deleteRoleButton(gid,uid,role){
	var s = "<button id=\"delete_" + gid.toString() + "_" + uid.toString() + "_" + role + "\" type=\"button\" onclick=\"deleteMemberOnClick();\" value=\"" + gid.toString() + " " + uid.toString() + " " + role + "\">Quitar del grupo</button>";
	return s;
}

function deleteAndInactivateRoleButton(gid,uid,role){
	var s = "<button id=\"delete_inactivate_" + gid.toString() + "_" + uid.toString() + "_" + role + "\" type=\"button\" onclick=\"deleteMemberAndInactivateOnClick();\" value=\"" + gid.toString() + " " + uid.toString() + " " + role + "\">Quitar e inactivar usuario</button>";
	return s;
}

function buttonAckDelegate(gid,uid,role){
	var s = "<button id=\"button_ack_delegate_" + gid.toString() + "_" + uid.toString() + "_" + role + "\" type=\"button\" onclick=\"ackDelegateOnClick();\" value=\"" + gid.toString() + " " + uid.toString() + " " + role + "\">Ya me contacté!</button>";
	return s;
}

// devuelve el HTML de un select con los grupos existentes y el id especificado.
function getGroupSelectHTML(selectId){
	s = "<select id=\""+ selectId + "\" style=\"max-width:120px;\">\n"
	s += "<option disabled selected value> elegir grupo </option>"
	//groups = getGroups();
	for (var i = 0; i < groups.length; i++) {
		g = groups[i];
		group_id = g.group_id.toString();
		s+="<option value=\"" + group_id + "\" >"+ group_id + " - " + encodeHTML(g.name) +"</option>\n";
	}
	s+="</select>";
	return s;
}


function getRoleSelectHTML(selectId,roles){
	s = "<select id=\""+ selectId + "\" style=\"max-width:120px;\">\n";
	s += "<option disabled selected value> elegir rol </option>";
	for (var i = 0; i < roles.length; i++) {
		r = roles[i];
		if (r!="admin"){
			s+="<option value=\"" + r + "\" >"+ roleInSpanish(r) +"</option>\n";
		}
	}
	s+="</select>";
	return s;
}

function roleInSpanish(role){
	if (role=="cook"){
		return "Chef";
	}else if (role=="driver"){
		return "Distribuidor";
	}else if (role=="delegate"){
		return "Delegado";
	}else if (role=="admin"){
		return "Coordinador";
	}
	return "";
}

// escribe el elemento selectNeighborhood con la lista de barrios
function getNeighborhoodList(){
	getUserRoles();
	neighborhoods = new Set([]);
	for (var i =0; i< users.length; i++){
		u = users[i];
		if(u.address.neighborhood.toString() !="" && u.address.neighborhood.toString() !="nan" ){
			if( currentTab=="users" || !checkHasNoCoordinates(u)){
				neighborhoods.add( u.address.neighborhood.toString().trim());
			}
		}	
	}
	neighborhoodList = new Array();
	for (let entry of neighborhoods.entries()) {
		neighborhoodList.push(entry[1]);
	}
	neighborhoodList.sort();
	//alert(neighborhoodList.join(", "));

	//s="<option value=\"SHOWNOUSERS\">Ninguno</option>";
	s="<option value=\"SHOWNOUSERS\" disabled hidden>Seleccionar un barrio</option>";
	s+="<option value=\"\" selected>Todos los barrios</option>";
	for (var i =0; i<neighborhoodList.length;i++){
		neigh = neighborhoodList[i].toString();
		s+=	"<option value=\""+ encodeHTML(neigh) +"\">"+ encodeHTML(neigh)+"</option>";
	}
	document.getElementById("selectNeighborhood").innerHTML = s;
}

// escribe el elemento selectCity con la lista de barrios
function getCityList(){
	//getUserRoles(); ya lo traemos en getNeighborhoodList :D
	cities = new Set([]);
	for (var i =0; i< users.length; i++){
		u = users[i];
		if(u.address.city.toString() !="" && u.address.city.toString() !="nan" ){
			if (currentTab=="users" || !checkHasNoCoordinates(u)){
				cities.add(u.address.city.toString().trim());
			}
		}	
	}
	cityList = new Array();
	for (let entry of cities.entries()) {
		cityList.push(entry[1]);
	}
	cityList.sort();
	s="";
	s+="<option value=\"\" selected>Todas las localidades</option>";
	//s+="<option value=\"SHOWNOUSERS\">Ninguno</option>";
	for (var i =0; i<cityList.length;i++){
		city = cityList[i].toString();
		s+=	"<option value=\""+ encodeHTML(city) +"\">"+encodeHTML(city)+"</option>";
	}
	document.getElementById("selectCity").innerHTML = s;
}

function showModalProfileTooltip(){
	event.preventDefault();
	uid = event.target.getAttribute("data-uid");
	showModalProfile(uid);
	return false;
}

// Escribe el elemento  userDetail a partir de un uid
function userMarkerContent(uid,role){
	u = getUserById(uid);
	s = "<a href=\"#\" data-uid=\""+uid.toString()+"\" onclick=\"showModalProfileTooltip()\">"+ encodeHTML(u.name) + encodeHTML(u.last_name) + "</a>";
	s += "<div>@"+ encodeHTML(u.user_name)+ " - "+ u.user_id.toString()+ "</div>";
	s += "<div>" + roleInSpanish(role) + "</div>";
	s += "<div>" + encodeHTML(u.address.street) + " " + u.address.number.toString() + ", "+encodeHTML(u.address.city)+"</div>";
	s+= getGroupSelectHTML( "selectGroup" + uid.toString() ) + "<br/>";
	s+="<button id=\"agregar"+ uid.toString() + "\" onclick=\"assignGroup()\" value=\""+ uid.toString() +"\" name=\""+encodeHTML(u.user_name) +"\" visible=\"1\"  > Agregar </button></td>";
	//document.getElementById("userDetail").innerHTML = s;
	return s;
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


//Carga la lista de grupos en los filtros
/*
function getGroupList(){
	groups = getGroups();
	groupsElement = document.getElementById('grupos');
	s = "";
	s+="<option value=\"\">Todos los grupos</option>"; 
	for (var i = 0; i < groups.length; i++) {
		g= groups[i];
		s+=	"<option value=\""+encodeHTML(g.name)+"\">"+g.group_id.toString()+" - "+encodeHTML(g.name)+"</option>";
	}
	document.getElementById("selectGroupFilter").innerHTML = s;
}*/


function tidySpaces(s){
	return s.replace(/\s+/g, ' ').trim();
}

// escribe el elemento usersListContainer con la lista de usuarios para seleccionar
function updateSelectUsers(){
	allUsers = getUsers();
	optionList = new Array();
	for ( var i=0; i<allUsers.length; i++){
		u = allUsers[i];
		optionList.push( tidySpaces(u.user_id.toString()+": "+ encodeHTML(u.user_name)	+ " ("+encodeHTML(u.name) + " " + encodeHTML(u.last_name)+" " +encodeHTML(u.cellphone) +")"));
	}
	//document.getElementById("numberUsers").innerHTML = "<h3>Hay "+ allUsers.length.toString() + " usuarios registrados en Convidarte.</h3>";
    $( "#userList" ).autocomplete({
		source: optionList,
		select: function(event,ui){
					selectedOption = ui.item.label
					document.getElementById("userList").value = selectedOption;
					num = parseFloat(selectedOption.split(":")[0]);
					if (num.toString()!="NaN"){
						currentUserId = num;
						showModalProfile(currentUserId);
					}
				},
	});
	$("#userList").click(
		function(){
			document.getElementById("userList").value="";
		}
	)
}

function updateSelectGroups(){
	groups = getGroups();
	options= groups.map( g => g["group_id"]+": " + g["name"] );
	$("#groupList").autocomplete({
		source: options,
		select: function(event,ui){
					selectedOption = ui.item.label
					document.getElementById("groupList").value = selectedOption;
					num = parseFloat(selectedOption.split(":")[0]);
					if (num.toString()!="NaN"){
						currentGroupId = num;
						showGroupById(currentGroupId);
					}
				}
	});
	$("#groupList").click(
		function(){
			document.getElementById("groupList").value="";
		}
	)
}


function prepareAddressGoogleMaps(street,number,city,province){
	return street +" "+number.toString()+", " +city+", "+province;
}

function divideGroupForm(){
	s = "<hr style=\"width:95%;\">";
	s+="<div id=\"divDividirGrupo\" style=\"margin-left:15px;\">";
	s+="<h3>Dividir grupo</h3>";
	if (currentlyDividingGroup){
		s+="Instrucciones: seleccionar los miembros del nuevo grupo, luego elegir el nombre del nuevo grupo y finalmente clickear en Dividir grupo.<br/>";
		s+="Nombre para el nuevo grupo:&nbsp;&nbsp; <input id=\"dividedGroupNewName\" type=\"text\"></input><br/><br/>";
		s+="<button id=\"divideGroup\" onclick=\"divideGroupOnClick();\">Dividir grupo</button>&nbsp;&nbsp;&nbsp;&nbsp;";
		s+="<button id=\"cancelDivideGroup\" onclick=\"stopDividingGroupOnClick();\">Cancelar la división</button><br/>";

	}else{
		s+="<button id=\"startDividingGroupButton\" onclick=\"startDividingGroupOnClick();\"> Quiero dividir el grupo</button><br/>";
	}
	s+="</div>";
	s+="<hr style=\"width:95%;\">";
	return s;
}

// escribe el elemento "ppal" con la data detallada de un grupo
function showGroupById(groupId){
	groupDetailElement = document.getElementById('ppal');
	if (groupId==0){
		groupDetailElement.innerHTML="";
		return;
	}
	g = getGroup(groupId);
	members = g.members;
	s= "<div>";
	s += "<h1>"+"&nbsp;&nbsp;"+encodeHTML(g.name)+"</h1>";
	s+= "<div style=\"margin-left:15px;\"><a id=\"bajarPDF\" href=\"#\" onclick=\"downloadGroupDetailTable();return false;\">Bajar en formato PDF</a></div>";
	s+="<div id=\"downloadCSVLinkDiv\" style=\"margin-left:15px;\"></div>";
	s+="</div>";
	if (currentSystem == "admin"){
		// renombrar:
		s+="<div style=\"margin-left:15px;\">";
		s+="<h3> Cambiar el nombre del grupo</h3>\n";
		s+="Nuevo nombre: <input id=\"newName\"></input>\n";
		s+="<button id=\"changeName\" onclick=\"changeGroupName()\">Cambiar nombre</button>";
		s+="</div>";
		//borrar:
		s+="<div style=\"margin-left:15px;\">";
		s+="<h3> Borrar grupo</h3>\n";
		s+= "<button id=\"DeleteGroup"+g.group_id.toString() +"\" type=\"button\" onclick=\"deleteGroupOnClick();\" value=\""+g.group_id.toString() + "\">Borrar grupo</button>";
		s+="</div>";
		//dividir:
		s+=divideGroupForm();
	}
	s += "<table id=\"groupDetailTable\" class=\"table table-striped\">\n";
	s+= "<tr><th>Id</th> <th>Nombre</th><th>Dirección</th><th>Rol(es)</th> </tr>"; 
	for (var i = 0; i < members.length; i++){
		u= members[i];
		uid = u.user_id;
		address = u.address.street +" "+u.address.number.toString()+ " "+ u.address.floor_and_apartment + " ("+ u.address.neighborhood+") " + u.address.city+", "+u.address.province;
		addressGoogle = prepareAddressGoogleMaps(u.address.street, u.address.number, u.address.city, u.address.province);
		urlMaps = "https://www.google.com/maps/search/"+encodeURI(addressGoogle);
		ack = u.roles_in_group[0].ack_delegate;// el ack del primer rol que tenga el usuario en el grupo. definir que pasa si tiene mas de un rol!
		if (ack){
			s+="<tr>\n";
		}else{
			s+="<tr style=\"background-color:lightgreen;\" >\n";
		}
		s+="<td>"+uid+"</td>";
		s+="<td>"
		nameToShow = encodeHTML(u.user_name);
		if (u.name!="" || u.last_name!="" ){
			nameToShow = encodeHTML(u.user_name)+" ("+encodeHTML(u.name) +" " + encodeHTML(u.last_name) + ")";
		}
		viewProfileLink = "viewProfileLink_"+uid.toString();
		s+= "<a id=\"" + viewProfileLink + "\" href=\"#\" class=\"viewProfileLink\" >" + nameToShow + "</a>";
		if ( currentSystem=="delegate" && (!ack)   ){
			s+=buttonAckDelegate(g.group_id,uid,u.roles_in_group[0].role);
		}
		s+="</td>";
		s+="<td><a href=\""+urlMaps+"\" target=\"_blank\">"+ encodeHTML(address)+"</a></td>";

		// comienza roles:		
		s+="<td><table>";
		for (var j =0;  j< u.roles_in_group.length; j++){
			var role = u.roles_in_group[j].role;
			var roleSpanish="";
			if(role=="cook"){
				roleSpanish ="Chef";
			}else if (role=="driver"){
				roleSpanish = "Distribuidor";
			}else if(role=="delegate"){
				roleSpanish= "Delegado";			
			}
			s += "<tr><td>" + roleSpanish + "</td>";
			if (currentlyDividingGroup){
				checked = "";
				if( [uid,role] in userRolesNewGroup){
					checked="checked ";
				}
				s+="<td><input value=\""+uid.toString() +"_"+ role  +"\" type=\"checkbox\" "+checked+"onchange=\"checkboxDivideGroupChange();\"></input> </td>";			
			}else{
				s+="<td>"+ deleteRoleButton(g.group_id,uid,role)+"</td><td>"+ deleteAndInactivateRoleButton(g.group_id,uid,role)+"</td>";
			}
			s+="</tr>";
		}
		s+="</table></td>";//termina roles
		//s+= "<td>"+ details + "</td>";
		s+= "</tr>";
	}
	s+="</table>";
	s+="<br/><br/>";
	s+= groupDetailPrintable(g);
	groupDetailElement.innerHTML = s;
	$("."+"viewProfileLink").click(
		function(e){
			e.preventDefault(); 
			uid = e.target.id.split("_")[1];
			showModalProfile(uid);
			return false;
		} 
	); 
	getGroupCSV(g);
	displayGroupOnMap(g);
}



function groupDetailPrintable(g){
	//g = getGroup(groupId);
	members = g.members;
	s = "<div id=\"divHidden\" style=\"display: none;\">";
	s+= "<div id=\"groupDetailTablePrintable\">";
	s+="<br/><br/><br/><br/><br/><br/>";
	s += "<h1 align=\"center\">"+encodeHTML(g.name)+"</h1><br/>";
	s+="<table style=\"border: 1px solid black;border-collapse:collapse;width:650px;margin: auto;\">"
	s+= "<thead><tr><th>Id</th> <th>Nombre</th><th>Dirección</th><th>Celular</th><th>Email</th><th>Rol(es)</th> </tr></thead>";
	s+="<tbody>"; 
	for (var i = 0; i < members.length; i++){
		u= members[i];
		uid = u.user_id;
		address = u.address.street +" "+u.address.number.toString()+ " "+ u.address.floor_and_apartment + " ("+ u.address.neighborhood+") " + u.address.city+", "+u.address.province;
		addressGoogle = prepareAddressGoogleMaps(u.address.street, u.address.number, u.address.city, u.address.province);
		urlMaps = "https://www.google.com/maps/search/"+encodeURI(addressGoogle);
		s+="<tr>\n";
		s+="<td>"+uid+"</td>";
		if (u.name!="" ){
			s+="<td>"+encodeHTML(u.user_name)+" ("+encodeHTML(u.name)+" "+encodeHTML(u.last_name) +")</td>";
		}else{
			s+="<td>"+encodeHTML(u.user_name)+"</td>";
		}
		s+="<td><a href=\""+urlMaps+"\">"+ encodeHTML(address)+"</a></td>";
		s+="<td>"+encodeHTML(u.cellphone)+"</td>";
		s+="<td style=\"word-wrap: break-word;\">"+encodeHTML(u.email)+"</td>";
		// comienza roles:		
		s+="<td>"+u.roles_in_group.map( x=> x["role"] ).map(roleInSpanish).join( " ")+"</td>";
		s+= "</tr>";
	}
	s+="</tbody></table></div></div>";
	return s;
}

function getGroupCSV(g){
	members = g.members;
	filename = "grupo " + g.group_id.toString() + " - " + g.name + " - " + getDateString() + ".csv";
	csvSeparator = ";";
	var text = ["Id","Nombre","Dirección","Barrio","Ciudad","Provincia","Celular","Email","Rol(es)"].join(csvSeparator)+"\n"; 
	for (var i = 0; i < members.length; i++){
		u = members[i];
		uid = u.user_id.toString();
		address = u.address.street +" "+u.address.number.toString()+ " "+ u.address.floor_and_apartment;
		neighborhood = u.address.neighborhood;
		city = u.address.city;
		province = u.address.province;
		if (u.name!="" ){
			fullname=u.user_name+" ("+u.name+" "+u.last_name+")";
		}else{
			fullname=u.user_name;
		}
		cellphone= u.cellphone;
		email = u.email;
		roles = u.roles_in_group.map( x=> x["role"] ).map(roleInSpanish).join( " ");
		row = [uid,fullname,address,neighborhood,city,province,cellphone,email,roles].map( x => '"' + x.replace(/"/g, '""') + '"' ).join(csvSeparator)
		text+=row+"\n";
	}
	var fileBlob = new Blob([text], {type: "application/octet-binary"});

	var link = document.createElement("a");
	link.setAttribute("href", URL.createObjectURL(fileBlob));
	link.setAttribute("download", filename);
	link.appendChild(document.createTextNode("Bajar hoja de cálculo (en formato .csv)"));
	document.getElementById("downloadCSVLinkDiv").appendChild(link);
}


// esta se usa para el sistema de delegados
function refreshGroupListDelegate(){
	groups = getUserGroups(adminUserId).filter( function(g){ return g.roles.includes("delegate");} );
	groupsElement = document.getElementById('gruposDelegado');
	s = "<table id=\"groupsTable\">\n";
	s+= "<tr><th>Id</th> <th>Nombre</th> <th></th> <th>#</th> <th>Chefs</th> <th>Distr.</th> <th>Deleg.</th></tr>"; 
	for (var i = 0; i < groups.length; i++) {
		g= groups[i];
		details = "<button id=\"viewDetailGroup"+g.group_id.toString() +"\" type=\"button\" onclick=\"showGroup();\" value=\""+g.group_id.toString() + "\">Detalle</button>";
		//deleteGroup = "<button id=\"DeleteGroup"+g.group_id.toString() +"\" type=\"button\" onclick=\"deleteGroupOnClick();\" value=\""+g.group_id.toString() + "\">Borrar grupo</button>";
		s+="<tr>\n";
		s+="<td>"+g.group_id.toString()+"</td>";
		s += "<td style=\"max-width:160px; word-wrap: break-word;overflow-y:auto; \">"+ encodeHTML(g.name)+"</td>";
		s+= "<td>"+ details + "</td>";
		s+= "<td>"+ g.member_count.toString()+ "</td>";
		s+= "<td>"+ g.role_count.cook+ "</td>";
		s+= "<td>"+ g.role_count.driver+ "</td>";
		s+= "<td>"+ g.role_count.delegate+ "</td>";
		s+= "</tr>";
	}
	s+="</table>";
	groupsElement.innerHTML = s;
}

// Titulo para resultados de busqueda
function usersListTitle(numberUsers){
	listTitle = document.getElementById("usersListTitle");
	showOnlyAvailable = true; //document.getElementById("onlyAvailable").checked;
	currentRole = document.getElementById("selectRole");
	currentRoleText= currentRole.options[currentRole.selectedIndex].text;
	currentNeighborhood = document.getElementById("selectNeighborhood").value;
	currentCity = document.getElementById("selectCity").value;
	usersFiltered = currentRoleText;
	if (showOnlyAvailable) {
		usersFiltered+=" sin grupo ";
	}
	if(currentCity!=""){
		if(currentNeighborhood!=""){
			usersFiltered+=" en "+currentNeighborhood+", "+currentCity;
		}else{
			usersFiltered+=" en "+currentCity;
		}
	}else{
		usersFiltered+=" en todas las localidades";
	}
	usersFiltered+=" ("+numberUsers+")";
	listTitle.innerHTML = usersFiltered;
}

//=====================================================================================

function refreshUserListUsers(){
	users = getUsersFiltered();
	if (onlyUsersWithoutAddress){
		users = users.filter(checkHasNoCoordinates);
	}
	usersListTable = document.getElementById("usersListTable");
	genericHead = "<thead><tr><th scope=\"col\">ID</th><th scope=\"col\">Rol</th><th scope=\"col\">Nombre y apellido</th><th scope=\"col\">Dirección</th><th scope=\"col\">Asignar grupo</th><th scope=\"col\"></th></tr></thead>";
	usersListTableInnerHTML = genericHead+"<tbody>";
	var userRows = new Array();
	var nUsers = 0;
	var numberUsers = users.length;
	numberPages = Math.ceil(numberUsers/rowsPerPage);
	for (var i = currentPage*rowsPerPage; i < Math.min(numberUsers,(currentPage+1)*rowsPerPage) ; i++) {
		u = users[i];
		uid = u.user_id;
		address = u.address.street +" "+u.address.number.toString()+ " "+ u.address.floor_and_apartment + " ("+ u.address.neighborhood+") " + u.address.city+", "+u.address.province;
		addressGoogle = prepareAddressGoogleMaps(u.address.street, u.address.number, u.address.city, u.address.province);
		urlMaps = "https://www.google.com/maps/search/"+encodeURI(addressGoogle);
		row="<tr>";
		row+="<th scope=\"row\">"+uid+"</th>";
		if (u.role == "cook") {
			row+="<td>Cocinero</td>";
		}
		if (u.role == "driver") {
			row+="<td>Distribuidor</td>";
		}
		if (u.role == "delegate") {
			row+="<td>Delegado</td>";
		}
		nameToShow = encodeHTML(u.user_name);
		if (u.name!="" || u.last_name!="" ){
			nameToShow =encodeHTML(u.user_name)+" ("+encodeHTML(u.name) +" " + encodeHTML(u.last_name) + ")"; 
		}

		viewProfileLink = "viewProfileLink_"+uid.toString();
		row+="<td><a id=\"" + viewProfileLink + "\" href=\"#\" class=\"viewProfileLink\" >" + nameToShow + "</a></td>";
		row+="<td><a href=\""+urlMaps+"\" target=\"_blank\">"+ encodeHTML(address)+"</a></td>";
		if(showOnlyAvailable){
			row += "<td>" + getGroupSelectHTML( "selectGroup" + uid.toString() ) + "<button id=\"agregar"+ uid.toString() + "\" onclick=\"assignGroup()\" value=\""+ uid.toString() +"\" name=\""+encodeHTML(u.user_name) +"\" visible=\"1\"  > Agregar </button></td>";
		}else{
			//row+= groupsOfUser(u);
		}
		row += "</tr>\n";
		userRows[nUsers++]=row;
	}
	usersListTableInnerHTML += userRows.join('\n') + "</tbody>";
	usersListTable.innerHTML =usersListTableInnerHTML;
	usersListTitle(numberUsers);
	$("."+"viewProfileLink").click(
		function(e){
			e.preventDefault(); 
			uid = e.target.id.split("_")[1];
			showModalProfile(uid);
			return false;
		} 
	); 
}
