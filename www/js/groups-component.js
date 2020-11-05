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
			console.log("(",this.state.refreshTime,")Cambio el grupo actual a ", this.state.currentGroupId);
			var gid= store.state.currentGroupId;
			this.currentlySplittingGroup=false;
			this.group = getGroup(gid);
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
				member.addressToShow = addressToShow(u);
				var addressGoogle = addressGoogleMaps(u);
				member.urlMaps = urlGoogleMaps(u);
				var ack = u.roles_in_group[0].ack_delegate;// el ack del primer rol que tenga el usuario en el grupo
				member.style = ack ? "" : "background-color:lightgreen;";
				member.nameToShow = nameToShow(u); 
				//member.linkProfileId = "viewProfileLink_"+member.userId.toString();
				member.showAckButton = store.state.currentSystem=="delegate" && (!ack);
				member.rolesInGroup = [];
				for (var j =0;  j< u.roles_in_group.length; j++){
					var roleInGroup = {};
					var role = u.roles_in_group[j].role;
					roleInGroup.role = role;
					roleInGroup.roleSpanish=roleInSpanish(role);
					roleInGroup.checked = (this.currentlySplittingGroup) &&  (this.userRolesNewGroup.has( {user_id: uid ,role: role} ));
					member.rolesInGroup.push(roleInGroup);
				}
				memberArray.push(member);
			}
			return memberArray;
		},
		delegates: function(){
			var isDelegateInGroup = (u  => u["roles_in_group"].filter(r => r["role"]=="delegate").length>0);
			var groupDelegates = this.group.members.filter(isDelegateInGroup);
			return groupDelegates;	
//			var s = groupDelegates.map( u => u["user_name"] ).join(" ");
	//		if (s=="") return "el grupo no tiene delegado.";
		//	return s;
		},
		numberCooks: function(){
			return this.group.members.filter( function(u){ return u.roles_in_group.filter(r => r["role"]=="cook").length>0 }).length;
		},
		numberDrivers: function(){
			return this.group.members.filter( function(u){ return u.roles_in_group.filter(r => r["role"]=="driver").length>0}).length;
		},

		style: function(){
			if(this.state.currentTab=="users"){
				return "display: none;";
			}
			if(this.state.currentTab=="groups"){
				return "";
			}
			return "display:none;";
		},
		delegateSystem: function(){
			return store.state.currentSystem=="delegate";
		},
		adminSystem: function(){
			return store.state.currentSystem=="admin";
		},
		splittingGroup: function(){
			return this.currentlySplittingGroup;
		},
		notSplittingGroup: function(){
			return ! this.currentlySplittingGroup;
		},
	},
	methods:{
		changeName: function(){
			var name = document.getElementById("changeNameTo").value;
			var groupId = store.state.currentGroupId;
			changeGroupName(groupId,name);
		},
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
				alert("Error: el nombre del nuevo grupo no puede quedar vacío");
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
		openModalProfileOnClick: function(e){
			e.preventDefault(); 
			var uid = parseInt(e.target.getAttribute("value"),10);
			showModalProfile(uid);
			return false;
		},
	},
	template:`
<div id="groupsLeftPanel" :style="style">  
	<div id="groupMembers" v-if="this.group">
		<div>
			<h2>{{ groupName }} </h2>
			<div>
				<ul>
					<li>
						<h4>Delegados:&nbsp; 
							<a v-for="delegate in delegates"
								 :value="delegate.user_id"
								 href="" class="viewProfileLink" @click="openModalProfileOnClick">
								@{{ delegate.user_name }}
							</a>
						</h4>
					</li>
					<li><h4>{{numberCooks}} chefs - {{numberDrivers}} distribuidores</h4></li>
				</ul>
			</div>
			<group-detail-printable :group="this.group"></group-detail-printable>
			<group-csv-link :group="this.group"></group-csv-link >
		</div>

		<div style="margin-left:15px;" v-if="adminSystem">
			<h3> Cambiar el nombre del grupo</h3>
			Nuevo nombre: <input id="changeNameTo"></input>
			<button @click="changeName">Cambiar nombre</button>
		</div>
		<div style="margin-left:15px;" v-if="adminSystem">
			<h3> Borrar grupo</h3>
			<button-delete-group :groupId="groupId"></button-delete-group>
		</div>
		<split-group-form
			v-if="adminSystem"
			 :splittingGroup="splittingGroup"
			 @splitGroup="splitGroup"
			 @splitGroupStart="splitGroupStart"
			 @splitGroupStop="splitGroupStop"
		></split-group-form>
		<table id="groupDetailTable" class="table table-striped">
			<tr><th>Id</th> <th>Nombre</th><th>Dirección</th><th>Rol(es)</th> </tr>
			<tr v-for="member in members" :style="member.style" >
				<td>{{ member.userId }}</td>
				<td>
					<a :value="member.userId" href="" class="viewProfileLink" v-on:click="openModalProfileOnClick" >
						{{ member.nameToShow }}
					</a>
					<button-ack-delegate
						v-if="member.showAckButton"
						v-bind:groupId="groupId"
						v-bind:userId="member.userId"
						v-bind:role="member.roleAck"
					></button-ack-delegate>
				</td>
				<td><a :href="member.urlMaps" target="_blank"> {{ member.addressToShow }} </a></td>
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

function showGroupById(groupId){
	console.log("showGroupById",groupId);
	store.setCurrentGroupId(groupId);
	if (groupId!=0){
		var g = getGroup(groupId);
		var url = "/?grupo/"+ g["group_id"]+"/"+g["name"];
		window.history.pushState('grupos', '', url);
	}
}
