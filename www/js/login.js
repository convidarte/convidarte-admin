// LOGIN /  LOGOUT

function login(){
	var user = document.getElementById("username").value;
	var pass = document.getElementById("password").value;
	var loginData = { user_name: user, password : pass };
	var url ="/auth/login";
	do_request(url, loginData, false,"POST").then(
		function(data){
			store.setKey("adminUserId",data.user.user_id);
			store.setKey("token", data.token);
			store.setKey("usernameAdmin", data.user.user_name);
			store.setKey("tokenExpiration", data.expiration);

			setCookie("token-convidarte", store.state.token, 59*60*1000);
			setCookie("username-convidarte", store.state.usernameAdmin, 59*60*1000);
			setCookie("userid-convidarte", store.state.adminUserId, 59*60*1000);
			onLoginOk();
		}
	).catch(
		function() {
			alert('Datos de login incorrectos');
			logout();
		}
	)
}

function logout(){
	setCookie("token-convidarte","",59*60*1000);
	setCookie("username-convidarte","",59*60*1000);
	setCookie("userid-convidarte","",59*60*1000);
	localStorage.clear();
	location.reload();
}

function onLoginOk() {
	p = getUserProfile(store.state.adminUserId);
	if (store.state.currentSystem=="admin"){
		if (p.roles.indexOf("admin")<0){
			alert("Error: debe ser administrador para usar este sistema!")
			logout();
			return;
		}
		store.recoverStateFromLocalStorage();
	}
	if (store.state.currentSystem=="delegate"){
		if (p.roles.indexOf("delegate")<0){
			alert("Error: debe ser delegado para usar este sistema!")
			logout();
			return;
		}
		//  TODO DELEGATE
	}
	processQueryStringAdmin();
	refreshEverything();
}


function processQueryStringAdmin(){
	const queryString = window.location.search;
	console.log(queryString);
	if(queryString.startsWith("?perfil/")){
		var uid = parseInt(queryString.split("/")[1],10);
		store.setCurrentTab("users");
		showModalProfile(uid);
		return;
	}
	if(queryString.startsWith("?grupos")){
		store.setCurrentTab("groups");
		return;	
	}
	if(queryString.startsWith("?usuarios")){
		store.setCurrentTab("users");
		return;	
	}
	if(queryString.startsWith("?grupo")){
		var gid = parseInt(queryString.split("/")[1],10);
		store.setCurrentGroupId(gid);
		store.setCurrentTab("groups");
		return;
	}
	if( store.state.currentSystem=="admin"){
		store.setCurrentTab("users");
	}
	if( store.state.currentSystem=="delegate"){
		store.setCurrentTab("groups");
	}

}
