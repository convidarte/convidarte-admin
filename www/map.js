//TODO mejorar el tema de las etiquetas de grupos (multiline)
//TODO pintar los globos de usuarios que admiten varios roles de modo que esto sea claro.
// todo podríamos usar
//      map.getBounds().contains(marker.getPosition())
// para mostrar solo los markers que están en el frame
// en el evento bounds_changed se triggerearia un for que recorre todos los marcadores y setea map solo en los que quedan visibles

function initMap() {
	var centroMapa = {lat: -34.62, lng: -58.46};
	map = new google.maps.Map(document.getElementById('map'), {
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
}


// Adds a marker to the collection and push to the array.
function addMarker(markerCollection, location,label,color,infoWindowContent) {
	var marker = new google.maps.Marker({
		position: location,
		label: {text:label,fontWeight:"bold",fontSize: "18px"},
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
	if (infoWindowContent!=""){
		var infowindow = new google.maps.InfoWindow({
			content: infoWindowContent
		});
		marker.addListener('click', function() {
			infowindow.open(map, marker);
		});
	}
	markerCollection.push(marker);
	return marker;
}

function refreshUserMarkers(){
	for (var i = 0; i < users.length; i++) {
		createMarker(i);
	}
}

function createMarker(i){
	u = users[i];
	createMarkerByUser(u);
}

function createMarkerByUser(u){
	coords = { lat: parseFloat(u.address.latitude), lng: parseFloat(u.address.longitude) };
	label = u.user_id.toString()+": "+encodeHTML(u.user_name);
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
	infoUser = "";
	marker = addMarker(markers,coords,label,color,infoUser);
	var j = u.user_id.toString();
	marker.addListener('click', function(){markerClicked(j);} );
	if (u.role=="admin"){ // ocultamos los markers para los roles de admin
		marker.setMap(null);
	}
}




function refreshGroupMarkers(){
	for (var i = 0; i < groups.length; i++) {
		g = groups[i];
		createGroupMarker(g);
	}
}

function createGroupMarker(g){
	coords = { lat: parseFloat(g.average_latitude), lng: parseFloat(g.average_longitude) };
	label = g.group_id.toString() + ": "+ encodeHTML(g.name);
	infoWindowText = "Grupo " + g.group_id.toString() + " - "+ encodeHTML(g.name)+"<br/>";
	infoWindowText += g.role_count.cook + " cocinero(s) <br/>" ;
	infoWindowText += g.role_count.driver+ " distribuidor(es)<br/>";
	infoWindowText += g.role_count.delegate + " delegado(s)<br/>";
	infoWindowText += "El punto en el mapa es la ubicación promedio de los miembros del grupo.<br/>";
	var color = "yellow";
	marker = addMarker(groupMarkers, coords,label,color,infoWindowText);
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

function centerMapOn(lat,long){
	map.setCenter(new google.maps.LatLng(lat, long));
}

function displayGroupOnMap(g){
	gadmin = getGroupAdminEndpointById(g.group_id);
	deleteMarkers();
	createGroupMarker(gadmin);
	centerMapOn(gadmin.average_latitude, gadmin.average_longitude);

	for (var i=0; i< g.members.length; i++){
		u = g.members[i];
		for (var j=0; j<u.roles_in_group.length;j++){
			r = u.roles_in_group[j].role;
			ur = JSON.parse(JSON.stringify(u));
			ur.role = r;
			createMarkerByUser(ur);
		}
	}
}
