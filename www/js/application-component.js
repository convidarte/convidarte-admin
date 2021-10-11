Vue.component('application-component', {
	data: function(){
			return {
				state: store.state,
			}
	},
	computed: {
		isLoggedIn: function(){
			return store.state.token!="";
		},
		screenIsGroupsDelegate: function(){
			return store.state.systemUserRoles.indexOf("delegate")>=0 && store.state.currentTab=="mygroups";
		},
		screenIsGroupsAdmin: function(){
			return store.state.systemUserRoles.indexOf("admin")>=0 && store.state.currentTab=="groups";
		},
		screenIsUsersAdmin: function(){
			return store.state.systemUserRoles.indexOf("admin")>=0 && store.state.currentTab=="users";
		},
		screenIsPhonebook: function(){
			return (store.state.systemUserRoles.indexOf("admin")>=0||store.state.systemUserRoles.indexOf("delegate")>=0) && store.state.currentTab=="phonebook";
		},
		screenHasMap: function(){
			return store.state.currentTab=="mygroups" || store.state.currentTab=="groups" || store.state.currentTab=="users";
		},
		screenIsEditProfile: function(){
			return store.state.currentTab=="editprofile";
		},
		mainClass: function(){
			if( store.state.currentTab=="mygroups" || store.state.currentTab=="groups" || store.state.currentTab=="users")
				return "container-list-map";
			return "container-full-height";
		},
	},
	template:
`
<div style="height:100%;width:100%;">
	<navbar-component id="navbar"></navbar-component>
	<filter-bar-component id="filterBarComponent"></filter-bar-component>
	<main id="main" role="main" :class="mainClass" v-if="isLoggedIn">
		<div class="list-container" v-if="screenHasMap">
			<available-users-component v-if="screenIsUsersAdmin"> </available-users-component>
			<groups-component v-if="screenIsGroupsAdmin"> </groups-component>
			<groups-component-delegate v-if="screenIsGroupsDelegate"> </groups-component-delegate>
		</div>
		<div class="map-container" v-show="screenHasMap">
			<!--<map-component-users id="map-users" v-if="screenIsUsersAdmin" ></map-component-users>-->
			<map-component id="map" v-if="screenHasMap"></map-component>
		</div>
		<phonebook v-if="screenIsPhonebook"></phonebook>
		<edit-profile v-if="screenIsEditProfile"></edit-profile>
		<by-convidartech></by-convidartech>
	</main>
	<modal-profile-component id="modalProfileComponent"></modal-profile-component>
</div>
`
});

