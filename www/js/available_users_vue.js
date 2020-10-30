Vue.component('available-users-component', {
	data: function(){
			return {
				state: store.state,
			}
	},
	computed:{
		refresh : function(){
			console.log("refrescando usuarios disponibles desde vue", store.state.refreshTime);
			if(token==""){
				return;
			}
			if(this.state.currentTab=="users"){
				refreshUserListUsers();
				refreshPagination();
			}
			return "";
		},
	},
	template:`
<div id="usersLeftPanel" style="display: none;">
	{{ refresh }}
    <h2 id="usersListTitle"></h2>
    <div id="usersList">
      <table id="usersListTable" class="table table-striped">
      </table>
    </div>
    <div id="pagination">
      <table style="border: none; margin: 0 auto; ">
        <tr>
          <td style="border: none;"><button id="buttonPreviousPage" onclick="previousPage()">Página anterior</button></td>
          <td style="border: none;"><div id="currentPageDiv">Página 1 de 1</div></td>
          <td style="border: none;"> <button id="buttonNextPage" onclick="nextPage()">Página siguiente</button></td>
        </tr>
      </table>
    </div>
  </div>`
});

