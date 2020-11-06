Vue.component('modal-profile-component', {
	data: function(){
			return {
				state: store.state,
				user: null,
			}
	},
	computed:{
		refresh : function(){
			var uid= store.state.currentUserId;
			console.log("(",this.state.refreshTime,") refreshing profile for user #",uid);
			this.user = getUserById(uid);
			if( this.user == null ) return "";
			this.user.stringRolesInSpanish = this.user.roles.map(roleInSpanish).join( ", " );
			this.user.fullName = fullName(this.user);
			this.user.fullAddress = fullAddressToShow(this.user);
			this.user.urlGoogleMaps = urlGoogleMaps(this.user);
			var coords = { lat: parseFloat(this.user.address.latitude), lng: parseFloat(this.user.address.longitude) };
			if(userMarkerMapProfile==null){
				userMarkerMapProfile = new google.maps.Marker({});
			}
			userMarkerMapProfile.setPosition(coords);
			userMarkerMapProfile.setLabel({text:this.user["user_name"],fontWeight:"bold",fontSize: "18px"});
			userMarkerMapProfile.setMap(mapProfile)
			centerMapOn(mapProfile,coords.lat,coords.lng);
			return "";
		},
		userId :function(){
			return store.state.currentUserId;
		}
	},
	methods:{
		open: function(){
			$("#modalProfile").modal();
			window.history.pushState('perfil', '', urlUserProfile(this.user));
		},
		inactivateUser: function(){
			inactivateUserRole(this.user["user_id"], this.user.roles[0]);
			refreshEverything();
		},
		shareUserProfile: function(){			
			var u = this.user;
			var url = window.location.origin+urlUserProfile(u);
			navigator.clipboard.writeText(url);
			alert("El link para compartir fue copiado al portapapeles");
		},
		launchGiveNewRoleModal: function(){
			$("#modalProfile").modal('hide');
			$("#modalAddRole").modal();
		},
		launchAddToGroupModal:function(){
			$("#modalProfile").modal('hide');
			$("#modalAddGroup").modal();
		},

	},
	template:
`
<div>
	{{ refresh }}
	<div
		class="modal fade"
		id="modalProfile"
		tabindex="-1"
		role="dialog"
		aria-labelledby="exampleModalLabel"
		aria-hidden="true">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="resetURL()">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="row" v-if="user">
						<div class="col-md-4">
							<h2 class="modalFullName">{{user.fullName}}</h2>
							<div class="modalAlias">@{{user.user_name}}</div>
					</div>
					<div class="col-md-8">
						<ul class="profileActions">
							<li>
								<button
									type="button"
									class="btn btn-primary float-right"
									@click="shareUserProfile" >Compartir
								</button>
							</li>
							<li>
								<button
									type="button"
									class="btn btn-primary float-right"
									@click="launchAddToGroupModal" >Agregar a grupo
								</button>
							</li>
							<li>
								<button
									type="button"
									class="btn btn-primary float-right"
									@click="launchGiveNewRoleModal">Asignar rol asumible
								</button>
							</li>
						</ul>
					</div>
				</div>
				<div class="row" v-if="user">
					<div class="col">
						<ul>
							<li class="modalUserId">#{{user.user_id}}</li>
							<li>{{user.stringRolesInSpanish}}</li>
							<li>{{user.cellphone}}</li>
							<li>{{user.email}}</li>
						</ul>
					</div>
				</div>
				<div class="row" v-if="user">
					<div class="col-md-8">{{user.fullAddress}}</div>
					<div class="col-md-4">
						<a class="btn btn-primary float-right mb-1" target="_blank" :href="user.urlGoogleMaps" role="button">
							Ver en Google maps
						</a>
					</div>
				</div>
				<div class="row">
					<div class="col">
						<div id="profileMap"></div>
					</div>
				</div>
				<div class="row" v-if="user">
					<div class="col">
						<h3>Grupos</h3>
						<table-users-groups :userId="userId"></table-users-groups>
					</div>
				</div>
				<div class="row" v-if="user">
					<div class="col">
						<h3>Inactivar usuario</h3>
						<p>Si procedes, este usuario quedará inactivado. Podrás encontrarlo luego en usuarios inactivos.</p>
						<button type="button" class="btn btn-danger" @click="inactivateUser">
							Inactivar usuario
						</button>
					</div>
				</div>
			</div>
			</div>
		</div>
	</div>
	<modal-add-available-role></modal-add-available-role>
	<modal-add-user-role-to-group></modal-add-user-role-to-group>
</div>
`
})

