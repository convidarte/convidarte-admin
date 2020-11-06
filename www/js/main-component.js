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
	},
	template :`
<main role="main" class="container-list-map" >
	<div class="list-container" v-show="isLoggedIn">
		<available-users-component>  </available-users-component>
		<groups-component> </groups-component>
	</div>
	<div class="map-container" v-show="isLoggedIn">
		<map-component id="map"></map-component>
	</div>
	<by-convidartech></by-convidartech>
</main>`
})

