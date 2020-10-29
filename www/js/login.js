// LOGIN /  LOGOUT

function login(){
	var user = document.getElementById("username").value;
	var pass = document.getElementById("password").value;
	var loginData = { user_name: user, password : pass };
	var urlLogin = apiBaseUrl+"/auth/login";
	var data = JSON.stringify(loginData);
	document.getElementById("loadingLogin").style="";
	$.ajax({
		method: "POST",
		url: urlLogin,
		contentType: "application/json",
		data : data,
		async: true,
		success: function(data){
			adminUserId = data.user.user_id;
			token = data.token;
			usernameAdmin = data.user.user_name;
			//tokenExpiration = data.expiration;
			setCookie("token-convidarte",token,59*60*1000);
			setCookie("username-convidarte",usernameAdmin,59*60*1000);
			setCookie("userid-convidarte",adminUserId,59*60*1000);
			onLoginOk(adminUserId);
		},
		error: function() {
			document.getElementById("loadingLogin").style="display: none;";
			alert('Datos de login incorrectos');			
		}

	});
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
	document.getElementById("protectedDiv").style="";
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
		processQueryStringAdmin()		
		refreshEverything();
	}
	if (currentSystem=="delegate"){
		if (p.roles.indexOf("delegate")<0){
			alert("Error: debe ser delegado para usar este sistema!")
			logout();
			return;
		}
		currentGroupId=0;
		document.getElementById("map").style="";
		document.getElementById("ppal").style="";
		document.getElementById("estilos").href="groups.css";
		refreshEverything();
	}
	document.getElementById("loadingLogin").style="display: none";
}


function processQueryStringAdmin(){
	const queryString = window.location.search;
	console.log(queryString);
	if(queryString.startsWith("?perfil/")){
		var uid = parseInt(queryString.split("/")[1],10);
		changeUsersTab();
		showModalProfile(uid);
		return;
	}
	if(queryString.startsWith("?grupos")){
		changeGroupsTab();
		return;	
	}
	if(queryString.startsWith("?usuarios")){
		changeUsersTab();
		return;	
	}
	if(queryString.startsWith("?grupo")){
		var gid = parseInt(queryString.split("/")[1],10);
		currentGroupId = gid;
		changeGroupsTab();
		//showGroupById(gid);
		return;
	}
	// default
	changeUsersTab();
}
