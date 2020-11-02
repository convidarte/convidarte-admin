Vue.component('application-component', {
	data: function(){
			return {
				state: store.state,
			}
	},
	template:
`
<div style="height:100%;width:100%;">
	<navbar-component id="navbar"></navbar-component>
	<filter-bar-component id="filterBarComponent"></filter-bar-component>
	<main-component id="main"></main-component>
	<modal-profile-component id="modalProfileComponent"></modal-profile-component>
</div>
`
});

