function onLoadAdmin () {
	tokenCookie = getCookie("token-convidarte");
	usernameCookie = getCookie("username-convidarte");
	adminUserIdCookie = getCookie("userid-convidarte");
	if( tokenCookie != ""){
		token = tokenCookie;
		usernameAdmin = usernameCookie;
		adminUserId = adminUserIdCookie;
		onLoginOk(adminUserId);
	}
}
window.addEventListener('load', onLoadAdmin);
