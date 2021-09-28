Vue.component('new-group-component', {
	data: function(){
		return {
			state: store.state,
		}
	},
	methods:{
		createGroup: function(){
			var groupName = document.getElementById("newGroupName").value;
			document.getElementById("newGroupName").value="";
			newGroup(groupName);
		},
	},
	template:`
<div id="newGroupContainer">
	<label for="newGroupName"><span style="color:black">Nuevo grupo:</span></label>
	<input id="newGroupName" placeholder="nombre del grupo" style="height:25px;"></input>
	<button v-on:click="createGroup" style="height:25px;" >Crear</button>
</div>
`
});


