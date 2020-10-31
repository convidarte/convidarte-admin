function onLoadAdmin () {
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
window.addEventListener('load', onLoadAdmin);
