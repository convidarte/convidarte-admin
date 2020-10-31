Vue.component('navbar-component', {
	data: function(){
			return {
				state: store.state,
			}
	},
	methods: {
		changeUsersTab: function(){
			store.setCurrentTab("users");
			//document.getElementById("nav-link-users").parentElement.className="nav-item active";
			//document.getElementById("nav-link-groups").parentElement.className="nav-item";
			window.history.pushState('usuarios', '', '/?usuarios');
			refreshEverything();
		},
		changeGroupsTab: function(){
			store.setCurrentTab("groups");
			//document.getElementById("nav-link-groups").parentElement.className="nav-item active";
			//document.getElementById("nav-link-users").parentElement.className="nav-item";
			window.history.pushState('grupos', '', '/?grupos');
			refreshEverything();
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
      <ul class="navbar-nav mr-auto">
       <li :class="classLinkUsers">
        <a id="nav-link-users"  class="nav-link" href="#" v-on:click="changeUsersTab" >Usuarios sin grupo<span class="sr-only">(current)</span></a>
      </li>
      <li :class="classLinkGroups">
        <a id="nav-link-groups" class="nav-link" href="#" v-on:click="changeGroupsTab" >Grupos</a>
      </li>
    </ul>

    <ul class="navbar-nav">
	<div id=loginDiv>
		<form id="login">
			<table>
				<tbody>
					<tr><td><span style="color:white"> Usuario:</span></td><td><input type="text" id="username" name="username" style="padding:3px"></td></tr>
					<tr><td><span style="color:white"> Contraseña:</span></td><td> <input type="password" id="password" name="password" style="width:100%"></td></tr>
				</tbody>
			</table>
		</form>
		<input type="submit" value="Acceder" onclick="login()" >
	</div>

     <li class="nav-link" id="adminUserName" style="display:none"></li>
     <li>
      <a id="logout-link" class="nav-link" href="" onclick="logout()" style="display:none">
       <i class="fas fa-sign-out-alt"></i>
     </a>
   </li>
 </ul>
</div>
</nav>`
})

