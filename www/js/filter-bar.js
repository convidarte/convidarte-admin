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
		currentTab: function(){
			return this.state.currentTab;
		},
		isDelegate: function(){
			return this.state.systemUserRoles.indexOf("delegate")>=0;
		},
		isAdmin: function(){
			return this.state.systemUserRoles.indexOf("admin")>=0;
		},
		isLoggedIn: function(){
			return this.state.token!="";
		},
	},
	template:
`
<div class="container-fluid" v-if="isLoggedIn">
	<div class="row">
		<div id="filter-bar">
			<div id="filterLocation" :style="styleFilterLocation" class="filter-group" v-if="isAdmin">
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
			<div class="filter-group" v-if="isAdmin">
				<new-group-component></new-group-component>
			</div>

			<div class="filter-group" v-if="isAdmin">
				<group-combination-component></group-combination-component>
			</div>
			
			<div class="filter-group" v-if="isAdmin">
				<current-group-selector></current-group-selector>
			</div>
			
			<div class="filter-group"  v-if="isAdmin && currentTab !='mygroups'">
				<autocomplete-user-component id="autocompleteUserComponent"></autocomplete-user-component>
			</div>
			<div class="filter-group" v-if="isDelegate && currentTab=='mygroups'">
				<group-list-delegate></group-list-delegate>
			</div>
		</div>
	</div>
</div>`
});
