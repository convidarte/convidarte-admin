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
	refreshGroupMarkers();
	/*

	refreshUserMarkers(); // pendiente

	*/
	//centerMapOn(-34.62, -58.46);
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
