function changeUsersTab(){
	//alert("cambio a users");
	currentTab = "users";
	document.getElementById("usersLeftPanel").style="";
	document.getElementById("filterLocation").style="";
	document.getElementById("groupsLeftPanel").style="display:none";
	onTabChange();
}


function changeGroupsTab(){
	//alert("cambio a groups");
	currentTab = "groups";
	document.getElementById("groupsLeftPanel").style="";
	document.getElementById("usersLeftPanel").style="display: none";
	document.getElementById("filterLocation").style="display: none;";
	onTabChange();
}

