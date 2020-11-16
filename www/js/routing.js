function urlUserProfile(u){
	return '/?perfil/'+u["user_id"].toString()+"/"+u["name"].trim()+"-"+u["last_name"].trim();
}

function urlGroup(g){
	return '/?grupo/'+g["group_id"].toString()+"/"+g["name"].trim();
}

function showGroupById(groupId){
	console.log("showGroupById",groupId);
	store.setKey("currentGroupId",groupId);
	if (groupId!=0){
		var g = getGroup(groupId);
		var url = urlGroup(g);
		if( store.state.currentTab != "groups"){
			store.setKey("currentTab","groups");
		}
		window.history.pushState('grupos', '', url);
	}
}

function onClickShowGroup(){
	event.preventDefault();
	var link = event.target;
	var groupId = link.getAttribute("data-gid");
	showGroupById(groupId);
}

function showModalProfile(uid){
	store.setKey("currentUserId",uid);
	$("#modalProfile").modal('show');
	var u = getUserById(uid);
	if (u!==null){
		window.history.pushState('perfil', '', urlUserProfile(u));
	}
}

function processQueryString(){
	const queryString = window.location.search;
	console.log(queryString);
	if(queryString.startsWith("?perfil/")){
		var uid = parseInt(queryString.split("/")[1],10);
		store.setKey("currentTab", "users");
		showModalProfile(uid);
		return;
	}
	if(queryString.startsWith("?grupos")){
		store.setKey("currentTab", "groups");
		return;	
	}
	if(queryString.startsWith("?usuarios")){
		store.setKey("currentTab", "users");
		return;	
	}
	if(queryString.startsWith("?grupo")){
		var gid = parseInt(queryString.split("/")[1],10);
		store.setKey("currentGroupId", gid);
		store.setKey("currentTab", "groups");
		return;
	}
	if( store.state.currentSystem=="admin"){
		store.setKey("currentTab", "users");
	}
	if( store.state.currentSystem=="delegate"){
		store.setKey("currentTab", "groups");
	}

}
