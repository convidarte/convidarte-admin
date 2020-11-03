function roleInSpanish(role){
	if (role=="cook"){
		return "Chef";
	}else if (role=="driver"){
		return "Distribuidor";
	}else if (role=="delegate"){
		return "Delegado";
	}else if (role=="admin"){
		return "Coordinador";
	}
	return "";
}

function roleInSpanishPlural(role){
	if (role=="cook"){
		return "Chefs";
	}else if (role=="driver"){
		return "Distribuidores";
	}else if (role=="delegate"){
		return "Delegados";
	}else if (role=="admin"){
		return "Coordinadores";
	}
	return "";
}

function nameToShow(u){
	var name = u.user_name;
	if (u.name!="" || u.last_name!="" ){
		name = u.user_name+" ("+ u.name +" " + u.last_name + ")";
	}
	return name;
}

function checkHasNoCoordinates(user){
	return user.address.latitude.toString()=="0";
}

function addressToShow(u){
	return u.address.street +" "+u.address.number.toString()+ " "+ u.address.floor_and_apartment + " ("+ u.address.neighborhood+") " + u.address.city+", "+u.address.province;
}

function urlGoogleMaps(u){
	return "https://www.google.com/maps/search/"+encodeURI(addressGoogleMaps(u));
}

function addressGoogleMaps(u){
	return prepareAddressGoogleMaps(u.address.street, u.address.number, u.address.city, u.address.province)
}

function prepareAddressGoogleMaps(street,number,city,province){
	return street +" "+number.toString()+", " +city+", "+province;
}

