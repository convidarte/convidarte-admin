function changeUsersTab(){
	currentTab = "users";
	document.getElementById("usersLeftPanel").style="";
	document.getElementById("filterLocation").style="";
	document.getElementById("groupsLeftPanel").style="display:none";
	document.getElementById("nav-link-users").parentElement.className="nav-item active";
	document.getElementById("nav-link-groups").parentElement.className="nav-item";
	onTabChange();
}


function changeGroupsTab(){
	currentTab = "groups";
	document.getElementById("groupsLeftPanel").style="";
	document.getElementById("usersLeftPanel").style="display: none";
	document.getElementById("filterLocation").style="display: none;";
	document.getElementById("nav-link-groups").parentElement.className="nav-item active";
	document.getElementById("nav-link-users").parentElement.className="nav-item";
	onTabChange();
}

