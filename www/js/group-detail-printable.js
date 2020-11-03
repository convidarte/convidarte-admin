Vue.component('group-detail-printable', {
	data: function(){
			return {
				state: store.state,
			}
	},
	props: ["group"],
	computed:{
		groupName: function(){
			return (this.group==null) ? "" : this.group.name;
		},
		groupMembers: function(){
			var g = this.group;
			if (g==null) return [];
			var members = g.members;
			var membersToShow = [];
			for (var i = 0; i < members.length; i++){
				var u = members[i];
				var user = {};
				user.userId = u.user_id;
				user.addressToShow =addressToShow(u);
				user.urlMaps = urlGoogleMaps(u);
				user.nameToShow = nameToShow(u);
				user.cellphone = u.cellphone;
				user.email = u.email;
				user.rolesInGroup = u.roles_in_group.map( x=> x["role"] ).map(roleInSpanish).join( " ");
				membersToShow.push(user);
			}
			return membersToShow;
		},
	},
	methods: {
		downloadGroupDetailTable: function(){
			var gid = this.group.group_id;
			var name = this.group.name;
			var filename = "grupo "+gid.toString()+" - "+ name + " - " + getDateString() +".pdf";
			if(gid!=0){
				downloadElementAsPDF("groupDetailTablePrintable", filename, "avoid");
			}
			return false;
		},
	},
	template:`
<div id="groupDetailPrintableContainer">
	<div>
		<a id="bajarPDF" href="#" @click="downloadGroupDetailTable">Bajar en formato PDF</a>
	</div>
	<div style="display:none;">  
		<div id="groupDetailTablePrintable">
			<br><br><br><br><br><br>
			<h1 align="center">{{ groupName }}</h1><br/>
			<table style="border: 1px solid black;border-collapse:collapse;width:650px;margin: auto;">
			<thead><tr><th>Id</th> <th>Nombre</th><th>Dirección</th><th>Celular</th><th>Email</th><th>Rol(es)</th> </tr></thead>
			<tbody>
				<tr v-for="user in groupMembers">
					<td>{{ user.userId }}</td>
					<td>{{ user.nameToShow }}</td>			
					<td><a :href="user.urlMaps">{{ user.addressToShow }} </a></td>
					<td>{{ user.cellphone}}</td>
					<td style="word-wrap: break-word;">{{ user.email }}</td>
					<td> {{ user.rolesInGroup }}</td>
				</tr>	
			</tbody>
			</table>
		</div>
	</div>
</div>
` 
})
