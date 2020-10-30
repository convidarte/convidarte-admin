Vue.component('main-component', {
	template :`
<main role="main" class="container-list-map">
	<div class="list-container">
		<available-users-component>  </available-users-component>
		<groups-component> </groups-component>
	</div>
	<div class="map-container">
	<map-component id="map"></map-component>
	</div>
</main>`
})

