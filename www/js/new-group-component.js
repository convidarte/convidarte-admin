Vue.component('new-group-component', {
	data: function(){
		return {
			state: store.state,
		}
	},
	computed: {
		style : function(){
			if(this.state.currentTab=="users"){
				return "display: none;";
			}
			if(this.state.currentTab=="groups"){
				return "";
			}
			return "display:none;";
		},
	},
	methods:{
		createGroup: function(){
			var groupName = document.getElementById("newGroupName").value;
			document.getElementById("newGroupName").value="";
			newGroup(groupName);
		},
	},
	template:`
<div id="newGroupContainer" :style="style">
	<label for="newGroupName"><span style="color:black">Nuevo grupo:</span></label>
	<input id="newGroupName" placeholder="nombre del grupo" style="height:25px;"></input>
	<button v-on:click="createGroup" style="height:25px;" >Crear</button>
</div>
`
});


