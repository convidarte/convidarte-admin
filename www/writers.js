
// devuelve el html de un boton para sacar un user-role de un grupo.
function deleteRoleButton(gid,uid,role){
	var s = "<button id=\"delete_" + gid.toString() + "_" + uid.toString() + "_" + role + "\" type=\"button\" onclick=\"deleteMemberOnClick();\" value=\"" + gid.toString() + " " + uid.toString() + " " + role + "\">Quitar del grupo</button>";
	return s;
}

function deleteAndInactivateRoleButton(gid,uid,role){
	var s = "<button id=\"delete_inactivate_" + gid.toString() + "_" + uid.toString() + "_" + role + "\" type=\"button\" onclick=\"deleteMemberAndInactivateOnClick();\" value=\"" + gid.toString() + " " + uid.toString() + " " + role + "\">Quitar e inactivar usuario</button>";
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

// devuelve el HTML de un select con los usuarios existentes
function getUsersSelectHTML(selectId){
	s = "<select id=\""+selectId+"\" onchange=\"showUserProfile()\" >\n";
	s += "<option disabled selected value> seleccionar usuario </option>";
	for (var i = 0; i < users.length; i++) {
		u = users[i];
		uid = u.user_id.toString();
	   s+="<option value=\"" + uid + "\" >"+ uid + ": " + encodeHTML(u.user_name) +"</option>\n";
	}
	s+="</select>\n";
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
	get_user_roles();
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
	//get_user_roles(); ya lo traemos en getNeighborhoodList :D
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
		u = getUserById(uid);
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
		s+="<button id=\"agregar"+ uid.toString() + "\" onclick=\"assignGroupMap()\" value=\""+ uid.toString() +"\" name=\""+encodeHTML(u.user_name) +"\" visible=\"1\"  > Agregar </button></td>";
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

	if(u.roles.indexOf("delegate")<0){
		s+="<br/> <button id=\"addDelegateRole\" onclick=\"addDelegateRole()\"> Agregar delegado como rol asumible</button><br/>";
	}
	s+="<br/> <button id=\"inactivateUser\" value=\""+ u.user_id +" "+ u.roles[0] +"\" onclick=\"inactivateUserRoleOnClick()\"> Inactivar usuario</button> Atención: inactivar un usuario no lo elimina de los grupos, solamente lo agrega al grupo de inactivos!<br/>";

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
			t+= "<tr><td>" +gid.toString() +"</td><td>"+encodeHTML(g.name)+"</td><td>"+role+"</td><td>"+deleteRoleButton(gid,uid,role)+"</td></tr>";
		}
	}
	t+="</tbody></table>";
	return t;
}



// escribe el elemento usersListContainer con la lista de usuarios para seleccionar
function updateSelectUsers(){
	users = get_users();
	optionList = new Array();
	for ( var i=0; i<users.length; i++){
		u = users[i];
		optionList.push( u.user_id.toString()+": "+ encodeHTML(u.user_name)	+ " ("+encodeHTML(u.name) + " " + encodeHTML(u.last_name)+")");
	}
	//document.getElementById("usersListContainer").innerHTML = getUsersSelectHTML("userList");
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
		s+="<tr>\n";
		s+="<td>"+uid+"</td>";
		if (u.name!="" || u.last_name!="" ){
			s+="<td>"+encodeHTML(u.user_name)+" ("+encodeHTML(u.name) +" " + encodeHTML(u.last_name) + ")</td>";
		}else{
			s+="<td>"+encodeHTML(u.user_name)+"</td>";
		}
		s+="<td><a href=\""+urlMaps+"\" target=\"_blank\">"+ encodeHTML(address)+"</a></td>";
		s+="<td>"+encodeHTML(u.cellphone)+"</td>";
		s+="<td style=\"word-wrap: break-word;\">"+encodeHTML(u.email)+"</td>";
		// comienza roles:		
		s+="<td><table>";
		for (var j =0;  j< u.roles.length; j++){
			var role = u.roles[j];
			var roleSpanish="";
			if(role=="cook"){
				roleSpanish ="Chef";
			}else if (role=="driver"){
				roleSpanish = "Distribuidor";
			}else if(role=="delegate"){
				roleSpanish= "Delegado";			
			}
			s += "<tr><td>" + roleSpanish + "</td><td>" + deleteRoleButton(g.group_id,uid,role) + "</td><td>"+deleteAndInactivateRoleButton(g.group_id,uid,role)+"</td></tr>";
		}
		s+="</table></td>";//termina roles
		//s+= "<td>"+ details + "</td>";
		s+= "</tr>";
	}
	s+="</table>";
	s+="<h2> Cambiar nombre de grupo</h2>\n";
	s+="Nuevo nombre: <input id=\"newName\"></input>\n";
	s+="<button id=\"changeName\" onclick=\"changeGroupName()\">Cambiar nombre</button>";
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
		if (u.name!="" ){ // el delegado no necesita saber el apellido
			s+="<td>"+encodeHTML(u.user_name)+" ("+encodeHTML(u.name)+")</td>";
		}else{
			s+="<td>"+encodeHTML(u.user_name)+"</td>";
		}
		s+="<td><a href=\""+urlMaps+"\">"+ encodeHTML(address)+"</a></td>";
		s+="<td>"+encodeHTML(u.cellphone)+"</td>";
		s+="<td style=\"word-wrap: break-word;\">"+encodeHTML(u.email)+"</td>";
		// comienza roles:		
		s+="<td>"+u.roles.map(roleInSpanish).join( " ")+"</td>";
		s+= "</tr>";
	}
	s+="</tbody></table></div></div>";
	return s;
}

