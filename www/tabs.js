function changeUsersTab(){
	//alert("cambio a users");
	currentTab = "users";
	document.getElementById("usersRightMenu").style="";
	document.getElementById("mapRightMenu").style="display: none;";
	document.getElementById("groupsRightMenu").style="";
	document.getElementById("profileRightMenu").style="display: none;";
	document.getElementById("filterLocation").style="";

	document.getElementById("map").style="display: none;";
	document.getElementById("usersLeftPanel").style="";
	document.getElementById("ppal").style="display: none;";
	document.getElementById("profileLeftPanel").style="display: none;";

	document.getElementById("estilos").href="users.css";

	onLoginOk();
}

function changeMapTab(){
	//alert("cambio a map");
	currentTab = "map";
	document.getElementById("usersRightMenu").style="display: none;";
	document.getElementById("mapRightMenu").style="";
	document.getElementById("groupsRightMenu").style="";
	document.getElementById("profileRightMenu").style="display: none;";
	document.getElementById("filterLocation").style="";

	document.getElementById("map").style="";
	document.getElementById("usersLeftPanel").style="display: none;";
	document.getElementById("ppal").style="display: none;";
	document.getElementById("profileLeftPanel").style="display: none;";

	document.getElementById("estilos").href="map.css";

	onLoginOk();
}

function changeGroupsTab(){
	//alert("cambio a groups");
	currentTab = "groups";
	document.getElementById("usersRightMenu").style="display: none;";
	document.getElementById("mapRightMenu").style="display: none;";
	document.getElementById("groupsRightMenu").style="";
	document.getElementById("profileRightMenu").style="display: none;";
	document.getElementById("filterLocation").style="display: none;";

	document.getElementById("map").style="";
	document.getElementById("usersLeftPanel").style="display: none;";
	document.getElementById("ppal").style="";
	document.getElementById("profileLeftPanel").style="display: none;";

	document.getElementById("estilos").href="groups.css";

	onLoginOk();
}

function changeProfileTab(){
	//alert("cambio a profile");
	currentTab = "profile";
	document.getElementById("usersRightMenu").style="display: none;";
	document.getElementById("mapRightMenu").style="display: none;";
	document.getElementById("groupsRightMenu").style="display: none;";
	document.getElementById("profileRightMenu").style="";
	document.getElementById("filterLocation").style="display: none;";

	document.getElementById("map").style="display: none;";
	document.getElementById("usersLeftPanel").style="display: none;";
	document.getElementById("ppal").style="display: none;";
	document.getElementById("profileLeftPanel").style="";

	document.getElementById("estilos").href="profile.css";

	onLoginOk();
}

