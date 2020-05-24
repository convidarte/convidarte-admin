
function onLoginOk() {
	document.getElementById("protectedDiv").style="";
	document.getElementById("loginDiv").style="display: none;";
	document.getElementById("adminUserName").innerHTML="Bienvenido "+encodeHTML(usernameAdmin);
	updateSelectUsers(); // esto lo hacemos al loguear y despues no se actualiza mas porque es costoso
	getNeighborhoodList();// esto lo hacemos al loguear y despues no se actualiza mas porque es costoso
	getCityList();// esto lo hacemos al loguear y despues no se actualiza mas porque es costoso
}

function onTabChange() {
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

function onTabChangeMap(){
	document.getElementById("adminUserName").innerHTML="Bienvenido "+encodeHTML(usernameAdmin);
	currentGroupId=0;
	currentUserId=0;
	refreshEverything();
}

function onTabChangeProfile(){
	document.getElementById("leftPanel").style="";
	currentGroupId=0;
	currentUserId=0;
	refreshEverything();
}

function onTabChangeGroups(){
	currentGroupId=0;
	currentUserId=0;
	refreshEverything();
}

function onTabChangeUsers(){
	document.getElementById("leftPanel").style="";
	currentGroupId=0;
	currentUserId=0;
	refreshEverything();
}

//==============================================================================

function refreshEverything() {
	if(currentTab == "map"){
		refreshEverythingMap();
	}else if (currentTab =="profile"){
		 refreshEverythingProfile();
	}else if (currentTab =="groups"){
		refreshEverythingGroups();
	}else if (currentTab =="users"){
		refreshEverythingUsers();
	}
}


function refreshEverythingMap(){
	if(token==""){
		return;
	}
	//groups = getGroups();
	refreshGroupListMap();
	getUsersFiltered();
	deleteMarkers();
	refreshUserMarkers();
	refreshGroupMarkers();
	//centerMapOn(-34.62, -58.46);
	document.getElementById("userDetail").innerHTML = "";
}


function refreshEverythingProfile(){
	if(token==""){
		return;
	}
	refreshGroupList();
	if(currentUserId!=0){
		showUserById(currentUserId);
	}
}


function refreshEverythingGroups(){
	if(token==""){
		return;
	}
	refreshGroupList();
	if(currentGroupId!=0){
		showGroupById(currentGroupId);
	}else{
		deleteMarkers();
	}
}

function refreshEverythingUsers(){
	if(token==""){
		return;
	}
	refreshGroupListNoDetails();
	refreshUserListUsers();
	refreshPagination();
}

function refreshPagination(){
	if(numberPages != 0){
		document.getElementById("currentPageDiv").innerHTML = "Página "+(currentPage+1).toString() +" de "+numberPages.toString();
	}else{
		document.getElementById("currentPageDiv").innerHTML = "Página "+(currentPage+1).toString() +" de 1";
	}
}

