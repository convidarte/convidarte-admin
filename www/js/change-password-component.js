Vue.component('change-password', {
	data: function(){
		return {
			messageResult: "",
			messageValidation: "",
			classResult:"",
			classValidation:"",
		}
	},
	methods: {
		updatePassword(){
			if (this.$refs["new-password"].value == this.$refs["repeat-new-password"].value ){
				this.messageValidation="";
				this.classValidation="text-success";
				var url = "/users/"+ store.state.adminUserId.toString() +"/password";
				do_request(url, { password: this.$refs["new-password"].value }, true, "PUT").then(
					data =>{
						this.messageResult="Contraseña actualizada correctamente";
						this.classResult="text-success";
					}
				).catch(
					data=> {
						this.messageResult="Error, la contraseña no fue actualizada";
						this.classResult="text-danger";
					}
				);
				return;
			}else{
				this.messageValidation = "Las contraseñas no coinciden";
				this.classValidation="text-danger";		
				this.messageResult = "La contraseña no fue actualizada";
				this.classResult="text-danger";

			}
		},
	},
	template :`
<div>
	<h2>Cambiar contraseña</h2>
	<form>
	  <div class="form-row">
		<div class="form-group col-md-6">
			<label for="new-password">Nueva contraseña</label>
			<input type="password" class="form-control" id="new-password" placeholder="Nueva contraseña" ref="new-password">
		</div>
		<div class="form-group col-md-6">
			<label for="repeat-new-password">Repetir nueva contraseña</label>
			<input type="password" class="form-control" id="repeat-new-password" placeholder="Repetir nueva contraseña" ref="repeat-new-password">
			<div :class="classValidation">{{messageValidation}}</div>
		</div>
	  </div>
	  <button type="submit" class="btn btn-primary" @click="updatePassword">Cambiar contraseña</button> 
	  <div :class="classResult">{{messageResult}}</div>
	</form>
</div>
`
});

