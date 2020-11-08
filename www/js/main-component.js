Vue.component('main-component', {
	data: function(){
		return {
			state: store.state,
		}
	},
	computed: {
		isLoggedIn: function(){
			return store.state.token!="";
		},
		delegateSystem: function(){
			return store.state.currentSystem=="delegate";
		},
		adminSystem: function(){
			return store.state.currentSystem=="admin";
		},
	},
	template :`
<main role="main" class="container-list-map" >
	<div class="list-container" v-show="isLoggedIn">
		<available-users-component>  </available-users-component>
		<groups-component v-if="adminSystem"> </groups-component>
		<groups-component-delegate v-if="delegateSystem"> </groups-component-delegate>
	</div>
	<div class="map-container" v-show="isLoggedIn">
		<map-component id="map"></map-component>
	</div>
	<by-convidartech></by-convidartech>
</main>`
})

