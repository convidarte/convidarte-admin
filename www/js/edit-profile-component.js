Vue.component('edit-profile', {
	data: function(){
		return {
			isEditingProfile : false,
			messageUpdatingProfile: "",
			messageEditingPassword: "",
			showVehicleSelector:false,
		}
	},
	computed:{
		refresher(){
			console.log("refreshing edit-profile data",store.state.refreshTime);
			if(!this.isEditingProfile) this.displayUserData();
			this.refreshReadOnly();
		},	
	},
	methods: {
		startEditingProfile(){
			this.isEditingProfile=true;
			this.refreshReadOnly();
		},
		stopEditingProfile(){
			this.isEditingProfile=false;
			this.messageUpdatingProfile = "";
			this.displayUserData();
			this.refreshReadOnly();
		},
		refreshReadOnly(){
			if ((!this.$refs) || (!this.$refs["name"])) return;
			var inputs=["name","last_name","cellphone","email","street","number","floor_and_apartment","extra_info"];
			var checkboxesAndSelects=["cook","driver","province","location","vehicle"];
			if(this.isEditingProfile){
				inputs.forEach(x => this.$refs[x].removeAttribute("readonly"));
				inputs.forEach(x => this.$refs[x].setAttribute("style", "color:#000000;background-color:#ffffff;"));
				checkboxesAndSelects.forEach(x => this.$refs[x].removeAttribute("disabled"));
			}else{
				inputs.forEach(x => this.$refs[x].setAttribute("readonly", true));
				inputs.forEach(x => this.$refs[x].setAttribute("style", "color:#808080;background-color:#ededed;"));
				checkboxesAndSelects.forEach(x => this.$refs[x].setAttribute("disabled", "disabled"));
			}
		},
		updateProfile(){
			var payload=this.getPayload();
			console.log("payload",payload);
			var result = this.validatePutProfilePayload(payload);
			if(!result){
				this.messageUpdatingProfile = "Error de validacion";
				return;
			}
			//send request
			var self=this;
			do_request("/users/"+store.state.adminUserId.toString(), payload, true, "PUT").then(
				data =>{
					self.messageUpdatingProfile = "Perfil actualizado";
					self.isEditingProfile=false;	
					self.refreshReadOnly();
				}
			).catch(
				data =>{
					// TODO cubrir este caso: {"code":"email_already_taken","message":"email already taken"}
					self.messageUpdatingProfile = "Error al actualizar el perfil";
				}
			);
		},
		displayUserData(){
			var self=this;
			do_request("/users/"+store.state.adminUserId.toString(), null, true, "GET").then(
				user =>{
					console.log(user);
					if(user){
						self.$refs["name"].value = user.name;
						self.$refs["last_name"].value = user.last_name;
						self.$refs["cellphone"].value = user.cellphone;
						self.$refs["email"].value = user.email;
						self.$refs["street"].value = user.address.street;
						self.$refs["number"].value = user.address.number;
						self.$refs["floor_and_apartment"].value = user.address.floor_and_apartment;
						self.$refs["province"].value =user.address.province;
						if(user.address.province=="CABA"){
							self.$refs["location"].value =user.address.neighborhood;
						}
						if(user.address.province=="BUENOS AIRES"){
							self.$refs["location"].value =user.address.city;
						}
						self.$refs["extra_info"].value =user.address.extra_info;
						self.$refs["cook"].checked = user.roles.includes("cook");
						self.$refs["driver"].checked = user.roles.includes("driver");
						self.showVehicleSelector=user.roles.includes("driver");
						if(user.driver) self.$refs["vehicle"].value = user.driver.vehicle;
						self.refreshReadOnly();
					}
				});
		},
		getPayload(){
			return {
				name: this.$refs["name"].value,
				last_name: this.$refs["last_name"].value,
				address: {
					street: this.$refs["street"].value,
					number: parseFloat(this.$refs["number"].value,10),
					floor_and_apartment: this.$refs["floor_and_apartment"].value,
					extra_info: this.$refs["extra_info"].value,
					zip_code: "",
					neighborhood: this.$refs["province"].value=="CABA" ? this.$refs["location"].value : "",
					commune: "",
					city: this.$refs["province"].value!="CABA" ? this.$refs["location"].value : "CABA",
					province: this.$refs["province"].value,
				},	
				cellphone: this.$refs["cellphone"].value,
				email: this.$refs["email"].value,
				organization: "",
				roles: ["driver","cook"].filter( role=> this.$refs[role].checked ),
				cook: {
					availability: {
						monday: true,
						tuesday: true,
						wednesday: true,
						thursday: true,
						friday: true,
						saturday: true,
						sunday: true
					},
					max_dishes: 20
				},
				driver: {
					availability: {
						monday: true,
						tuesday: true,
						wednesday: true,
						thursday: true,
						friday: true,
						saturday: true,
						sunday: true,
						morning: true,
						afternoon: false,
						evening: false
					},
					vehicle: this.$refs["vehicle"].value,
				},							
			};
		},
		validatePutProfilePayload(payload){
			// TODO Mostrar feedback validacion
			//return false;
			return true;
		},
		toggleShowVehicleSelector(){
			this.showVehicleSelector=!(this.showVehicleSelector);
		},
		updatePassword(){
			if (this.$refs["new-password"].value == this.$refs["repeat-new-password"].value ){
				var url = "/users/"+ store.state.adminUserId.toString() +"/password";
				console.log(url);
				do_request(url, { password: this.$refs["new-password"].value }, true, "PUT").then(
					data =>{
						this.messageEditingPassword="Contraseña actualizada correctamente";
					}
				).catch(
					data=> {
						alert("Error, no se pudo actualizar la contraseña");
					}
				);
				return;
			}
			this.messageEditingPassword = "Las contraseñas no coinciden";
		},
	},
	mounted(){
		this.displayUserData();
	},
	template :`
<div class="list-container" style="width:100%;">
{{refresher}}
	<h2>Mis datos</h2>
	
	<h5>Datos personales</h5>
	Nombre <input type="text" ref="name"></input><br>
	Apellido <input type="text" ref="last_name"></input><br>
	Celular <input type="text" ref="cellphone"></input><br>
	Email <input type="text" ref="email"></input><br>

	<h5>Dirección</h5>
	Calle <input type="text" ref="street"></input><br>
	Número <input type="number" ref="number"></input><br>
	Piso/Departamento <input type="text" ref="floor_and_apartment"></input><br>
	Provincia <select type="select" ref="province">
		<option value="CABA">Ciudad Autónoma de Buenos Aires</option>
		<option value="BUENOS AIRES">Provincia de Buenos Aires</option>
	</select><br>
	Localidad/Barrio <input type="select" ref="location"></input><br>
	Más indicaciones <input type="select" ref="extra_info"></input><br>
	<h5>Puedo colaborar</h5>
	<input type="checkbox" ref="cook"></input> Cocinando<br>
	
	<input type="checkbox" ref="driver" @click="toggleShowVehicleSelector"></input>
	Distribuyendo
	<p v-show="showVehicleSelector">
		Vehículo
		<select placeholder="vehículo" ref="vehicle">
			<option value="car" selected>En auto</option>
			<option value="van" >En camioneta</option>
			<option value="truck">En camión</option>

		</select>
	</p> <br>

	
	<button v-if="!isEditingProfile" @click="startEditingProfile">Editar</button> 
	<button v-if="isEditingProfile" @click="updateProfile">Guardar</button> <button v-if="isEditingProfile" @click="stopEditingProfile">Cancelar</button> {{messageUpdatingProfile}}
	
	<h2>Cambiar contraseña</h2>
	Nueva contraseña <input type="password" ref="new-password"></input><br>
	Repetir nueva contraseña <input type="password" ref="repeat-new-password"></input><br>
	<button @click="updatePassword">Cambiar contraseña</button> {{messageEditingPassword}}

</div>
`
});

