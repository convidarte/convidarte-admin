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
	document.getElementById("loadingLogin").style="";
	$.ajax({
		method: "POST",
		url: urlLogin,
		contentType: "application/json",
		data : data,
		async: true,
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

function onLoginOk() {
	p = getUserProfile(adminUserId);
	if (currentSystem=="admin"){
		if (p.roles.indexOf("admin")<0){
			alert("Error: debe ser administrador para usar este sistema!")
			logout();
			return;
		}
		updateSelectUsers(); // esto lo hacemos al loguear y despues no se actualiza mas porque es costoso
		getNeighborhoodList();// esto lo hacemos al loguear y despues no se actualiza mas porque es costoso
		getCityList();// esto lo hacemos al loguear y despues no se actualiza mas porque es costoso
		//getGroupList();
		changeUsersTab();
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
	document.getElementById("protectedDiv").style="";
	document.getElementById("loginDiv").style="display: none;";
	document.getElementById("adminUserName").innerHTML="Bienvenido "+encodeHTML(usernameAdmin);
	document.getElementById("adminUserName").style="";
	document.getElementById("logout-link").style="";
}

function onTabChange() {
	stopDividingGroupOnClick();
	if(currentTab == "map"){
		onTabChangeMap();
	}else if (currentTab =="profile"){
		 onTabChangeProfile();
	}else if (currentTab =="groups"){
		onTabChangeGroups();
	}else if (currentTab =="users"){
		onTabChangeUsers();
	}
}

function onTabChangeGroups(){
	currentGroupId=0;
	currentUserId=0;
	refreshEverything();
}

function onTabChangeUsers(){
	currentGroupId=0;
	currentUserId=0;
	refreshEverything();
}

//==============================================================================

function refreshEverything() {
	if (currentTab =="groups"){
		refreshEverythingGroups();
	}else if (currentTab =="users"){
		refreshEverythingUsers();
	}else if (currentTab =="delegate"){
		refreshEverythingDelegate();
	}
}


function refreshEverythingMap(){
	if(token==""){
		return;
	}
	//groups = getGroups();
	getUsersFiltered();
	deleteMarkers();
	refreshUserMarkers();
	refreshGroupMarkers();
	//centerMapOn(-34.62, -58.46);
	document.getElementById("userDetail").innerHTML = "";
}


function refreshEverythingGroups(){
	if(token==""){
		return;
	}
	refreshGroupList();
	if( currentGroupId==0 ){
		deleteMarkers();
	}
	showGroupById(currentGroupId);
}

function refreshEverythingUsers(){
	if(token==""){
		return;
	}
	refreshUserListUsers();
	refreshPagination();
	deleteMarkers();
	refreshUserMarkers();
	refreshGroupMarkers();
}

function refreshEverythingDelegate(){
	if(token==""){
		return;
	}
	refreshGroupListDelegate();
	if(currentGroupId==0){
		deleteMarkers();
	}
	showGroupById(currentGroupId);
}

function refreshPagination(){
	if(numberPages != 0){
		document.getElementById("currentPageDiv").innerHTML = "Página "+(currentPage+1).toString() +" de "+numberPages.toString();
	}else{
		document.getElementById("currentPageDiv").innerHTML = "Página "+(currentPage+1).toString() +" de 1";
	}
}

function resetURL(){
	history.back()
}

//==============================================================
// Group division:
function startDividingGroupOnClick(){
	currentlyDividingGroup = true;
	userRolesNewGroup = {};
	refreshEverything();
}
function stopDividingGroupOnClick(){
	currentlyDividingGroup = false;
	userRolesNewGroup = {};
	refreshEverything();
}
