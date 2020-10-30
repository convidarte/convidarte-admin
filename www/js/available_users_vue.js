Vue.component('available-users-component', {
	data: function(){
			return {
				state: store.state,
				numberPages: 0,
				currentPage: 0,
				rowsPerPage:15,
			}
	},
	computed:{
		refresh : function(){
			console.log("refrescando usuarios disponibles desde vue", store.state.refreshTime);
			if(token==""){
				return;
			}
			if(this.state.currentTab=="users"){
				var numberUsers = store.state.usersFiltered.length;
				this.numberPages = Math.ceil(numberUsers/this.rowsPerPage);
				if ( this.currentPage >= this.numberPages ) this.currentPage = 0;
				refreshUserListUsers(this.currentPage, this.rowsPerPage, this.numberPages);
			}
			return "";
		},
		paginationText : function(){
			if(this.numberPages == 0){
				return "Página " + (this.currentPage+1).toString() + " de 1";
			}
			return "Página " + (this.currentPage+1).toString() + " de " + (this.numberPages).toString();
		},
		title: function(){
			var currentNeighborhood = document.getElementById("selectNeighborhood").value;
			var currentCity = document.getElementById("selectCity").value;
			var title = roleInSpanish(this.state.roleFilterValue) + " sin grupo ";
			filters = [this.state.cityFilterValue, this.state.neighborhoodFilterValue].filter(x=> x!="");
			title +=  (filters.length > 0) ? " en "+ filters.join(", ") :  " en todas las localidades";
			title += " ("+ this.state.usersFiltered.length +")";
			return title;
		},
	},
	methods:{
		nextPage: function(){
			if(this.currentPage+1 < this.numberPages){
				this.currentPage++;
			}
		},
		previousPage: function(){
			if(this.currentPage-1 >= 0){
				this.currentPage--;
			}
		}

	},
	template:`
<div id="usersLeftPanel" style="display: none;">
	{{ refresh }}
    <h2 id="usersListTitle">{{title}}</h2>
    <div id="usersList">
      <table id="usersListTable" class="table table-striped">
      </table>
    </div>
    <div id="pagination">
      <table style="border: none; margin: 0 auto; ">
        <tr>
          <td style="border: none;"><button id="buttonPreviousPage" v-on:click="previousPage">Página anterior</button></td>
          <td style="border: none;"><div id="currentPageDiv"> {{ paginationText }} </div></td>
          <td style="border: none;"> <button id="buttonNextPage" v-on:click="nextPage">Página siguiente</button></td>
        </tr>
      </table>
    </div>
  </div>`
});

function refreshUserListUsers(currentPage, rowsPerPage,numberPages){
	var availableUsers = getUsersFiltered();
	var showOnlyAvailable = true;
	if (onlyUsersWithoutAddress){
		availableUsers = availableUsers.filter(checkHasNoCoordinates);
	}
	usersListTable = document.getElementById("usersListTable");
	genericHead = "<thead><tr><th scope=\"col\">ID</th><th scope=\"col\">Rol</th><th scope=\"col\">Nombre y apellido</th><th scope=\"col\">Dirección</th><th scope=\"col\">Asignar grupo</th><th scope=\"col\"></th></tr></thead>";
	usersListTableInnerHTML = genericHead+"<tbody>";
	var userRows = new Array();
	var nUsers = 0;
	var numberUsers = availableUsers.length;
	for (var i = currentPage*rowsPerPage; i < Math.min(numberUsers,(currentPage+1)*rowsPerPage) ; i++) {
		u = availableUsers[i];
		uid = u.user_id;
		address = u.address.street +" "+u.address.number.toString()+ " "+ u.address.floor_and_apartment + " ("+ u.address.neighborhood+") " + u.address.city+", "+u.address.province;
		addressGoogle = prepareAddressGoogleMaps(u.address.street, u.address.number, u.address.city, u.address.province);
		urlMaps = "https://www.google.com/maps/search/"+encodeURI(addressGoogle);
		row="<tr>";
		row+="<th scope=\"row\">"+uid+"</th>";
		if (u.role == "cook") {
			row+="<td>Cocinero</td>";
		}
		if (u.role == "driver") {
			row+="<td>Distribuidor</td>";
		}
		if (u.role == "delegate") {
			row+="<td>Delegado</td>";
		}
		nameToShow = encodeHTML(u.user_name);
		if (u.name!="" || u.last_name!="" ){
			nameToShow =encodeHTML(u.user_name)+" ("+encodeHTML(u.name) +" " + encodeHTML(u.last_name) + ")"; 
		}

		viewProfileLink = "viewProfileLink_"+uid.toString();
		row+="<td><a id=\"" + viewProfileLink + "\" href=\"\" class=\"viewProfileLink\" >" + nameToShow + "</a></td>";
		row+="<td><a href=\""+urlMaps+"\" target=\"_blank\">"+ encodeHTML(address)+"</a></td>";
		if(showOnlyAvailable){
			row += "<td>" + getGroupSelectHTML( "selectGroup" + uid.toString() ) + "<button id=\"agregar"+ uid.toString() + "\" onclick=\"assignGroup()\" value=\""+ uid.toString() +"\" name=\""+encodeHTML(u.user_name) +"\" visible=\"1\"  > Agregar </button></td>";
		}else{
			//row+= groupsOfUser(u);
		}
		row += "</tr>\n";
		userRows[nUsers++]=row;
	}
	usersListTableInnerHTML += userRows.join('\n') + "</tbody>";
	usersListTable.innerHTML =usersListTableInnerHTML;
	$("."+"viewProfileLink").click(
		function(e){
			e.preventDefault(); 
			var uid = e.target.id.split("_")[1];
			showModalProfile(uid);
			return false;
		} 
	);
}




