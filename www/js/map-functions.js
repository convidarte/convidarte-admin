//TODO pintar los globos de usuarios que admiten varios roles de modo que esto sea claro.

function initMaps() {
	var centroMapa = {lat: -34.62, lng: -58.46};
	map = new google.maps.Map(document.getElementById('mapDiv'), {
		zoom: 12,
		center: centroMapa,
		mapTypeId: 'terrain'
	});
	var noPoi = [
	{
		featureType: "poi",
		stylers: [
		  { visibility: "off" }
		]   
	  }
	];
	map.setOptions({styles: noPoi});


	// mapa modal profile
	var mapProp= {
	  center:new google.maps.LatLng(-34.608558, -58.392617),
	  zoom:14,
	};
	mapProfile = new google.maps.Map(document.getElementById("profileMap"),mapProp);
}




// Adds a marker to the collection and push to the array.
function addMarker(markerCollection, location,label,color) {
	var marker = new google.maps.Marker({
		position: location,
		//label: {text:label,fontWeight:"bold",fontSize: "18px"},
		map: map
	});
	if(color=="green"){
		marker.setIcon('https://maps.google.com/mapfiles/ms/icons/green-dot.png')
	}else if(color=="blue"){
		marker.setIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png')
	}else if(color=="yellow"){
		marker.setIcon('https://maps.google.com/mapfiles/ms/icons/yellow-dot.png')
	}else if(color=="purple"){
		marker.setIcon('https://maps.google.com/mapfiles/ms/icons/purple-dot.png')
	}else if(color=="red"){
		marker.setIcon('https://maps.google.com/mapfiles/ms/icons/red-dot.png')
	}
	markerCollection.push(marker);
	return marker;
}

function showInfoWindow( marker, infoWindowContent){
	if (currentInfoWindow== null){
		currentInfoWindow =  new google.maps.InfoWindow({});
	}
	currentInfoWindow.close();
	currentInfoWindow.setContent(infoWindowContent);
	currentInfoWindow.open(marker.map, marker);
}


function userMarkerContent(u,role){
	var uid = u.user_id;
	var s = "";
	if (store.state.currentSystem=="admin"){
		s+="<a href=\"#\" data-uid=\""+uid.toString()+"\" onclick=\"showModalProfileTooltip()\">"+ encodeHTML(u.name)+" " + encodeHTML(u.last_name) + "</a>";
	}else{
		s+=encodeHTML(u.name) + " " + encodeHTML(u.last_name);
	}
	s += "<div>@"+ encodeHTML(u.user_name)+ " - #"+ u.user_id.toString()+ "</div>";
	s += "<div>" + roleInSpanish(role) + "</div>";
	s += "<div>" + encodeHTML(u.address.street) + " " + u.address.number.toString() + ", "+encodeHTML(u.address.city)+"</div>";
	if(store.state.currentTab=="users"){
		s+= "<div>"+ (new Date(u["last_active_date"])).toLocaleDateString() +"</div>"; 
		s+= getGroupSelectHTML( "selectGroup" + uid.toString() ) + "<br/>";
		s+="<button id=\"agregar"+ uid.toString() + "\" onclick=\"assignGroup()\" value=\""+ uid.toString() +"\" name=\""+encodeHTML(u.user_name) +"\" visible=\"1\"  > Agregar </button></td>";
	}
	return s;
}

// devuelve el HTML de un select con los grupos existentes y el id especificado.
function getGroupSelectHTML(selectId){
	var groups = store.state.groups;
	var s = "<select id=\""+ selectId + "\" style=\"max-width:120px;\">\n"
	s += "<option disabled selected value> elegir grupo </option>"
	for (var i = 0; i < groups.length; i++) {
		var g = groups[i];
		var group_id = g.group_id.toString();
		s+="<option value=\"" + group_id + "\" >"+ group_id + " - " + encodeHTML(g.name) +"</option>\n";
	}
	s+="</select>";
	return s;
}


function assignGroup(){
	boton = event.target;
	uid = boton.value;
	u = getUserById(uid);
	role = u.role; // cook
	user_role_id = u.role_id; // uint
	user_id = u.user_id; // uint
	group_id = document.getElementById("selectGroup"+uid.toString()).value;
	groupName = getGroupNameById(group_id);
	if (group_id!=""){
		addUserRoleToGroup(u.user_id, u.role, group_id, groupName);
		refreshEverything();
	}else{
		alert("Debe seleccionar un grupo.");
	}
}

