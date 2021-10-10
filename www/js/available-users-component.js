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
			console.log("refrescando usuarios disponibles ", store.state.refreshTime);
			if(this.state.token=="") return "";
			var numberUsers = this.state.usersFiltered.length;
			this.numberPages = Math.ceil(numberUsers/this.rowsPerPage);
			if ( this.currentPage >= this.numberPages ) this.currentPage = 0;
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
		rows : function (){
			var availableUsers = this.state.usersFiltered;
			var userRows = new Array();
			var nUsers = 0;
			var numberUsers = availableUsers.length;
			var pageStart = this.currentPage * this.rowsPerPage;
			var pageEnd = Math.min( numberUsers, (this.currentPage+1) * this.rowsPerPage );
			for (var i = pageStart;  i < pageEnd; i++) {
				var row = {}
				u = availableUsers[i];
				uid = u.user_id;
				row.uid = uid;
				row.address = fullAddressToShow(u);
				row.urlMaps = urlGoogleMaps(u);
				row.role = u.role;
				row.roleSpanish = roleInSpanish(u.role);
				row.nameToShow = nameToShow(u);
				row.linkProfileId = "viewProfileLink_"+uid.toString();
				row.lastActiveDate = (new Date(u["last_active_date"])).toLocaleDateString();
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
	},
	template:`
<div>
	{{ refresh }}
    <h2 id="usersListTitle">{{title}}</h2>
    <div id="usersList">
      <table id="usersListTable" class="table table-striped">
	  <thead>
			<tr>
				<th scope="col">ID</th>
				<th scope="col">Rol</th>
				<th scope="col">Nombre y apellido / Disponible al</th>
				<th scope="col">Dirección</th>
				<th scope="col">Asignar grupo</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="row in rows" :key="row.uid">
				<th>{{ row.uid }}</th>
				<td>{{ row.roleSpanish }}</td>
				<td>
					<a :id="row.linkProfileId" href="" class="viewProfileLink" v-on:click="openModalProfileOnClick" >
						{{ row.nameToShow }}
					</a>
					<br>
					{{row.lastActiveDate}}
				</td>
				<td><a :href="row.urlMaps" target="_blank"> {{ row.address }} </a></td>
				<td>
					<form-assign-group :userId="row.uid" :role="row.role" ></form-assign-group>
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

