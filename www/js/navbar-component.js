Vue.component('navbar-component', {
	data: function(){
			return {
				state: store.state,
			}
	},
	methods: {
		changeUsersTab: function(){
			store.setCurrentTab("users");
			window.history.pushState('usuarios', '', '/?usuarios');
			refreshEverything();
		},
		changeGroupsTab: function(){
			store.setCurrentTab("groups");
			window.history.pushState('grupos', '', '/?grupos');
			refreshEverything();
		},
		openAdminProfile: function(){
			showModalProfile(store.state.adminUserId);
		},
	},
	computed:{
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
		delegateSystem: function(){
			return store.state.currentSystem=="delegate";
		},
		adminSystem: function(){
			return store.state.currentSystem=="admin";
		},
	},
	template:`
<nav class="navbar navbar-expand-md navbar-dark bg-dark sticky-top">
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
					Usuarios sin grupo<span class="sr-only">(current)</span>
				</a>
			</li>
			<li :class="classLinkGroups" v-if="adminSystem" >
				<a id="nav-link-groups" class="nav-link" href="#" @click="changeGroupsTab" >Grupos</a>
			</li>
			<li :class="classLinkGroups" v-if="delegateSystem">
				<a id="nav-link-my-groups" class="nav-link" href="#" @click="changeGroupsTab" >Mis grupos</a>
			</li>
		</ul>
		<ul class="navbar-nav">
			<login-component id="loginDiv" :style="displayIfNotLoggedIn"></login-component>
			<li class="nav-link" id="adminUserName" :style="displayIfLoggedIn">
				<a href="#"  class="nav-link"@click="openAdminProfile"> @{{ adminDisplayName }}</a>
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

