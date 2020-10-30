Vue.component('navbar-component', {
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
       <li class="nav-item active">
        <a id="nav-link-users"  class="nav-link" href="#" onclick="changeUsersTab()" >Usuarios sin grupo<span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a id="nav-link-groups" class="nav-link" href="#" onclick="changeGroupsTab()" >Grupos</a>
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

