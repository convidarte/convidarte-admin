Vue.component('navbar-component', {
	data: function(){
			return {
				state: store.state,
			}
	},
	methods: {
		changeUsersTab: function(){
			setKey("currentTab", "users");
			window.history.pushState('usuarios', '', '/?usuarios');
			refreshEverything();
		},
		changeGroupsTab: function(){
			setKey("currentTab", "groups");
			window.history.pushState('grupos', '', '/?grupos');
			refreshEverything();
		},
		changeMyGroupsTab: function(){
			setKey("currentTab", "mygroups");
			window.history.pushState('misgrupos', '', '/?mis-grupos');
			refreshEverything();
		},
	},
	computed:{
		refresh: function(){
			console.log("Refreshing navbar-component at", this.state.refreshTime);
			return "";
		},
		classLinkUsers: function(){
			if( this.state.currentTab=="users"){
				return "nav-item active"
			}
			return "nav-item"
		},
		classLinkGroups: function(){
			if( this.state.currentTab=="groups"){
				return "nav-item active"
			}
			return "nav-item"
		},
		classLinkMyGroups: function(){
			if( this.state.currentTab=="mygroups"){
				return "nav-item active"
			}
			return "nav-item"
		},
		displayIfLoggedIn: function(){
			if( this.state.token=="") return "display:none;"
			return "";
		},
		displayIfNotLoggedIn: function(){
			if( this.state.token!="") return "display:none;"
			return "";
		},
		adminDisplayName: function(){
			console.log("bienvenido ", store.state.refreshTime);
			if( this.state.token!="") return store.state.usernameAdmin;
			return "";
		},
		adminUserId: function(){
			if( this.state.token!="") return store.state.adminUserId;;
			return "";
		},
		delegateSystem: function(){
			return this.state.systemUserRoles.indexOf("delegate")>=0;
		},
		adminSystem: function(){
			return this.state.systemUserRoles.indexOf("admin")>=0;
		},
	},
	template:`
<nav class="navbar navbar-expand-md navbar-dark bg-dark sticky-top">
{{refresh}}
	<a class="navbar-brand" href=".">
		<img src="img/convidarte-logo.svg" alt="Convidarte" height="40">
	</a>
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	</button>
	<div class="collapse navbar-collapse" id="navbarCollapse">
		<ul class="navbar-nav mr-auto" :style="displayIfLoggedIn">
			<li :class="classLinkUsers"  v-if="adminSystem" >
				<a id="nav-link-users"  class="nav-link" href="#" @click="changeUsersTab" >
					Voluntarios sin grupo<span class="sr-only">(current)</span>
				</a>
			</li>
			<li :class="classLinkGroups" v-if="adminSystem" >
				<a id="nav-link-groups" class="nav-link" href="#" @click="changeGroupsTab" >Grupos</a>
			</li>
			<li :class="classLinkMyGroups" v-if="delegateSystem">
				<a id="nav-link-my-groups" class="nav-link" href="#" @click="changeMyGroupsTab" >Mis grupos</a>
			</li>
		</ul>
		<ul class="navbar-nav">
			<login-component :style="displayIfNotLoggedIn"></login-component>
			<li :style="displayIfLoggedIn">
				<link-user-profile :userName="adminDisplayName" class="nav-link" :userId="adminUserId" ></link-user-profile>
			</li>
			<li>
				<a id="logout-link" class="nav-link" href="" onclick="logout()" :style="displayIfLoggedIn">
					<i class="fas fa-sign-out-alt"></i>
				</a>			
			</li>
		</ul>
	</div>
</nav>`
})

