Vue.component('main-component', {
	data: function(){
		return {
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
		screenIsDelegateList: function(){
			return store.state.systemUserRoles.indexOf("admin")>=0 && store.state.currentTab=="delegatelist";
		},
		screenHasMap: function(){
			return store.state.currentTab=="mygroups" || store.state.currentTab=="groups" || store.state.currentTab=="users";
		}

	},
	template :`
<main role="main" class="container-list-map" v-if="isLoggedIn">
	<div class="list-container" v-if="screenHasMap">
		<available-users-component v-if="screenIsUsersAdmin"> </available-users-component>
		<groups-component v-if="screenIsGroupsAdmin"> </groups-component>
		<groups-component-delegate v-if="screenIsGroupsDelegate"> </groups-component-delegate>
	</div>
	<div class="map-container" v-show="screenHasMap">
		<!--<map-component-users id="map-users" v-if="screenIsUsersAdmin" ></map-component-users>-->
		<map-component id="map" v-show="screenHasMap"></map-component>
	</div>
	<delegate-list v-if="screenIsDelegateList"></delegate-list>
	<by-convidartech></by-convidartech>
</main>`
})

