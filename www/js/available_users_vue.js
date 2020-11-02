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
			console.log("refrescando usuarios disponibles desde vue",store.state.refreshTime);
			if(this.state.token=="") return "";
			if(this.state.currentTab=="users"){
				var numberUsers = this.state.usersFiltered.length;
				this.numberPages = Math.ceil(numberUsers/this.rowsPerPage);
				if ( this.currentPage >= this.numberPages ) this.currentPage = 0;
			}
			return "";
		},
		numberPagesToShow: function(){
			return (this.numberPages==0) ? 1 : this.numberPages;
		},
		currentPageToShow: function(){
			return this.currentPage+1;
		},
		title: function(){
			var currentNeighborhood = this.state.neighborhoodFilterValue;
			var currentCity = this.state.cityFilterValue;
			var title = roleInSpanishPlural(this.state.roleFilterValue) + " sin grupo ";
			var filters = [this.state.cityFilterValue, this.state.neighborhoodFilterValue].filter(x=> x!="");
			title +=  (filters.length > 0) ? " en "+ filters.join(", ") :  " en todas las localidades";
			title += " ("+ this.state.usersFiltered.length +")";
			return title;
		},
		style: function(){
			if(this.state.currentTab=="groups"){
				return "display: none;";
			}
			if(this.state.currentTab=="users"){
				return "";
			}
			return "display:none;";
		},
		rows : function (){
			var availableUsers = this.state.usersFiltered;
			var userRows = new Array();
			var nUsers = 0;
			var numberUsers = availableUsers.length;
			for (var i = this.currentPage*this.rowsPerPage; i < Math.min(numberUsers,(this.currentPage+1)*this.rowsPerPage) ; i++) {
				var row = {}
				u = availableUsers[i];
				uid = u.user_id;
				row.uid = uid;
				row.address = u.address.street +" "+u.address.number.toString()+ " "+ u.address.floor_and_apartment + " ("+ u.address.neighborhood+") " + u.address.city+", "+u.address.province;
				addressGoogle = prepareAddressGoogleMaps(u.address.street, u.address.number, u.address.city, u.address.province);
				row.urlMaps = "https://www.google.com/maps/search/"+encodeURI(addressGoogle);
				row.role = u.role;
				row.roleSpanish = roleInSpanish(u.role);
				row.nameToShow = u.user_name;
				if (u.name!="" || u.last_name!="" ){
					row.nameToShow = u.user_name + " ("+ u.name +" " + u.last_name + ")"; 
				}
				row.linkProfileId = "viewProfileLink_"+uid.toString();
				row.id_select = "selectGroup"+uid.toString();
				userRows.push(row);
			}
			return userRows;
		}
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
		},
		openModalProfileOnClick: function(e){
			e.preventDefault(); 
			var uid = e.target.id.split("_")[1];
			showModalProfile(uid);
			return false;
		},
		assignGroup: function (){
			var boton = event.target;
			var uid = parseInt(boton.getAttribute("data-uid"),10);
			var role = boton.getAttribute("data-role");
			var gid = parseInt(document.getElementById("selectGroup"+uid.toString()).value,10);
			var groupName = getGroupNameById(gid);
			console.log(uid,role,gid,groupName);
			if (gid!=""){
				addUserRoleToGroup(uid,role,gid, groupName);
				refreshEverything();
			}else{
				alert("Debe seleccionar un grupo.");
			}
		},
	},
	template:`
<div id="usersLeftPanel" :style="style">
	{{ refresh }}
    <h2 id="usersListTitle">{{title}}</h2>
    <div id="usersList">
      <table id="usersListTable" class="table table-striped">
	  <thead>
			<tr>
				<th scope="col">ID</th>
				<th scope="col">Rol</th>
				<th scope="col">Nombre y apellido</th>
				<th scope="col">Dirección</th>
				<th scope="col">Asignar grupo</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="row in rows">
				<th>{{ row.uid }}</th>
				<td>{{ row.roleSpanish }}</td>
				<td><a :id="row.linkProfileId" href="" class="viewProfileLink" v-on:click="openModalProfileOnClick" >{{ row.nameToShow }}</a></td>
				<td><a :href="row.urlMaps" target="_blank"> {{ row.address }} </a></td>
				<td>
					<select-group-component :id="row.id_select"></select-group-component>
					<button v-on:click="assignGroup" :data-uid="row.uid" :data-role="row.role" >Agregar</button>
				</td>
			</tr>
		</tbody>
      </table>
    </div>
    <div id="pagination">
      <table style="border: none; margin: 0 auto; ">
        <tr>
          <td style="border: none;"><button id="buttonPreviousPage" v-on:click="previousPage">Página anterior</button></td>
          <td style="border: none;"><div id="currentPageDiv">Página {{currentPageToShow}} de {{numberPagesToShow}}</div></td>
          <td style="border: none;"> <button id="buttonNextPage" v-on:click="nextPage">Página siguiente</button></td>
        </tr>
      </table>
    </div>
  </div>`
});