function createUserMarker(u, setClickListener){
	if(parseFloat(u.address.latitude)){
		var coords = { lat: parseFloat(u.address.latitude), lng: parseFloat(u.address.longitude) };
		var label = " "; //u.user_id.toString()+": "+encodeHTML(u.user_name);
		var color;
		if (u.role=="cook"){
			color = "red";
		}
		if (u.role=="driver"){
			color = "green";
		}
		if (u.role=="delegate"){
			color = "purple";
		}
		var marker = addMarker(markers,coords,label,color);
		if (setClickListener){
			marker.addListener('click', () =>	showInfoWindow(marker, userMarkerContent( u, u.role) ) );
		}
		if (u.role=="admin"){ // ocultamos los markers para los roles de admin
			marker.setMap(null);
		}
		return marker;
	}
}

function refreshAvailableUsersMarkers(){
	var availableUsers = store.state.usersFiltered;
	for (var i = 0; i < availableUsers.length; i++) {
		u = availableUsers[i];	
		createUserMarker(u,true);
	}
}

function refreshGroupMarkers(){
	var groups = store.state.groups;
	for (var i = 0; i < groups.length; i++) {
		var g = groups[i];
		createGroupMarker(g);
	}
}

function infoWindowTextForGroupMarker(g){
	var infoWindowText = 'Grupo ' + g.group_id.toString() + ' - ' + encodeHTML(g.name)+'<br>';
	if (store.state.currentSystem=="admin"){
		infoWindowText = 'Grupo #'+ g.group_id.toString() + ' - <a href="#" onclick="onClickShowGroup()" data-gid=' + g["group_id"].toString() + '>' + encodeHTML(g.name)+'</a><br>';
		var gadmin = getGroupAdminEndpointById(g.group_id);
		infoWindowText += gadmin.role_count.cook + " cocinero(s) <br/>" ;
		infoWindowText += gadmin.role_count.driver+ " distribuidor(es)<br/>";
		infoWindowText += gadmin.role_count.delegate + " delegado(s)<br/>";
	}
	infoWindowText += "El punto en el mapa es la ubicación promedio de los miembros del grupo.<br/>";
	return infoWindowText;
}

function createGroupMarker(g){
	var coords = { lat: parseFloat(g.average_latitude), lng: parseFloat(g.average_longitude) };
	var label = " ";// g.group_id.toString() + ": "+ encodeHTML(g.name);
	var color = "yellow";
	var marker = addMarker(groupMarkers, coords,label,color);
	//marker.group_id = parseInt(g.group_id,10);
	var gid = g.group_id;
	marker.addListener('click', () =>	showInfoWindow(marker, infoWindowTextForGroupMarker(g) ) );
}

// Sets the map on all markers in the array.
function setMapOnAll(markerCollection, map) {
	for (var i = 0; i < markerCollection.length; i++) {
		markerCollection[i].setMap(map);
	}
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(markerCollection) {
	setMapOnAll(markerCollection,null);
}

// Deletes all markers in the map
function deleteMarkers() {
	clearMarkers(markers);
	clearMarkers(groupMarkers);
	markers = [];
	groupMarkers = [];
}

function centerMapOn(map, lat,long){
	map.setCenter(new google.maps.LatLng(lat, long));
}

function displayGroupOnMap(g){
	deleteMarkers();
	createGroupMarker(groupWithCoordinates(g));
	var setClickListener = true;//store.state.currentSystem=="admin";
	for (var i=0; i < g.members.length; i++){
		var u = g.members[i];
		for (var j=0; j<u["roles_in_group"].length;j++){
			var r = u["roles_in_group"][j].role;
			var ur = JSON.parse(JSON.stringify(u));
			ur.role = r;
			createUserMarker(ur,setClickListener);
		}
	}
}

function centerMapOnGroup(g){
	g = groupWithCoordinates(g);
	centerMapOn(map, g.average_latitude, g.average_longitude);
}

function groupWithCoordinates(g){
	// anda para admin o delegate
	/*
	var gadmin = getGroupAdminEndpointById(gid);
	if (gadmin !== null){
		return gadmin;
	}
	*/
	var coords = averageCoords(g.members);
	g.average_latitude = coords["lat"];
	g.average_longitude = coords["lng"];
	return g;
}




function centerMapOnAverageAvailableUsers(){
	centerMapOnAverageListOfUsers(store.state.usersFiltered);
}

function centerMapOnAverageListOfUsers(listUsers){
	var coords = averageCoords(listUsers);
	centerMapOn(map, coords["lat"], coords["lng"]);
}

function averageCoords(listUsers){
	var cooks = listUsers.filter(u => (u["roles_in_group"].filter(x=> x.role=="cook")).length > 0 );
	var lats = cooks.map( x=> x.address.latitude).filter(x=>x!=0);
	var longs = cooks.map( x=> x.address.longitude).filter(x=>x!=0);
	if (lats.length>0 && longs.length>0){
		var lat = average(lats);
		var lng = average(longs);
		return {lat: lat, lng: lng};
	}
	return {lat: 0, lng:0};
}


function showModalProfileTooltip(){
	event.preventDefault();
	uid = event.target.getAttribute("data-uid");
	showModalProfile(uid);
	return false;
}

