// devuelve el HTML de un select con los grupos existentes y el id especificado.
function getGroupSelectHTML(selectId){
	groups = getGroups();
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

// escribe el elemento usersListContainer con la lista de usuarios para seleccionar
function updateSelectUsers(){
	allUsers = userList();
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

