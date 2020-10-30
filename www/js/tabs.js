function changeUsersTab(){
	store.setCurrentTab("users");
	document.getElementById("usersLeftPanel").style="";
	document.getElementById("filterLocation").style="";
	document.getElementById("selectUserComponent").style="";
	document.getElementById("selectGroupComponent").style="display:none";
	document.getElementById("groupsLeftPanel").style="display:none";
	document.getElementById("nav-link-users").parentElement.className="nav-item active";
	document.getElementById("nav-link-groups").parentElement.className="nav-item";
	window.history.pushState('usuarios', '', '/?usuarios');
	map.setZoom(12);
	refreshEverything();
}


function changeGroupsTab(){
	store.setCurrentTab("groups");
	document.getElementById("groupsLeftPanel").style="";
	document.getElementById("selectUserComponent").style="";
	document.getElementById("selectGroupComponent").style="";
	document.getElementById("usersLeftPanel").style="display: none";
	document.getElementById("filterLocation").style="display: none;";
	document.getElementById("nav-link-groups").parentElement.className="nav-item active";
	document.getElementById("nav-link-users").parentElement.className="nav-item";
	window.history.pushState('grupos', '', '/?grupos');
	map.setZoom(15);
	refreshEverything();
}

