
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
	s="<option value=\"SHOWNOUSERS\" selected disabled hidden>Seleccionar un barrio</option>";
	s+="<option value=\"\">Todos los barrios</option>";
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
	s+="<option value=\"\">Todas las localidades</option>";
	//s+="<option value=\"SHOWNOUSERS\">Ninguno</option>";
	for (var i =0; i<cityList.length;i++){
		city = cityList[i].toString();
		s+=	"<option value=\""+ encodeHTML(city) +"\">"+encodeHTML(city)+"</option>";
	}
	document.getElementById("selectCity").innerHTML = s;
}



// Escribe el elemento  userDetail a partir de un uid
function markerClicked(uid){
		u = getUserWithRolesById(uid);
		s = "<h2>Asignar grupo</h2>";
		s += "Usuario: " + u.user_id.toString()+ " - "+ encodeHTML(u.user_name)+"<br/>";
		s += "Rol: "+ roleInSpanish(u.role) +"<br/>";
		s += "Nombre: "+ encodeHTML(u.name) + " " + encodeHTML(u.last_name) + "<br/>";
		s += "Dirección: "+ encodeHTML(u.address.street) + " " + u.address.number.toString() + "<br/>";
		s += "Localidad: "+ encodeHTML(u.address.city) + "<br/>";
		s += "Departamento: "+ encodeHTML(u.address.commune) + "<br/>";
		s += "Provincia: "+ encodeHTML(u.address.province) + "<br/>";
		s += "Celular: "+ encodeHTML(u.cellphone.toString()) + "<br/>";
		s += "Email: "+ encodeHTML(u.email.toString()) + "<br/>";
		s+= getGroupSelectHTML( "selectGroup" + uid.toString() ) + "<br/>";
		s+="<button id=\"agregar"+ uid.toString() + "\" onclick=\"assignGroup()\" value=\""+ uid.toString() +"\" name=\""+encodeHTML(u.user_name) +"\" visible=\"1\"  > Agregar </button></td>";
	document.getElementById("userDetail").innerHTML = s;
}


// escribe el elemento profile con los datos de un usuario.
function showUserById(uid){
	u = getUserById(uid);
	address = u.address.street+" " + u.address.number +" "+ u.address.floor_and_apartment;
	addressGoogle = prepareAddressGoogleMaps(u.address.street, u.address.number, u.address.city, u.address.province);
	urlMaps = "https://www.google.com/maps/search/"+encodeURI(addressGoogle);
	s = "<table>";
	s+= "<tr><td> Id</td><td>"+u.user_id+"</td></tr>";
	s+= "<tr><td> Nombre de Usuario</td><td>"+encodeHTML(u.user_name)+"</td></tr>";
	s+= "<tr><td> Nombre</td><td>"+encodeHTML(u.name)+"</td></tr>";
	s+= "<tr><td> Apellido</td><td>"+encodeHTML(u.last_name)+"</td></tr>";
	s+= "<tr><td> Celular</td><td>"+encodeHTML(u.cellphone)+"</td></tr>";
	s+= "<tr><td> Email</td><td>"+encodeHTML(u.email)+"</td></tr>";
	s+="<tr><td> Dirección</td><td><a href=\""+urlMaps+"\" target=\"_blank\">"+ encodeHTML(address)+"</a></td>";
	s+= "<tr><td> Barrio</td><td>"+encodeHTML(u.address.neighborhood)+"</td></tr>";
	s+= "<tr><td> Localidad</td><td>"+encodeHTML(u.address.city)+"</td></tr>";
	s+= "<tr><td> Departamento</td><td>"+encodeHTML(u.address.commune)+"</td></tr>";
	s+= "<tr><td> Provincia</td><td>"+encodeHTML(u.address.province)+"</td></tr>";
	s+="<tr><td> Código postal</td><td>"+encodeHTML(u.address.zip_code)+"</td>";
	s+="<tr><td> Info. adicional</td><td>"+encodeHTML(u.address.extra_info)+"</td>";

	s+= "<tr><td> Roles asumibles</td><td>"+u.roles.map(roleInSpanish).join( ", " )+"</td></tr>";
	s+= "<tr><td> Cantidad de roles asumidos</td><td>"+u.roles_in_groups_count+"</td></tr>";
	s+="</table>";
	s+="<br/>";
	s+="<h3>El usuario "+encodeHTML(u.user_name) + " está en los siguientes grupos</h3><br/>";
	s+= tableWithGroupsOfUser(u);
	s+="<br/>";

	s+=selectRoleAndGroupForUser(u);

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
	s+="<h3>Inactivar:</h3>";
	s+="<button id=\"inactivateUser\" value=\""+ u.user_id +" "+ u.roles[0] +"\" onclick=\"inactivateUserRoleOnClick()\"> Inactivar usuario</button> Atención: inactivar un usuario no lo elimina de los grupos, solamente lo agrega al grupo de inactivos!<br/>";

	document.getElementById("profile").innerHTML = s;
}

