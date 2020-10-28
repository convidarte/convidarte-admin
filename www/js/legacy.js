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


