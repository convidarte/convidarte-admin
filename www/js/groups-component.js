Vue.component('groups-component', {
	data: function(){
			return {
				state: store.state,
				currentlySplittingGroup: false,
				userRolesNewGroup: new Set(),
				group: null,
			}
	},
	computed:{
		refresh: function(){
			console.log("(",this.state.refreshTime,") showing group #", this.state.currentGroupId);
			var gid= store.state.currentGroupId;
			this.currentlySplittingGroup=false;
			if(gid!=0){
				var self = this;
				getGroup(gid).then(group => {self.group=group;});
			}else{
				this.group=null;
			}
			return "";
		},
		groupName: function(){
			if(this.group){
				return this.group.name;
			}
			return "";
		},
		groupId: function(){
			if(this.group){
				return this.group.group_id;
			}
			return 0;
		},
		members: function(){
			if(this.group==null) return [];
			var memberArray = [];
			for (var i = 0; i <  this.group.members.length; i++){
				var member = {};
				var u = this.group.members[i];
				member.userId = u.user_id;
				member.addressToShow = fullAddressToShow(u);
				var addressGoogle = addressGoogleMaps(u);
				member.urlMaps = urlGoogleMaps(u);
				member.lastActiveDate = (new Date(u["last_active_date"])).toLocaleDateString();
				var ack = u.roles_in_group[0].ack_delegate;// el ack del primer rol que tenga el usuario en el grupo
				member.style = ack ? "" : "background-color:lightgreen;";
				member.nameToShow = nameToShow(u);
				member.rolesInGroup = [];
				for (var j =0;  j< u.roles_in_group.length; j++){
					var roleInGroup = {};
					var role = u.roles_in_group[j].role;
					roleInGroup.role = role;
					roleInGroup.roleInSpanish=roleInSpanish(role);
					roleInGroup.checked = (this.currentlySplittingGroup) &&  (this.userRolesNewGroup.has( {user_id: uid ,role: role} ));
					member.rolesInGroup.push(roleInGroup);
				}
				memberArray.push(member);
			}
			return memberArray.reverse();
		},
		ackPendingStat: function(){
			if(this.group==null) return 0;
			var count=0;
			for (var i = 0; i <  this.group.members.length; i++){
				var u = this.group.members[i];
				var ack = u.roles_in_group[0].ack_delegate;
				if (!ack){
					count++;
				}
			}
			return count;
		},
		delegates: function(){
			var isDelegateInGroup = (u  => u["roles_in_group"].filter(r => r["role"]=="delegate").length>0);
			var groupDelegates = this.group.members.filter(isDelegateInGroup);
			return groupDelegates;	
		},
		numberCooks: function(){
			return this.group.members.filter( function(u){ return u.roles_in_group.filter(r => r["role"]=="cook").length>0 }).length;
		},
		numberDrivers: function(){
			return this.group.members.filter( function(u){ return u.roles_in_group.filter(r => r["role"]=="driver").length>0}).length;
		},
		splittingGroup: function(){
			return this.currentlySplittingGroup;
		},
		notSplittingGroup: function(){
			return ! this.currentlySplittingGroup;
		},
	},
	methods:{
		checkboxChange: function (){
			var checkBox = event.target;
			var uid = parseInt(checkBox.getAttribute("userId"),10);
			var role = checkBox.getAttribute("role");
			if (event.target.checked){
				this.userRolesNewGroup.add( {user_id: uid, role: role} );
			}else{
				this.userRolesNewGroup.delete( {user_id: uid ,role: role} );
			}
		},
		splitGroup: function(name){
			console.log("split group with new name: ", name );
			var gid = store.state.currentGroupId;
			var currentGroupName = this.groupName;
			if(name==""){
				alert("Error: el nombre del nuevo grupo no puede quedar vac??o");
				return;
			}
			var userRoles = Array.from(this.userRolesNewGroup);
			postGroup(name,userRoles).then(
				function(){
					removeUserRolesFromGroup(gid,currentGroupName,userRoles).then(
						() => alert("El grupo fue dividido correctamente.")
					).catch(
						() => alert("El grupo nuevo fue creado. Error al quitar a los usuarios del grupo actual. Removerlos a mano.")
					);
				}
			).catch(() => alert("Error: no se pudo dividir el grupo"));
			this.group=null;
			refreshEverything();
		},
		splitGroupStart: function(){
			console.log("split group start");
			this.currentlySplittingGroup=true;
			this.userRolesNewGroup = new Set();
		},
		splitGroupStop: function(){
			console.log("split group stop");
			this.currentlySplittingGroup=false;
			this.userRolesNewGroup =  new Set();
		},
		renameGroupStart: function(){
			$("#modalRenameGroup").modal("show");
		},
		closeGroup:function(){
			this.splitGroupStop();
			setKey("currentGroupId",0);
			refreshEverything();
		},
	},
	template:`
<div id="groupsLeftPanel">
	<div id="groupMembers" v-if="this.group">
		<div style="float: right;">
			<button type="button" class="close btn-close" aria-label="Close" style="height:1em;width:1em;" @click="closeGroup">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>

		<h2>#{{group.group_id}} - {{ group.name }} </h2>
		<hr style="width:95%;">
		<ul>
			<li>
				<h4>Delegados: <link-user-profile v-for="delegate in delegates"
						:userId="delegate.user_id"
						:userName="delegate.user_name"></link-user-profile>
				</h4>
				<p v-if="delegates.length==0">El grupo no tiene delegados.</p>
			</li>
			<li><h4>{{numberCooks}} chefs - {{numberDrivers}} distribuidores</h4></li>
			<li><h4>{{ackPendingStat}} miembros para contactar</h4></li>

		</ul>
		<hr style="width:95%;">
		<group-detail-printable :group="this.group"></group-detail-printable>
		<group-csv-link :group="this.group"></group-csv-link >
		<hr style="width:95%;">
		<div>
			<table style="width:100%;"><tr>
			<td><button class="btn btn-primary float-left" @click="renameGroupStart" >Cambiar nombre</button></td>
			<td><button type="button" class="btn btn-primary" @click="splitGroupStart">Dividir grupo</button></td>
			<td><button-delete-group class="btn btn-danger float-right" :groupId="groupId">Borrar grupo</button-delete-group></td>
			<td><button-delete-group-inactivate class="btn btn-danger float-right" :groupId="groupId">Borrar grupo e inactivar a todos</button-delete-group-inactivate></td>
			</tr></table>
		</div>
		<modal-rename-group :group="group"></modal-rename-group>
		<split-group-form
			 :splittingGroup="splittingGroup"
			 @splitGroup="splitGroup"
			 @splitGroupStart="splitGroupStart"
			 @splitGroupStop="splitGroupStop"
		></split-group-form>
		<table id="groupDetailTable" class="table table-striped">
			<tr><th>Id</th> <th>Nombre</th><th>Direcci??n</th><th>Rol(es)</th> </tr>
			<tr v-for="member in members" :style="member.style" >
				<td>{{ member.userId }}</td>
				<td>
					<link-user-profile
						:userId="member.userId"
						:userName="member.nameToShow"
					></link-user-profile>
				</td>
				<td><a :href="member.urlMaps" target="_blank"> {{ member.addressToShow }}  </a> <br>
					({{member.lastActiveDate}})</td>
				<td>
					<table>
						<tr v-for="roleInGroup in member.rolesInGroup">
							<td>{{ roleInGroup.roleInSpanish }}</td>
							<td v-if="splittingGroup">
								<input 
									:userId="member.userId"
									:role="roleInGroup.role"
									type="checkbox" 
									v-model="roleInGroup.checked"
									@change="checkboxChange"
								></input>
							</td>
							<td v-if="notSplittingGroup">
								<button-delete-role
									:groupId="groupId"
									:userId="member.userId"
									:role="roleInGroup.role"
								></button-delete-role>
							</td>
							<td v-if="notSplittingGroup">
								<button-delete-inactivate-role
									:groupId="groupId"
									:userId="member.userId"
									:role="roleInGroup.role"
								></button-delete-inactivate-role>
							</td>
						</tr>
					</table>			
				</td>
			</tr>
		</table>
	</div>
	{{ refresh }}
</div>
` 
});

