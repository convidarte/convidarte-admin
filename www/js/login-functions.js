function login(){
	var user = document.getElementById("username").value;
	var pass = document.getElementById("password").value;
	var loginData = { user_name: user, password : pass };
	var url ="/auth/login";
	do_request(url, loginData, false,"POST").then(
		function(data){
			setKey("adminUserId",data.user.user_id);
			setKey("token", data.token);
			setKey("usernameAdmin", data.user.user_name);
			setKey("tokenExpiration", data.expiration);

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
		setKey("token", tokenCookie);
		setKey("usernameAdmin", usernameCookie);
		setKey("adminUserId", adminUserIdCookie);
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
	getUserProfile(store.state.adminUserId).then(
		function(p){
			if (store.state.currentSystem=="admin"){
				if (p.roles.indexOf("admin")<0){
					alert("Error: debe ser administrador para usar este sistema!")
					logout();
					return;
				}
				recoverStateFromLocalStorage();
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
		}).catch(err => console.log("GET user profile failed"));
}
