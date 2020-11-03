Vue.component('button-delete-role', {
	props: ['groupId','userId','role'],
	methods:{
		deleteUserRole:function(){
			if ( confirm("Seguro que quiere quitar al usuario #"+ this.userId.toString() +"?") ){
				if (store.state.currentSystem=="admin"){
					deleteMemberAdmin(this.groupId, this.userId, this.role);
				}
				if (store.state.currentSystem=="delegate"){
					deleteMemberDelegate(this.groupId, this.userId, this.role);
				}
				refreshEverything();
			}
		},
	},
	template:`
<button	type="button" v-on:click="deleteUserRole">Quitar del grupo</button>
`,
});

Vue.component('button-delete-inactivate-role', {
	props: ['groupId','userId','role'],
	methods:{
		deleteAndInactivate:function(){
			if ( confirm("Seguro que quiere quitar e inactivar al usuario #"+ this.userId.toString() +"?") ){
				if (store.state.currentSystem=="admin"){
					deleteMemberAndDeactivateAdmin(this.groupId, this.userId, this.role);
				}
				if (store.state.currentSystem=="delegate"){
					deleteMemberAndDeactivateDelegate(this.groupId, this.userId, this.role);
				}
				refreshEverything();
			}
		},
	},
	template:`
<button type="button" @click="deleteAndInactivate">Quitar e inactivar usuario</button>
`,
});

Vue.component('button-delete-group',{
	props: ['groupId'],
	methods:{
		deleteGroup: function(){
			if ( confirm("Seguro que quiere eliminar el grupo "+ this.groupId.toString() +"?") ){
				deleteGroup(this.groupId);
			}
		},
	},
	template:`<button type="button" @click="deleteGroup"> Borrar grupo</button>`,
});

Vue.component('button-ack-delegate',{
	props: ['groupId','userId','role'],
	methods:{
		sendAck: function(){
			if (store.state.currentSystem=="delegate"){
				ackDelegate(this.groupId,this.userId,this.role);
			}
		},
	},
	template: `
<button type="button" @click="sendAck">Ya me contacté!</button>
`
});

Vue.component('form-assign-group',{
	props: ['userId','role'],
	methods:{
		assignGroup: function (){
			var gid = parseInt( document.getElementById(this.getIdSelect()).value, 10);
			var groupName = getGroupNameById(gid);
			console.log("Agregando ",this.userId, this.role, gid, groupName);
			if ( gid!="" ){
				addUserRoleToGroup(this.userId,this.role,gid, groupName);
				refreshEverything();
			}else{
				alert("Debe seleccionar un grupo.");
			}
		},
		getIdSelect: function(){
			return "selectGroupFor"+this.userId.toString()+this.role;
		}
	},
	computed:{
		idSelect: function(){
			return this.getIdSelect();
		},
	},
	template: `
	<div>
		<select-group-component :id="idSelect"></select-group-component>
		<button @click="assignGroup">Agregar</button>
	</div>
`
});