function selectRoleAndGroupForUser(u){
	s="<br/><h3>Agregar a un grupo:</h3><br/>";
	s+="Agregar a <strong>"+ encodeHTML(u.user_name) + "</strong> al grupo ";
	s+=getGroupSelectHTML("newGroupId");
	s+= " en el rol ";
	s+=getRoleSelectHTML("newRole", u.roles );
	s+= " ";
	s+="<button id=\"newUserRoleInGroup\" onclick=\"addUserRoleInGroupProfileOnClick()\">Agregar</button>";
	s+="<br/>";
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
	document.getElementById("numberUsers").innerHTML = "<h3>Hay "+ allUsers.length.toString() + " usuarios registrados en Convidarte.</h3>";
	autocomplete(document.getElementById("userList"), optionList);
	return;
}

function prepareAddressGoogleMaps(street,number,city,province){
	return street +" "+number.toString()+", " +city+", "+province;
}

// escribe el elemento "ppal" con la data detallada de un grupo
function showGroupById(groupId){
	g = getGroup(groupId);
	members = g.members;
	s = "<h1>"+encodeHTML(g.name)+"</h1>";
	s+="<button id=\"downloadPDF\" onclick=\"downloadGroupDetailTable()\">Bajar en formato PDF</button><div id=\"downloadCSVLinkDiv\"></div><br/><br/>";
	s += "<table id=\"groupDetailTable\">\n";
	s+= "<tr><th>Id</th> <th>Nombre</th><th>Dirección</th><th>Celular</th><th>email</th><th>Rol(es)</th> </tr>"; 
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
		if (u.name!="" || u.last_name!="" ){
			s+= encodeHTML(u.user_name)+" ("+encodeHTML(u.name) +" " + encodeHTML(u.last_name) + ")";
		}else{
			s+= encodeHTML(u.user_name);
		}
		if ( currentSystem=="delegate" && (!ack)   ){
			s+=buttonAckDelegate(g.group_id,uid,u.roles_in_group[0].role);
		}
		s+="</td>";
		s+="<td><a href=\""+urlMaps+"\" target=\"_blank\">"+ encodeHTML(address)+"</a></td>";
		s+="<td>"+encodeHTML(u.cellphone)+"</td>";
		s+="<td style=\"word-wrap: break-word;\">"+encodeHTML(u.email)+"</td>";
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
			s+="<td>"+ deleteRoleButton(g.group_id,uid,role)+"</td><td>"+ deleteAndInactivateRoleButton(g.group_id,uid,role)+"</td>";
			s+="</tr>";
		}
		s+="</table></td>";//termina roles
		//s+= "<td>"+ details + "</td>";
		s+= "</tr>";
	}
	s+="</table>";
	if (currentSystem=="admin"){	
		s+="<h2> Cambiar nombre de grupo</h2>\n";
		s+="Nuevo nombre: <input id=\"newName\"></input>\n";
		s+="<button id=\"changeName\" onclick=\"changeGroupName()\">Cambiar nombre</button>";
	}
	s+="<br/><br/>";
	s+= groupDetailPrintable(g);
	groupDetailElement = document.getElementById('ppal');
	groupDetailElement.innerHTML = s;
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
		row = [uid,fullname,address,neighborhood,city,province,email,roles].map( x => '"' + x.replace(/"/g, '""') + '"' ).join(csvSeparator)
		text+=row+"\n";
	}
	var fileBlob = new Blob([text], {type: "application/octet-binary"});

	var link = document.createElement("a");
	link.setAttribute("href", URL.createObjectURL(fileBlob));
	link.setAttribute("download", filename);
	link.appendChild(document.createTextNode("Bajar hoja de cálculo (en formato .csv)"));
	document.getElementById("downloadCSVLinkDiv").appendChild(link);
}


