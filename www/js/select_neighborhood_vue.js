Vue.component('select-neighborhood-component', {
	data: function(){
			return {
				state: store.state,
			}
	},
	computed: {
		neighborhoodOptions: function () {
			var availableUsers = store.state.availableUserRoles;
			var neighborhoods = new Set([]);
			for (var i =0; i< availableUsers.length; i++){
				var u = availableUsers[i];
				if(u.address.neighborhood.toString() !="" && u.address.neighborhood.toString() !="nan" ){
					neighborhoods.add(u.address.neighborhood.toString().trim());
				}	
			}
			var neighborhoodList = new Array();
			for (let entry of neighborhoods.entries()) {
				neighborhoodList.push(entry[1]);
			}
			neighborhoodList.sort();
			return neighborhoodList;
		}
	},
  template: `
		<div id="select-neighborhood-component">
			<label>Barrio:</label>
			<select id="selectNeighborhood" onchange="selectNeighborhoodChanged()">
				<option value="" selected>Todos los barrios</option>
				<option v-for="neighborhood in neighborhoodOptions">{{ neighborhood }}</option>
			</select>
		</div>
`
})
