Vue.component('groups-component', {
	data: function(){
			return {
				state: store.state,
				currentlySplittingGroup: false,
				userRolesNewGroup: {},
				group: null,
			}
	},
	computed:{
		refresh: function(){
			console.log("Cambio el grupo actual a ", this.state.currentGroupId);
			var gid= store.state.currentGroupId;
			this.currentlySplittingGroup=false;
			this.userRolesNewGroup = {};
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
				member.addressToShow = u.address.street +" "+u.address.number.toString()+ " "+ u.address.floor_and_apartment + " ("+ u.address.neighborhood+") " + u.address.city+", "+u.address.province;
				var addressGoogle = prepareAddressGoogleMaps(u.address.street, u.address.number, u.address.city, u.address.province);
				member.urlMaps = "https://www.google.com/maps/search/"+encodeURI(addressGoogle);
				var ack = u.roles_in_group[0].ack_delegate;// el ack del primer rol que tenga el usuario en el grupo
				member.style = ack ? "" : "background-color:lightgreen;";
				member.nameToShow = encodeHTML(u.user_name);
				if (u.name!="" || u.last_name!="" ){
					member.nameToShow = encodeHTML(u.user_name)+" ("+encodeHTML(u.name) +" " + encodeHTML(u.last_name) + ")";
				}
				member.linkProfileId = "viewProfileLink_"+member.userId.toString();
				member.showAckButton = store.state.currentSystem=="delegate" && (!ack);
				member.rolesInGroup = [];
				for (var j =0;  j< u.roles_in_group.length; j++){
					var roleInGroup = {};
					var role = u.roles_in_group[j].role;
					roleInGroup.roleSpanish=roleInSpanish(role);
					roleInGroup.checked = this.currentlySplittingGroup &&  ([uid,role] in this.userRolesNewGroup);
					member.rolesInGroup.push(roleInGroup);
				}
				memberArray.push(member);
			}
			return memberArray;
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
			var uid = checkBox.userId;
			var role = checkBox.role;
			if (event.target.checked){
				this.userRolesNewGroup[ [uid,role] ]=true;
			}else{
				delete this.userRolesNewGroup[ [uid,role] ];
			}
		},
		splitGroup: function(name){
			console.log("split group with new name: ", name );
			var gid = store.state.currentGroupId;
			if(name!=""){
				var userRoles = []
				for(x in this.userRolesNewGroup){
					var uid = parseInt(x.split(",")[0],10);
					var role = x.split(",")[1];
					userRoles.push({user_id: uid ,role: role});
				}
				var res = postGroup(name,userRoles);
				if(res==201){
					var currentGroupName  = this.groupName;
					res = removeUserRolesFromGroup(gid,currentGroupName,userRoles);
					if (res== 200){
						alert("El grupo fue dividido correctamente.");
					}else{
						alert("El grupo nuevo fue creado. Error al quitar a los usuarios del grupo actual. Removerlos a mano.");
					}
					this.splitGroupStop();
				}else{
					alert("Error: no se pudo dividir el grupo");
				}
			}else{
				alert("Error: el nombre del nuevo grupo no puede quedar vacío");
			}
			refreshEverything();
		},
		splitGroupStart: function(){
			console.log("split group start");
			this.currentlySplittingGroup=true;
			this.userRolesNewGroup = {};
		},
		splitGroupStop: function(){
			console.log("split group stop");
			this.currentlySplittingGroup=false;
			this.userRolesNewGroup = {};
		},
		openModalProfileOnClick: function(e){
			e.preventDefault(); 
			var uid = e.target.id.split("_")[1];
			showModalProfile(uid);
			return false;
		},
	},
	template:`
<div id="groupsLeftPanel" :style="style">  
	<div id="groupMembers" v-if="this.group">
		<div>
			<h1>&nbsp;&nbsp; {{ groupName }} </h1>
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
					<a :id="member.linkProfileId" href="" class="viewProfileLink" v-on:click="openModalProfileOnClick" >
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

