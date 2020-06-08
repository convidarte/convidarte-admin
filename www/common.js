// LOGIN /  LOGOUT:
function setCookie(cname, cvalue, expirationMilliseconds) {
  var d = new Date();
  d.setTime(d.getTime() + expirationMilliseconds);
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function login(){
	var user = document.getElementById("username").value;
	var pass = document.getElementById("password").value;
	var loginData = { user_name: user, password : pass };
	var urlLogin = apiBaseUrl+"/auth/login";
	var data = JSON.stringify(loginData);
	$.ajax({
		method: "POST",
		url: urlLogin,
		contentType: "application/json",
		data : data,
		async: false,
		success: function(data) {
			adminUserId = data.user.user_id;
			token = data.token;
			usernameAdmin = data.user.user_name;
			//tokenExpiration = data.expiration;
			setCookie("token-convidarte",token,59*60*1000);
			setCookie("username-convidarte",usernameAdmin,59*60*1000);
			setCookie("userid-convidarte",adminUserId,59*60*1000);
			onLoginOk();
		},
		error: function() {
			alert('Login falló');
		}

	});
}

function logout(){
	setCookie("token-convidarte","",59*60*1000);
	setCookie("username-convidarte","",59*60*1000);
	setCookie("userid-convidarte","",59*60*1000);
	location.reload();
}

//------------------------------------------------------

window.addEventListener("focus", function(event){ 
	if(token != ""){
		refreshEverything();
	}
}, false);

window.addEventListener('load', function () {
	tokenCookie = getCookie("token-convidarte");
	usernameCookie = getCookie("username-convidarte");
	adminUserIdCookie = getCookie("userid-convidarte");
	if( tokenCookie != ""){
		token = tokenCookie;
		usernameAdmin = usernameCookie;
		adminUserId = adminUserIdCookie;
		onLoginOk();	
	}
})

