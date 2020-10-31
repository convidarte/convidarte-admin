Vue.component('filter-bar-component', {
	data: function(){
		return {
			state: store.state,
		}
	},
	computed: {
		styleFilterLocation : function(){
			if(this.state.currentTab=="groups"){
				return "display: none;";
			}
			if(this.state.currentTab=="users"){
				return "";
			}
			return "display:none;";
		},
	},
	template:
`<div class="container-fluid">
	<div class="row">
		<div id="filter-bar">
			<div id="filterLocation" :style="styleFilterLocation" class="filter-group">
				<div class="filter-group">
					<label>Rol:</label>
					<select id="selectRole" onchange="selectRoleChanged();">
						<option value="cook" selected>Cocineros</option>
						<option value="driver">Distribuidores</option>
						<option value="delegate">Delegados</option>
					</select>
				</div>
				<div class="filter-group">
					<select-city-component id="selectCityComponent"></select-city-component>
				</div>
				<div class="filter-group">
					<select-neighborhood-component id="selectNeighborhoodComponent"></select-neighborhood-component>
				</div>
			</div>
			<div class="filter-group">
				<autocomplete-group-component id="autocompleteGroupComponent"></autocomplete-group-component>
			</div>
			<div class="filter-group">
				<autocomplete-user-component id="autocompleteUserComponent"></autocomplete-user-component>
			</div>
		</div>
	</div>
</div>`
});
