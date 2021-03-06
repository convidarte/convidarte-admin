Vue.component('modal-profile-component', {
	data: function(){
			return {
				state: store.state,
				user: null,
				marker:{},
				centerMap: null,
			}
	},
	computed:{
		refresh : function(){
			console.log("refreshing user profile at", this.state.refreshTime);
			this.displayUserData();
		},
		userId :function(){
			return store.state.currentUserId;
		},
		mapConfig:function(){
			var mapProp= {
			  center:new google.maps.LatLng(-34.608558, -58.392617),
			  zoom:14,
			};
			return mapProp;
		},
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
		displayUserData:function(){
			var uid= store.state.currentUserId;
			if(uid==0) return "";
			var self = this;
			getUserProfile(uid).then( user => {
				user.stringRolesInSpanish = user.roles.map(roleInSpanish).join( ", " );
				user.fullName = fullName(user);
				user.fullAddress = fullAddressToShow(user);
				user.urlGoogleMaps = urlGoogleMaps(user);
				user.lastActiveDate = (new Date(user["last_active_date"])).toLocaleDateString();
				var coords = { lat: parseFloat(user.address.latitude), lng: parseFloat(user.address.longitude) };
				this.centerMap = coords;
				this.marker={
					id: "user_profile_marker_" + (user["user_id"]).toString(),
					position: coords,
					title: user["user_name"],
					label: {text: user["user_name"],fontWeight:"bold",fontSize: "18px"},
				};
				$('#modalProfile').on('shown.bs.modal', function (e) {
					$('body').addClass('modal-open');
				});
				self.user=user;
			});
			return "";
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
				
				<div class="row" v-if="user">
					<div class="col-md-8">??ltima actividad en el sistema: {{user.lastActiveDate}}</div>
				</div>
				
				<div class="row">
					<div class="col">		
						<google-map-loader :mapConfig="mapConfig" class="profile-map" :center="centerMap">
							<template slot-scope="{ google, map }">
							  <google-map-marker
							  	:key="marker.id"
								:marker="marker"
								:google="google"
								:map="map"
							  />
							</template>
						</google-map-loader>						
					</div>
				</div>
				<div class="row" v-if="user">
					<div class="col">
						<h3>Grupos</h3>
						<table-users-groups :userId="userId" ></table-users-groups>
					</div>
				</div>
				<div class="row" v-if="user">
					<div class="col">
						<h3>Inactivar usuario</h3>
						<p>Si procedes, este usuario quedar?? inactivado. Podr??s encontrarlo luego en usuarios inactivos.</p>
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

