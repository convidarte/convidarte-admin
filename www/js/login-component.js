Vue.component('login-component', {
	data: function(){
			return {
				userName:"",
				password:"",
			}
	},
	methods: {
		openResetPassword: function(){
			$("#modalResetPassword").modal('show');
		},
		login: function(){
			var userName = this.userName;
			var password = this.password;
			login(userName,password).then(
				function(data){
					setKey("adminUserId",data.user.user_id);
					setKey("token", data.token);
					setKey("usernameAdmin", data.user.user_name);
					setKey("tokenExpiration", data.expiration);

					setCookie("token-convidarte", store.state.token, 59*60*1000);
					setCookie("username-convidarte", store.state.usernameAdmin, 59*60*1000);
					setCookie("userid-convidarte", store.state.adminUserId, 59*60*1000);
					try {
						onLoginOk();
					} catch (error) {
					  console.error(error);
					}
			}).catch(
				function() {
					alert('Datos de login incorrectos');
					logout();
				}
			)	
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
					<td><input type="text" name="username" style="padding:3px" v-model="userName"></td>
				</tr>
				<tr>
					<td><span style="color:white"> Contraseña:</span></td>
					<td> <input type="password" name="password" style="width:100%" v-model="password"></td>
				</tr>
			</tbody>
		</table>
	</form>
	<input type="submit" value="Acceder" @click="login" > <a href="#" @click="openResetPassword" style="color:white" >¿Olvidaste tu contraseña?</a>
	<modal-reset-password></modal-reset-password>
</div>`
});



