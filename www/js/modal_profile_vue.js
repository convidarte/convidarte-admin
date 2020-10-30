Vue.component('modal-profile-component', {
	data: function(){
			return {
				state: store.state,
			}
	},
	computed:{
		refresh : function(){
			console.log("refrescando perfil usuario desde vue");
			var uid= store.state.currentUserId;
			if( uid!=0 ){
				refreshModalProfile(uid);
			}
			return "";
		},
	},
	methods:{
		open: function(){
			$("#modalProfile").modal();
			window.history.pushState('perfil', '', urlUserProfile(this.user));
		},
	},
	template:
`
<div>
{{ refresh }}
<div class="modal fade" id="modalProfile" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="resetURL()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md-4">
           <h2 id="modalProfileFullName" class="modalFullName"></h2>
           <div id="modalProfileAlias" class="modalAlias"></div>
         </div>
         <div class="col-md-8">
          <ul class="profileActions">
            <li><button type="button" id="modalProfileShareButton" class="btn btn-primary float-right" onclick="shareUserProfile()" >Compartir</button></li>
            <li><button type="button" id="modalProfileAddToGroupButton" class="btn btn-primary float-right" onclick="launchAddToGroupModal()" >Agregar a grupo</button></li>
            <li><button type="button" id="modalProfileAddRoleButton" class="btn btn-primary float-right" onclick="launchGiveNewRoleModal()" >Asignar rol asumible</button></li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <ul>
            <li id="modalProfileUserId" class="modalUserId"></li>
            <li id="modalProfileRoles"></li>
            <li id="modalProfileCellphone"></li>
            <li id="modalProfileEmail"></li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col-md-8" id="modalProfileFullAdress"></div>
        <div class="col-md-4"><a id="modalProfileUrlGoogleMaps" class="btn btn-primary float-right mb-1" target="_blank" href="" role="button">Ver en Google maps</a></div>
      </div>
      <div class="row">
        <div class="col">
          <div id="profileMap"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <h3>Grupos</h3>
          <p id="modalProfileUsersGroups"> Este usuario pertenence a NOMBRE DE GRUPO</p>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <h3>Inactivar usuario</h3>
          <p>Si procedes, este usuario quedará inactivado. Podrás encontrarlo luego en usuarios inactivos.</p>
          <button id ="modalProfileInactivateUser" type="button" class="btn btn-danger" onclick="inactivateUserRoleOnClickModal()">Inactivar usuario</button>
        </div>
      </div>
    </div>
  </div>
</div>
</div>

<!-- modales adicionales -->

<!-- MODAL add user in role to group -->
<div class="modal fade" id="modalAddGroup" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md-4">
           <h2 id="modalProfileFullName" class="modalFullName"></h2>
           <div id="modalProfileAlias" class="modalAlias"></div>
        </div>
        <div class="row">
          <div class="col">
            <h3>Agregar a un grupo:</h3>
            <p id="modalAddGroupContent"> 
			  Agregar al grupo
			  <div id="modalAddGroupSelectGroupContainer"></div>
			  en el rol 
			  <div id="modalAddGroupSelectRoleContainer"></div>
			  <button id="newUserRoleInGroup" onclick="addUserRoleInGroupProfileOnClick()">Agregar</button><br/>
		    </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>


<!-- MODAL add role to user -->
<div class="modal fade" id="modalAddRole" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md-4">
           <h2 id="modalProfileFullName" class="modalFullName"></h2>
           <div id="modalProfileAlias" class="modalAlias"></div>
        </div>
      <div class="row">
        <div class="col">
          <h3>Agregar un rol asumible:</h3>
            <p id="modalAddRoleAvailableRoles"> 
		    </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>

</div>

`
})

