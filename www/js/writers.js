function tidySpaces(s){
	return s.replace(/\s+/g, ' ').trim();
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

function userMarkerContent(uid,role){
	u = getUserById(uid);
	s = "<a href=\"#\" data-uid=\""+uid.toString()+"\" onclick=\"showModalProfileTooltip()\">"+ encodeHTML(u.name) + encodeHTML(u.last_name) + "</a>";
	s += "<div>@"+ encodeHTML(u.user_name)+ " - "+ u.user_id.toString()+ "</div>";
	s += "<div>" + roleInSpanish(role) + "</div>";
	s += "<div>" + encodeHTML(u.address.street) + " " + u.address.number.toString() + ", "+encodeHTML(u.address.city)+"</div>";
	s+= getGroupSelectHTML( "selectGroup" + uid.toString() ) + "<br/>";
	s+="<button id=\"agregar"+ uid.toString() + "\" onclick=\"assignGroup()\" value=\""+ uid.toString() +"\" name=\""+encodeHTML(u.user_name) +"\" visible=\"1\"  > Agregar </button></td>";
	return s;
}

function prepareAddressGoogleMaps(street,number,city,province){
	return street +" "+number.toString()+", " +city+", "+province;
}

