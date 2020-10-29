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


function refreshUserListUsers(){
	availableUsers = getUsersFiltered();
	if (onlyUsersWithoutAddress){
		availableUsers = availableUsers.filter(checkHasNoCoordinates);
	}
	usersListTable = document.getElementById("usersListTable");
	genericHead = "<thead><tr><th scope=\"col\">ID</th><th scope=\"col\">Rol</th><th scope=\"col\">Nombre y apellido</th><th scope=\"col\">Dirección</th><th scope=\"col\">Asignar grupo</th><th scope=\"col\"></th></tr></thead>";
	usersListTableInnerHTML = genericHead+"<tbody>";
	var userRows = new Array();
	var nUsers = 0;
	var numberUsers = users.length;
	numberPages = Math.ceil(numberUsers/rowsPerPage);
	for (var i = currentPage*rowsPerPage; i < Math.min(numberUsers,(currentPage+1)*rowsPerPage) ; i++) {
		u = availableUsers[i];
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
		row+="<td><a id=\"" + viewProfileLink + "\" href=\"\" class=\"viewProfileLink\" >" + nameToShow + "</a></td>";
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

