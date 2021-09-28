Vue.component('main-component', {
	data: function(){
		return {
		}
	},
	computed: {
		isLoggedIn: function(){
			return store.state.token!="";
		},
		showGroupsDelegate: function(){
			return store.state.systemUserRoles.indexOf("delegate")>=0 && store.state.currentTab=="mygroups";
		},
		showGroupsAdmin: function(){
			return store.state.systemUserRoles.indexOf("admin")>=0 && store.state.currentTab=="groups";
		},
		showUsersAdmin: function(){
			return store.state.systemUserRoles.indexOf("admin")>=0 && store.state.currentTab=="users";
		},

	},
	template :`
<main role="main" class="container-list-map" >
	<div class="list-container" v-if="isLoggedIn">
		<available-users-component v-if="showUsersAdmin"> </available-users-component>
		<groups-component v-if="showGroupsAdmin"> </groups-component>
		<groups-component-delegate v-if="showGroupsDelegate"> </groups-component-delegate>
	</div>
	<div class="map-container" v-show="isLoggedIn">
		<map-component id="map"></map-component>
	</div>
	<by-convidartech></by-convidartech>
</main>`
})

