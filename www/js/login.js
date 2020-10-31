// LOGIN /  LOGOUT

function login(){
	var user = document.getElementById("username").value;
	var pass = document.getElementById("password").value;
	var loginData = { user_name: user, password : pass };
	var url ="/auth/login";
	document.getElementById("loadingLogin").style="";
	do_request(url, loginData, false,"POST").then(
		function(data){
			adminUserId = data.user.user_id;
			token = data.token;
			usernameAdmin = data.user.user_name;
			//tokenExpiration = data.expiration;
			setCookie("token-convidarte",token,59*60*1000);
			setCookie("username-convidarte",usernameAdmin,59*60*1000);
			setCookie("userid-convidarte",adminUserId,59*60*1000);
			onLoginOk(adminUserId);
		}
	).catch(
		function() {
			document.getElementById("loadingLogin").style="display: none;";
			alert('Datos de login incorrectos');			
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

function onLoginOk(adminUserId) {
	localStorage.setItem("token",token);
	p = getUserProfile(adminUserId);
	document.getElementById("loginDiv").style="display: none;";
	document.getElementById("adminUserName").innerHTML="Bienvenido "+encodeHTML(usernameAdmin);
	document.getElementById("adminUserName").style="";
	document.getElementById("logout-link").style="";

	if (currentSystem=="admin"){
		if (p.roles.indexOf("admin")<0){
			alert("Error: debe ser administrador para usar este sistema!")
			logout();
			return;
		}
		store.recoverStateFromLocalStorage();
		processQueryStringAdmin();
	}
	if (currentSystem=="delegate"){
		if (p.roles.indexOf("delegate")<0){
			alert("Error: debe ser delegado para usar este sistema!")
			logout();
			return;
		}
		// TODO DELEGATE
	}
	document.getElementById("loadingLogin").style="display: none";
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
	// default
	store.setCurrentTab("users");
}
