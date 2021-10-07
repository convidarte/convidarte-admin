Vue.component('modal-reset-password', {
	data: function(){
			return {
				state: store.state,
				message: "",
			}
	},
	mounted(){
		$('#modalResetPassword').appendTo("body");
	},
	computed:{
	},
	methods:{
		addUserRole:function(){
			var role = event.target.getAttribute("role");
			var uid = store.state.currentUserId;
			addRole(uid,role);
			this.close();
		},
		resetPassword:function(){
			var self = this;	
			do_request("/users/password/reset", { email: document.getElementById("emailResetPassword").value }, false, "POST").then(
			function(data) {
				self.message="Se envió una nueva contraseña por email";
			}).catch(
				function() {
					self.message="El email ingresado no corresponde a un usuario registrado";
				}
			);
		},
		close: function(){
			$("#modalResetPassword").modal('hide');
			this.message="";
		}
	},
	template:`
<div>
	<div class="modal fade" id="modalResetPassword" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="row">
							<h2 class="modalFullName">¿Olvidaste tu contraseña?</h2>
					</div>
					<div class="row">
						<div class="col-md-4">
							<form id="resetPassword">
								<table>
									<tbody>
										<tr>
											<td><span>Email:</span></td>
											<td><input type="text" id="emailResetPassword" name="email" style="padding:3px"></td>
										</tr>
									</tbody>
								</table>
							</form>
							<input type="submit" value="Recuperar mi contraseña" @click="resetPassword">
						</div>
					</div>
					<div class="row">
						{{message}}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>`,
});

