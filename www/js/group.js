// escribe el elemento "ppal" con la data detallada de un grupo
function showGroupById(groupId){
	groupDetailElement = document.getElementById('groupMembers');
	if (groupId==0){
		groupDetailElement.innerHTML="";
		return;
	}
	var g = getGroup(groupId);
	var url = "/grupo/"+ g["group_id"]+"/"+g["name"];
	window.history.pushState('grupos', '', url);

	var members = g.members;
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
		row = [uid,fullname,address,neighborhood,city,province,cellphone,email,roles].map( x => '"' + x.replace(/"/g, '""') + '"' ).join(csvSeparator);
		text+=row+"\n";
	}
	var fileBlob = new Blob([text], {type: "application/octet-binary"});

	var link = document.createElement("a");
	link.setAttribute("href", URL.createObjectURL(fileBlob));
	link.setAttribute("download", filename);
	link.appendChild(document.createTextNode("Bajar hoja de cálculo (en formato .csv)"));
	document.getElementById("downloadCSVLinkDiv").appendChild(link);
}

