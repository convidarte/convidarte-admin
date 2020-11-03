//TODO mejorar el tema de las etiquetas de grupos (multiline)
//TODO pintar los globos de usuarios que admiten varios roles de modo que esto sea claro.
// todo podríamos usar
//      map.getBounds().contains(marker.getPosition())
// para mostrar solo los markers que están en el frame
// en el evento bounds_changed se triggerearia un for que recorre todos los marcadores y setea map solo en los que quedan visibles

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
			marker.addListener('click', () =>	showInfoWindow(marker, userMarkerContent( u.user_id.toString(), u.role) ) );
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
	groups = getGroups();
	for (var i = 0; i < groups.length; i++) {
		g = groups[i];
		createGroupMarker(g);
	}
}

function infoWindowTextForGroupMarker(gid){
	var g = getGroupAdminEndpointById(gid);
	var infoWindowText = "Grupo " + g.group_id.toString() + " - "+ encodeHTML(g.name)+"<br/>";
	infoWindowText += g.role_count.cook + " cocinero(s) <br/>" ;
	infoWindowText += g.role_count.driver+ " distribuidor(es)<br/>";
	infoWindowText += g.role_count.delegate + " delegado(s)<br/>";
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
	marker.addListener('click', () =>	showInfoWindow(marker, infoWindowTextForGroupMarker(gid) ) );
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
	var gadmin = getGroupAdminEndpointById(g.group_id);
	if (gadmin!= null){
		createGroupMarker(gadmin);
	}
	//centerMapOn(map, gadmin.average_latitude, gadmin.average_longitude);
	for (var i=0; i < g.members.length; i++){
		var u = g.members[i];
		for (var j=0; j<u["roles_in_group"].length;j++){
			var r = u["roles_in_group"][j].role;
			var ur = JSON.parse(JSON.stringify(u));
			ur.role = r;
			createUserMarker(ur,true);
		}
	}
}

function centerMapOnGroup(gid){
	var gadmin = getGroupAdminEndpointById(gid);
	if (gadmin != null){
		centerMapOn(map, gadmin.average_latitude, gadmin.average_longitude);
	}
}
