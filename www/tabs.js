function changeUsersTab(){
	//alert("cambio a users");
	currentTab = "users";
	document.getElementById("usersRightMenu").style="";
	document.getElementById("mapRightMenu").style="";
	//document.getElementById("groupsRightMenu").style="";
	//document.getElementById("profileRightMenu").style="display: none;";
	document.getElementById("filterLocation").style="";

	document.getElementById("map").style="";
	document.getElementById("usersLeftPanel").style="";
	//document.getElementById("ppal").style="display: none;";
	//document.getElementById("profileLeftPanel").style="display: none;";

	// document.getElementById("estilos").href="css/users.css";

	onTabChange();
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

	// document.getElementById("estilos").href="css/map.css";

	onTabChange();
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

	// document.getElementById("estilos").href="css/groups.css";

	onTabChange();
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

	// document.getElementById("estilos").href="css/profile.css";

	onTabChange();
}

