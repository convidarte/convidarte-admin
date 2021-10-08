function urlUserProfile(u){
	return '/?perfil/'+u["user_id"].toString()+"/"+u["name"].trim()+"-"+u["last_name"].trim();
}

function urlGroup(g){
	return '/?grupo/'+g["group_id"].toString()+"/"+g["name"].trim();
}

function urlMyGroup(g){
	return '/?mi-grupo/'+g["group_id"].toString()+"/"+g["name"].trim();
}

function showGroupById(groupId){
	console.log("showGroupById",groupId);
	setKey("currentGroupId",groupId);
	if (groupId!=0){
		getGroup(groupId).then( group =>{
			var url = urlGroup(group);
			if( !(["groups", "mygroups"].includes(store.state.currentTab)) ){
				setKey("currentTab","groups");
			}
			window.history.pushState('grupos', '', url);
		});
	}
}

function showMyGroupById(groupId){
	console.log("showMyGroupById",groupId);
	setKey("currentMyGroupId",groupId);
	if (groupId!=0){
		getGroup(groupId).then( group =>{
			var url = urlMyGroup(group);
			if(store.state.currentTab!="mygroups"){
				setKey("currentTab","mygroups");
			}
			window.history.pushState('mis-grupos', '', url);
		});
	}
}


function onClickShowGroup(){
	event.preventDefault();
	var link = event.target;
	var groupId = link.getAttribute("data-gid");
	showGroupById(groupId);
}

function showModalProfile(uid){
	setKey("currentUserId",uid);
	$("#modalProfile").modal('show');
	getUserProfile(uid).then( user => { window.history.pushState('perfil', '', urlUserProfile(user)); });	
}

function processQueryString(){
	const queryString = window.location.search;
	console.log(queryString);
	if(queryString.startsWith("?perfil/")){
		var uid = parseInt(queryString.split("/")[1],10);
		setKey("currentTab", "users");
		showModalProfile(uid);
		return;
	}
	if(queryString.startsWith("?grupos")){
		setKey("currentTab", "groups");
		return;	
	}
	if(queryString.startsWith("?mis-grupos")){
		setKey("currentTab", "mygroups");
		return;	
	}
	if(queryString.startsWith("?usuarios")){
		setKey("currentTab", "users");
		return;	
	}
	if(queryString.startsWith("?grupo")){
		var gid = parseInt(queryString.split("/")[1],10);
		setKey("currentGroupId", gid);
		setKey("currentTab", "groups");
		return;
	}
	if(queryString.startsWith("?mi-grupo")){
		var gid = parseInt(queryString.split("/")[1],10);
		setKey("currentGroupId", gid);
		setKey("currentTab", "mygroups");
		return;
	}
	if(queryString.startsWith("?listado-delegados")){
		setKey("currentTab", "delegatelist");
		return;
	}	
	if( store.state.systemUserRoles.indexOf("admin")>=0 ){
		setKey("currentTab", "users");
		return;
	}
	if( store.state.systemUserRoles.indexOf("delegate")>=0 ){
		setKey("currentTab", "groups");
		return;
	}
	setKey("currentTab", "myprofile");
}
