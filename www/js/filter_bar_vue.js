Vue.component('filter-bar-component', {
	template:
		`<div class="container-fluid">
		  <div class="row">
			<div id="filter-bar">
			  <div id="filterLocation" style = "display: none;" >
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
			  <select-group-component id="selectGroupComponent"></select-group-component>
			  <select-user-component id="selectUserComponent"></select-user-component>
			</div>
		  </div>
		</div>`
});