//=====================================================================================
// las siguientes funciones escriben la lista de grupos, con mas o menos detalle dependiendo del Tab que queramos ver.
// esta se usa en map
function refreshGroupListMap(){
	groups = getGroups();
	groupsElement = document.getElementById('grupos');
	s = "<table>";
	s+="<thead><tr><td>Id</td><td>Nombre</td><td>#</td><td>Chefs</td><td>Distr.(s)</td><td>Deleg.</td></tr></thead>";
	s+="<tbody>";
	for (var i = 0; i < groups.length; i++) {
		g = groups[i];
		s += "<tr>"
		s+="<td>"+g.group_id.toString() +"</td>";
		s+="<td style=\"max-width:160px; word-wrap: break-word;overflow-y:auto; \" >" + encodeHTML(g.name) +"</td>";
		s+="<td>"+ (g.member_count) + "</td>";
		s+="<td>"+g.role_count.cook+"</td>";
		s+="<td>"+g.role_count.driver+"</td>";
		s+="<td>"+g.role_count.delegate+"</td>";
		s+="</tr>\n";
	}
	s+="</tbody>";
	s+="</table>";
	groupsElement.innerHTML = s;
}
// esta se usa en groups
function refreshGroupList(){
	groups = getGroups();
	groupsElement = document.getElementById('grupos');
	s = "<table id=\"groupsTable\">\n";
	s+= "<tr><th>Id</th> <th>Nombre</th> <th></th> <th>#</th> <th>Chefs</th> <th>Distr.</th> <th>Deleg.</th><th></th></tr>"; 
	for (var i = 0; i < groups.length; i++) {
		g= groups[i];
		details = "<button id=\"viewDetailGroup"+g.group_id.toString() +"\" type=\"button\" onclick=\"showGroup();\" value=\""+g.group_id.toString() + "\">Detalle</button>";
		deleteGroup = "<button id=\"DeleteGroup"+g.group_id.toString() +"\" type=\"button\" onclick=\"deleteGroupOnClick();\" value=\""+g.group_id.toString() + "\">Borrar grupo</button>";
		s+="<tr>\n";
		s+="<td>"+g.group_id.toString()+"</td>";
		s += "<td style=\"max-width:160px; word-wrap: break-word;overflow-y:auto; \">"+ encodeHTML(g.name)+"</td>";
		s+= "<td>"+ details + "</td>";
		s+= "<td>"+ g.member_count.toString()+ "</td>";
		s+= "<td>"+ g.role_count.cook+ "</td>";
		s+= "<td>"+ g.role_count.driver+ "</td>";
		s+= "<td>"+ g.role_count.delegate+ "</td>";
		s+= "<td>"+ deleteGroup + "</td>";
		s+= "</tr>";
	}
	s+="</table>";
	groupsElement.innerHTML = s;
}
// esta se usa en users
function refreshGroupListNoDetails(){
	groups = getGroups();
	groupsElement = document.getElementById('grupos');
	s = "<table id=\"groupsTable\">\n";
	s+= "<tr><th>Id</th> <th>Nombre</th> <th>#</th> <th>Chefs</th> <th>Distr.</th> <th>Deleg.</th></tr>"; 
	for (var i = 0; i < groups.length; i++) {
		g= groups[i];
		s+="<tr>\n";
		s+="<td>"+g.group_id.toString()+"</td>";
		s += "<td style=\"max-width:160px; word-wrap: break-word;overflow-y:auto; \">"+ encodeHTML(g.name)+"</td>";
		//s+= "<td>"+ details + "</td>";
		s+= "<td>"+ g.member_count.toString()+ "</td>";
		s+= "<td>"+ g.role_count.cook+ "</td>";
		s+= "<td>"+ g.role_count.driver+ "</td>";
		s+= "<td>"+ g.role_count.delegate+ "</td>";
		//s+= "<td>"+ deleteGroup + "</td>";
		s+= "</tr>";
	}
	s+="</table>";
	groupsElement.innerHTML = s;
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

//=====================================================================================

function refreshUserListUsers(){
	users = getUsersFiltered();
	if (onlyUsersWithoutAddress){
		users = users.filter(checkHasNoCoordinates);
	}
	cooksTable = document.getElementById("cooksTable");
	driversTable = document.getElementById("driversTable");
	delegatesTable = document.getElementById("delegatesTable");
	genericHead = "<thead><tr><th>Id</th> <th>Nombre</th><th>Dirección</th><th>Celular</th><th>email</th><th></th><th></th> </tr></thead>";
	cooksTableInnerHTML = genericHead+"<tbody>";
	driversTableInnerHTML = genericHead+"<tbody>";
	delegatesTableInnerHTML = genericHead+"<tbody>";
	var cookRows = new Array();
	var driverRows = new Array();
	var delegateRows = new Array();
	var ncooks = 0;
	var ndrivers = 0;
	var ndelegates = 0;
	var numberUsers = users.length;
	numberPages = Math.ceil(numberUsers/rowsPerPage);
	for (var i = currentPage*rowsPerPage; i < Math.min(numberUsers,(currentPage+1)*rowsPerPage) ; i++) {
		u = users[i];
		uid = u.user_id;
		address = u.address.street +" "+u.address.number.toString()+ " "+ u.address.floor_and_apartment + " ("+ u.address.neighborhood+") " + u.address.city+", "+u.address.province;
		addressGoogle = prepareAddressGoogleMaps(u.address.street, u.address.number, u.address.city, u.address.province);
		urlMaps = "https://www.google.com/maps/search/"+encodeURI(addressGoogle);
		row="<tr>";
		row+="<td>"+uid+"</td>";
		if (u.name!="" || u.last_name!="" ){
			row+="<td>"+encodeHTML(u.user_name)+" ("+encodeHTML(u.name) +" " + encodeHTML(u.last_name) + ")</td>";
		}else{
			row+="<td>"+encodeHTML(u.user_name)+"</td>";
		}
		row+="<td><a href=\""+urlMaps+"\" target=\"_blank\">"+ encodeHTML(address)+"</a></td>";
		row+="<td>"+encodeHTML(u.cellphone)+"</td>";
		row+="<td style=\"word-wrap: break-word;\">"+encodeHTML(u.email)+"</td>";
		row += "<td>" + getGroupSelectHTML( "selectGroup" + uid.toString() ) + "</td>";
		row += "<td><button id=\"agregar"+ uid.toString() + "\" onclick=\"assignGroup()\" value=\""+ uid.toString() +"\" name=\""+encodeHTML(u.user_name) +"\" visible=\"1\"  > Agregar </button></td>";
		row += "</tr>\n";
		if (u.role == "cook") {
			cookRows[ncooks++]=row;

		}
		if (u.role == "driver") {
			driverRows[ndrivers++]=row;
		}
		if (u.role == "delegate") {
			delegateRows[ndelegates++]=row;
		}
	}
	cooksTableInnerHTML += cookRows.join('\n') + "</tbody>";
	driversTableInnerHTML += driverRows.join('\n') + "</tbody>";
	delegatesTableInnerHTML += delegateRows.join('\n') + "</tbody>";

	cooksTable.innerHTML =cooksTableInnerHTML;
	driversTable.innerHTML = driversTableInnerHTML;
	delegatesTable.innerHTML =delegatesTableInnerHTML;
}
