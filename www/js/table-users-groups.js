Vue.component('table-users-groups', {
	data: function(){
			return {
				state: store.state,
			}
	},
	props: ["userId"],
	computed:{
		rolesInGroups: function(){
			console.log("tablita grupos del usuario", this.state.refreshTime);
			var userGroupsRequest = getUserGroups(parseInt(this.userId,10));
			var urgs=[];
			for ( var i=0; i<userGroupsRequest.length; i++){
				var g = userGroupsRequest[i];
				var groupId = g["group_id"];
				for (var j = 0; j < g.roles.length; j++){
					var urg={};
					urg.role = g.roles[j];
					urg.groupId = groupId;
					urg.groupName = g.name;
					urg.roleInSpanish = roleInSpanish(urg.role);
					urgs.push(urg);
				}
			}
			return urgs;
		},
	},
	methods: {
		showGroup:function(){
			var gid = event.target.getAttribute("groupId");
			showGroupById(gid);
			$("#modalProfile").modal('hide');
		},
	},
	template:`
<div>
<table v-if="rolesInGroups && (rolesInGroups.length)" class="table table-striped">
	<thead>
		<tr><th>Id grupo</th><th>Nombre grupo</th><th>Rol</th><th></th></tr>
	</thead>
	<tbody>	
	<tr v-for="urg in rolesInGroups">
		<td>{{urg.groupId}}</td>
		<td><a href="#" @click="showGroup" :groupId="urg.groupId">{{urg.groupName}}</a></td>
		<td>{{urg.roleInSpanish}}</td>
		<td><button-delete-role
				:groupId="urg.groupId"
				:role="urg.role"
				:userId="userId"
		></button-delete-role></td>
	</tr>
	</tbody>
</table>
<p v-else>
	Este usuario no pertenece a ningún grupo.
</p>
</div>

`,
});
