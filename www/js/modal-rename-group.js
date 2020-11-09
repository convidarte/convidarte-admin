Vue.component('modal-rename-group', {
	data: function(){
			return {
				state: store.state,
			}
	},
	props:["group"],
	methods:{
		changeName: function(){
			var name = document.getElementById("changeNameTo").value;
			var groupId = this.group.group_id;
			changeGroupName(groupId,name);
			this.close();
		},
		close: function(){
			$("#modalRenameGroup").modal('hide');
		}
	},
	template:`
<div>
	<div class="modal fade" id="modalRenameGroup" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="row" v-if="group">
						<h2 class="modalFullName">Grupo #{{group.group_id}} - {{group.name}}</h2>
						<div class="row">
							<div class="col">
									<input id="changeNameTo"></input>
									<button @click="changeName">Renombrar grupo</button><br>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
`
});

