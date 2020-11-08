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
			try {
				onLoginOk();
			} catch (error) {
			  console.error(error);
			}
	}).catch(
		function() {
			alert('Datos de login incorrectos');
			logout();
		}
	)
}

function onLoadConvidarte () {
	if (store.state.token!="") return;
	tokenCookie = getCookie("token-convidarte");
	usernameCookie = getCookie("username-convidarte");
	adminUserIdCookie = getCookie("userid-convidarte");
	if( tokenCookie != ""){
		store.setKey("token", tokenCookie);
		store.setKey("usernameAdmin", usernameCookie);
		store.setKey("adminUserId", adminUserIdCookie);
		onLoginOk(store.state.adminUserId);
	}
}

window.addEventListener('load', onLoadConvidarte);


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
	}
	processQueryString();
	refreshEverything();
}
