Vue.component('main-component', {
	data: function(){
		return {
			state: store.state,
		}
	},
	computed: {
		isLoggedIn: function(){
			return this.state.token!="";
		},
		isDelegate: function(){
			return this.state.systemUserRoles.indexOf("delegate")>=0;
		},
		isAdmin: function(){
			return this.state.systemUserRoles.indexOf("admin")>=0;
		},
	},
	template :`
<main role="main" class="container-list-map" >
	<div class="list-container" v-show="isLoggedIn">
		<available-users-component>  </available-users-component>
		<groups-component v-if="isAdmin"> </groups-component>
		<groups-component-delegate v-if="isDelegate"> </groups-component-delegate>
	</div>
	<div class="map-container" v-show="isLoggedIn">
		<map-component id="map"></map-component>
	</div>
	<by-convidartech></by-convidartech>
</main>`
})

