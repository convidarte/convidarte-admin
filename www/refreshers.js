
function onLoginOk() {
	document.getElementById("protectedDiv").style="";
	document.getElementById("loginDiv").style="display: none;";
	document.getElementById("adminUserName").innerHTML="Bienvenido "+encodeHTML(usernameAdmin);
	if(currentTab == "map"){
		onLoginOkMap();
	}else if (currentTab =="profile"){
		 onLoginOkProfile();
	}else if (currentTab =="groups"){
		onLoginOkGroups();
	}else if (currentTab =="users"){
		onLoginOkUsers();
	}
}

function onLoginOkMap(){
	document.getElementById("adminUserName").innerHTML="Bienvenido "+encodeHTML(usernameAdmin);
	getNeighborhoodList();
	getCityList();
	currentGroupId=0;
	currentUserId=0;
	refreshEverything();
}

function onLoginOkProfile(){
	document.getElementById("leftPanel").style="";
	currentGroupId=0;
	currentUserId=0;
	refreshEverything();
}

function onLoginOkGroups(){
	currentGroupId=0;
	currentUserId=0;
	refreshEverything();
}

function onLoginOkUsers(){
	document.getElementById("leftPanel").style="";
	getNeighborhoodList();
	getCityList();
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
	if(token!=""){
		//groups = get_groups();
		refresh_group_list_map();
		getUsersFiltered();
		deleteMarkers();
		refreshUserMarkers();
		refreshGroupMarkers();
		centerMapOn(-34.62, -58.46);
		document.getElementById("userDetail").innerHTML = "";
	}
}


function refreshEverythingProfile(){
	if(token!=""){
		updateSelectUsers();
		refresh_group_list();
		if(currentUserId!=0){
			showUserById(currentUserId);
		}
	}
}


function refreshEverythingGroups(){
	if(token!=""){
		refresh_group_list();
		if(currentGroupId!=0){
			showGroupById(currentGroupId);
		}else{
			deleteMarkers();
		}
	}
}

function refreshEverythingUsers(){
	if(token!=""){
		refresh_group_list_nodetails();
		refresh_user_list_users();
		refreshPagination();
	}
}

function refreshPagination(){
	if(numberPages != 0){
		document.getElementById("currentPageDiv").innerHTML = "Página "+(currentPage+1).toString() +" de "+numberPages.toString();
	}else{
		document.getElementById("currentPageDiv").innerHTML = "Página "+(currentPage+1).toString() +" de 1";
	}
}

