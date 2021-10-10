Vue.component('login-component', {
	data: function(){
			return {
				//state: store.state,
			}
	},
	methods: {
		openResetPassword: function(){
			$("#modalResetPassword").modal('show');
		},
	},
	computed:{
		style : function(){
			if(store.state.token!="") return "display: none;";
			return "";
		},
	},
	template: `
<div id="loginDiv" :style="style">
	<form id="login">
		<table>
			<tbody>
				<tr>
					<td><span style="color:white"> Usuario:</span></td>
					<td><input type="text" id="username" name="username" style="padding:3px"></td>
				</tr>
				<tr>
					<td><span style="color:white"> Contraseña:</span></td>
					<td> <input type="password" id="password" name="password" style="width:100%"></td>
				</tr>
			</tbody>
		</table>
	</form>
	<input type="submit" value="Acceder" onclick="onClickLoginButton()" > <a href="#" @click="openResetPassword" style="color:white" >¿Olvidaste tu contraseña?</a>
	<modal-reset-password></modal-reset-password>
</div>`
});



