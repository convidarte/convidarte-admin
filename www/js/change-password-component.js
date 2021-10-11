Vue.component('change-password', {
	data: function(){
		return {
			newPassword : "",
			repeatNewPassword: "",	
			validation:{
				result:{
					message:"",
					class:"",				
				},
				newPassword:{
					message:"",
					class:"",
				},
				repeatNewPassword:{
					message:"",
					class:"",
				},
			}
		};
	},
	methods: {
		updatePassword(){
			var result = this.validateForm();
			if(!result){
				this.validation.result.message =  "La contraseña no fue actualizada";
				this.validation.result.class = "text-danger";
				return;
			}
			var url = "/users/"+ store.state.adminUserId.toString() +"/password";
			do_request(url, { password: this.newPassword }, true, "PUT").then(
				data =>{
					this.validation.result.message = "Contraseña actualizada correctamente";
					this.validation.result.class = "text-success";
				}
			).catch(
				data=> {
					this.validation.result.message = "Error, la contraseña no fue actualizada";
					this.validation.result.class = "text-danger";
				}
			);
		},
		validateForm(){
			var validationOK = true;
			this.clearValidationMessages();
			if( this.newPassword.length < 6 ){
				this.validation.newPassword.message="La contraseña es demasiado corta."
				this.validation.newPassword.class="text-danger";
				validationOK = false;
			}
			if(this.newPassword != this.repeatNewPassword ){
				this.validation.repeatNewPassword.message="Las contraseñas no coinciden."
				this.validation.repeatNewPassword.class="text-danger";
				validationOK = false;
			}
			return validationOK;
		},
		clearValidationMessages(){
			Object.keys(this.validation).forEach(k=> {if(k!="result") this.validation[k].message="";});
		},
	},
	template :`
<div>
	<h2>Cambiar contraseña</h2>
	<form>
	  <div class="form-row">
		<div class="form-group col-md-6">
			<label for="newPassword">Nueva contraseña</label>
			<input type="password" class="form-control" id="newPassword" placeholder="Nueva contraseña" v-model="newPassword">
			<div :class="validation.newPassword.class">{{validation.newPassword.message}}</div>
		</div>
		<div class="form-group col-md-6">
			<label for="repeatNewPassword">Repetir nueva contraseña</label>
			<input type="password" class="form-control" id="repeatNewPassword" placeholder="Repetir nueva contraseña" v-model="repeatNewPassword">
			<div :class="validation.repeatNewPassword.class">{{validation.repeatNewPassword.message}}</div>
		</div>
	  </div>
	  <button type="button" class="btn btn-primary" @click="updatePassword">Cambiar contraseña</button> 
	  <div :class="validation.result.class">{{validation.result.message}}</div>
	</form>
</div>
`
});

