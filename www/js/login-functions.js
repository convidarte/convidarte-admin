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
			setKey("systemUserRoles", p.roles);
			processQueryString();
			refreshEverything();
		}).catch(err => console.log("GET user profile failed"));
}
