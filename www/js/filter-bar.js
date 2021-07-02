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
		delegateSystem: function(){
			return store.state.currentSystem=="delegate";
		},
		adminSystem: function(){
			return store.state.currentSystem=="admin";
		},
		isLoggedIn: function(){
			return store.state.token!="";
		},
	},
	template:
`<div class="container-fluid" v-if="isLoggedIn">
	<div class="row">
		<div id="filter-bar">
			<div id="filterLocation" :style="styleFilterLocation" class="filter-group" v-if="adminSystem">
				<div class="filter-group">
					<select-role-component></select-role-component>
				</div>
				<div class="filter-group">
					<select-city-component id="selectCityComponent"></select-city-component>
				</div>
				<div class="filter-group">
					<select-neighborhood-component id="selectNeighborhoodComponent"></select-neighborhood-component>
				</div>
			</div>
			<div class="filter-group" v-if="adminSystem">
				<new-group-component></new-group-component>
			</div>

			<div class="filter-group" v-if="adminSystem">
				<group-combination-component></group-combination-component>
			</div>
			
			<div class="filter-group" v-if="adminSystem">
				<current-group-selector></current-group-selector>
			</div>
			
			<div class="filter-group"  v-if="adminSystem">
				<autocomplete-user-component id="autocompleteUserComponent"></autocomplete-user-component>
			</div>
			<div class="filter-group" v-if="delegateSystem">
				<group-list-delegate></group-list-delegate>
			</div>
			
		</div>
	</div>
</div>`
});