function getGroupCSV(g){
	members = g.members;
	filename = "grupo " + g.group_id.toString() + " - " + name + " - " + getDateString() + ".csv";
	var text = "";
	csvSeparator = ";";
	text += "Id"+csvSeparator+"Nombre"+csvSeparator+"Dirección"+csvSeparator+"Celular"+csvSeparator+"Email"+csvSeparator+"Rol(es)\n"; 
	for (var i = 0; i < members.length; i++){
		u = members[i];
		uid = u.user_id;
		address = u.address.street +" "+u.address.number.toString()+ " "+ u.address.floor_and_apartment + " ("+ u.address.neighborhood+") " + u.address.city+", "+u.address.province;
		if (u.name!="" ){ // el delegado no necesita saber el apellido
			fullname=u.user_name+" ("+u.name+")";
		}else{
			fullname=u.user_name;
		}
		cellphone= u.cellphone;
		email = u.email;
		roles = u.roles.map(roleInSpanish).join( " ");
		row = "\"" + uid + "\""+csvSeparator+"\"" + fullname + "\""+csvSeparator+"\"" + address + "\""+csvSeparator+"\"" + cellphone + "\""+csvSeparator+"\"" + email + "\""+csvSeparator+"\"" + roles + "\"\n";
		text+=row;
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
function refresh_group_list_map(){
	groups = get_groups();
	groups_element = document.getElementById('grupos');
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
	groups_element.innerHTML = s;
}
// esta se usa en groups
function refresh_group_list(){
	groups = get_groups();
	groups_element = document.getElementById('grupos');
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
	groups_element.innerHTML = s;
}
// esta se usa en users
function refresh_group_list_nodetails(){
	groups = get_groups();
	groups_element = document.getElementById('grupos');
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
	groups_element.innerHTML = s;
}
//=====================================================================================

function refresh_user_list_users(){
	users = getUsersFiltered();
	if (onlyUsersWithoutAddress){
		users = users.filter(checkHasNoCoordinates);
	}
	cooksTable = document.getElementById("cooksTable");
	driversTable = document.getElementById("driversTable");
	delegatesTable = document.getElementById("delegatesTable");
	genericHead = "<thead><tr><th>Id</th> <th>Nombre</th><th>Dirección</th><th>Celular</th><th>email</th><th></th><th></th> </tr></thead>";
	cooksTable.innerHTML= genericHead+"<tbody>";	
	driversTable.innerHTML=genericHead+"<tbody>";	
	delegatesTable.innerHTML=genericHead+"<tbody>";	
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
		row += "<td>" + getGroupSelectHTML( "selectGroup" + i.toString() ) + "</td>";
		row += "<td><button id=\"agregar"+ i.toString() + "\" onclick=\"assignGroupGroups()\" value=\""+ i.toString() +"\" name=\""+encodeHTML(u.user_name) +"\" visible=\"1\"  > Agregar </button></td>";
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
	cooksTable.innerHTML += cookRows.join('\n');
	driversTable.innerHTML += driverRows.join('\n');
	delegatesTable.innerHTML += delegateRows.join('\n');
	cooksTable.innerHTML += "</tbody>";	
	driversTable.innerHTML += "</tbody>";	
	delegatesTable.innerHTML += "</tbody>";	
}
