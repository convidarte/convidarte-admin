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
