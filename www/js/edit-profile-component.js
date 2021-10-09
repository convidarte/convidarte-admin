Vue.component('edit-profile', {
	data: function(){
		return {
			isEditingProfile : false,
			messageEditingPassword: "",
		}
	},
	methods: {
		displayUserData(){
			var self=this;
			do_request("/url", null, true, "GET").then( data =>{

				
			});
		},
		startEditingProfile(){
			this.isEditingProfile=true;
		},
		stopEditingProfile(){
			this.isEditingProfile=false;
			this.displayUserData();
		},
		updateProfile(){
			this.isEditingProfile=false;
		},
		validatePutProfilePayload(payload){
			//TODO
			return true;
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
	computed:{
	},
	mounted(){
		this.displayUserData();
	},
	template :`
<div class="list-container" style="width:100%;">
	<h2>Mis datos</h2>
	
	<h5>Datos personales</h5>
	Nombre <input type="text"></input><br>
	Apellido <input type="text"></input><br>
	Celular <input type="text"></input><br>
	Email <input type="text"></input><br>

	<h5>Dirección</h5>
	Calle <input type="text"></input><br>
	Número <input type="text"></input><br>
	Piso/Departamento <input type="text"></input><br>
	Provincia <input type="select"></input><br>
	Localidad/Barrio <input type="select"></input><br>
	
	<h5>Puedo colaborar</h5>
	<input type="checkbox"></input> Cocinando<br>
	<input type="checkbox"></input> Distribuyendo Vehículo <input type="select" placeholder="vehículo"></input><br>

	
	<button v-if="!isEditingProfile" @click="startEditingProfile">Editar</button> 
	<button v-if="isEditingProfile" @click="updateProfile">Guardar</button> <button v-if="isEditingProfile" @click="stopEditingProfile">Cancelar</button>
	
	<h2>Cambiar contraseña</h2>
	Nueva contraseña <input type="password" ref="new-password"></input><br>
	Repetir nueva contraseña <input type="password" ref="repeat-new-password"></input><br>
	<button @click="updatePassword">Cambiar contraseña</button> {{messageEditingPassword}}

</div>
`
});

