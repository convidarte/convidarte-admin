Vue.component('select-role-component', {
	data: function(){
			return {
				state: store.state,
			}
	},
	methods:{
		selectRoleChanged: function (){
			var role = document.getElementById("selectRole").value;
			store.setRoleFilterValue(role)	
			refreshEverything();
		},
	},
	template:`
<div>
	<label>Rol:</label>
	<select id="selectRole" v-on:change="selectRoleChanged">
		<option value="cook" selected>Cocineros</option>
		<option value="driver">Distribuidores</option>
		<option value="delegate">Delegados</option>
	</select>
</div>`
});

