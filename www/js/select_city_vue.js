Vue.component('select-city-component', {
	data: function(){
			return {
				state: store.state,
			}
	},
	computed: {
		cityOptions: function () {
			var availableUsers = store.state.availableUsers;
			var cities = new Set([]);
			for (var i =0; i< availableUsers.length; i++){
				var u = availableUsers[i];
				if(u.address.city.toString() !="" && u.address.city.toString() !="nan" ){
					cities.add(u.address.city.toString().trim());
				}	
			}
			cityList = new Array();
			for (let entry of cities.entries()) {
				cityList.push(entry[1]);
			}
			cityList.sort();
			return cityList;
		}
	},
  template: `
		<div id="select-city-container">
			<label>Localidad:</label>
			<select id="select-city" onchange="selectCityChanged()">
				{{ cityOptions }}
				<option value="" selected>Todas las localidades</option>
				<option v-for="city in cityOptions">{{ city }}</option>
			</select>
		</div>
`
})
