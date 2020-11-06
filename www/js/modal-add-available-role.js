Vue.component('modal-add-available-role', {
	data: function(){
			return {
				state: store.state,
			}
	},
	computed:{
		user: function(){
			console.log("refresh modal-add-available-role", this.state.refreshTime);
			if (store.state.currentUserId==0){
				return null
			}
			var u = JSON.parse(JSON.stringify(getUserWithRolesById(store.state.currentUserId)));
			if (u==null) return;
			allRoles = ["cook","driver","delegate"];
			styles = {
				"cook":"background-color:Salmon;",
				"driver":"background-color:SpringGreen;",
				"delegate":"background-color:MediumPurple;",
			};
			roles = [];
			for (i in allRoles){
				role = allRoles[i];
				if(u.roles.indexOf(role)<0){
					var data = {"role": role, "style": styles[role], "roleInSpanish": roleInSpanish(role) };
					roles.push( data );
				}
			}
			u.fullName = fullName(u);
			u.roles = roles;
			return u;
		},
	},
	methods:{
		addUserRole:function(){
			var role = event.target.getAttribute("role");
			var uid = store.state.currentUserId;
			addRole(uid,role);
			this.close();
		},
		close: function(){
			$("#modalAddRole").modal('hide');
			showModalProfile(store.state.currentUserId);
		}
	},
	template:`
<div>
	<div class="modal fade" id="modalAddRole" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body" v-if="user">
					<div class="row">
						<div class="col-md-4">
							<h2 class="modalFullName">{{user.fullName}}</h2>
							<div class="modalAlias">@{{user.user_name}}</div>
						</div>
						<div class="row">
							<div class="col">
								<h3>Agregar un rol asumible:</h3>
								<ul>
									<li  v-for="row in user.roles">
										<button :role="row.role" :style="row.style" @click="addUserRole">
											Agregar {{row.roleInSpanish}} como rol asumible
										</button>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>`,
});

