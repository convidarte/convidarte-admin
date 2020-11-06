Vue.component('modal-add-user-role-to-group', {
	data: function(){
			return {
				state: store.state,
			}
	},
	computed:{
		user: function(){
			var uid = store.state.currentUserId;
			var u = JSON.parse(JSON.stringify(getUserWithRolesById(uid)));
			if (u==null) return null;
			u.fullName = fullName(u);
			roles = [];
			for (i in u.roles){
				role = u.roles[i];
				var data = {"role": role, "roleInSpanish": roleInSpanish(role) };
				if (role!= "admin"){
					roles.push( data );
				}
			}
			u.roles = roles;
			return u;
		},
	},
	methods:{
		addUserRoleInGroup: function(){
			var uid = store.state.currentUserId;
			var gid = document.getElementById("newGroupId").value;
			var role = document.getElementById("newRole").value;
			var groupName = getGroupNameById(gid);
			addUserRoleToGroup(uid, role, gid, groupName);
			this.close();
		},
		close: function(){
			$("#modalAddGroup").modal('hide');
			showModalProfile(store.state.currentUserId);
		}
	},
	template:`
<div>
	<div class="modal fade" id="modalAddGroup" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-4" v-if="user">
							<h2 id="modalProfileFullName" class="modalFullName">{{user.fullName}}</h2>
							<div id="modalProfileAlias" class="modalAlias">@{{user.user_name}}</div>
						</div>
						<div class="row">
							<div class="col" v-if="user">
								<h3>Agregar a un grupo:</h3>
								<p id="modalAddGroupContent"> 
									Agregar al grupo
									<select-group-component id="newGroupId"></select-group-component>
									en el rol 
									<select id="newRole" style="max-width:120px;">
										<option disabled selected value> elegir rol </option>
										<option v-for="row in user.roles" :value="row.role">{{row.roleInSpanish}}</option>
									</select>
									<div id="modalAddGroupSelectRoleContainer"></div>
									<button id="newUserRoleInGroup" @click="addUserRoleInGroup">Agregar</button><br>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
`
});

