Vue.component('table-users-groups', {
	data: function(){
			return {
				state: store.state,
				userGroups: [],
			}
	},
	props: ["userId"],
	computed:{
		refresh: function(){
			console.log("Refreshing at",this.state.refreshTime);
			var self = this;
			if (this.userId==0) return "";
			getUserGroups(parseInt(this.userId,10)).then(res => {
				self.userGroups = res["groups"];
			});
			return "";
		},
		rolesInGroups: function(){
			console.log("tablita grupos del usuario", this.state.refreshTime);
			var userGroups = this.userGroups;
			var urgs=[];
			for ( var i=0; i<userGroups.length; i++){
				var g = userGroups[i];
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
<div>{{refresh}}
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
