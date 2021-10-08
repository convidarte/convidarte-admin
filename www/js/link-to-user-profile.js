Vue.component('link-user-profile', {
	props :["userId", "userName"],
	computed:{
		adminSystem: function(){
			return store.state.systemUserRoles.indexOf("admin")>=0;
		},
	},
	methods: {
		openProfile: function(){
			showModalProfile(this.userId);
		},
	},
	template:`
		<a v-if="adminSystem" href="#" @click="openProfile">@{{ userName }}</a>
		<p v-else>@{{ userName }}</p>
`,
});

Vue.component('link-view-group', {
	props :["groupId", "groupName"],
	computed:{
		adminSystem: function(){
			return store.state.systemUserRoles.indexOf("admin")>=0;
		},
	},
	methods: {
		showGroup: function(){
			showGroupById(this.groupId);
		},
	},
	template:`
<div>
	<div v-if="adminSystem">
	#{{groupId}} <a href="#" @click="showGroup"> {{ groupName }}</a>
	</div>
	<p v-else>{{ groupName }}</p>
</div>
`,
});

