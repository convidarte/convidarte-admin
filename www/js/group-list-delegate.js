Vue.component('group-list-delegate', {
	data: function(){
			return {
				state: store.state,
			}
	},
	methods: {
		showGroup: function(event){
			var gid = parseFloat(event.target.getAttribute("data-gid"),10);
			if (gid.toString()!="NaN"){
				store.setKey("currentGroupId",gid);
				showGroupById(gid);
			}
		},
	},
	computed: {
		groupsDelegate: function(){
			console.log("group delegate ",store.state.refreshTime);		
			return getUserGroups(this.state.adminUserId).filter( function(g){ return g.roles.includes("delegate");} );
		},
	},

	template:`
<div>
	<ul>
		<li class="filter-group">Mis grupos:</li>
		<li class="filter-group" v-for="g in groupsDelegate" style="padding:6px;">
			<a href="#" v-on:click="showGroup" :data-gid="g.group_id" > {{ g.name }} </a>
		</li>
	</ul>
</div>
`
});

/*
function refreshGroupListDelegate(){
	var groups = getUserGroups(adminUserId).filter( function(g){ return g.roles.includes("delegate");} );


	groupsElement = document.getElementById('gruposDelegado');
	s = "<table id=\"groupsTable\">\n";
	s+= "<tr><th>Id</th> <th>Nombre</th> <th></th> <th>#</th> <th>Chefs</th> <th>Distr.</th> <th>Deleg.</th></tr>"; 
	for (var i = 0; i < groups.length; i++) {
		g= groups[i];
		details = "<button id=\"viewDetailGroup"+g.group_id.toString() +"\" type=\"button\" onclick=\"showGroup();\" value=\""+g.group_id.toString() + "\">Detalle</button>";
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
}*/
