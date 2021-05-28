Vue.component('groups-component-delegate', {
	data: function(){
			return {
				state: store.state,
				group: null,
			}
	},
	computed:{
		refresh: function(){
			console.log("(",this.state.refreshTime,") showing group #", this.state.currentGroupId);
			var gid= store.state.currentGroupId;
			if(gid!=0){
				this.group = getGroup(gid);
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
				var ack = u.roles_in_group[0].ack_delegate;// el ack del primer rol que tenga el usuario en el grupo
				member.style = ack ? "" : "background-color:lightgreen;";
				member.nameToShow = nameToShow(u);
				member.email = u.email;
				member.cellphone = u.cellphone;
				member.showAckButton = store.state.currentSystem=="delegate" && (!ack);
				member.rolesInGroup = [];
				for (var j =0;  j< u.roles_in_group.length; j++){
					var roleInGroup = {};
					var role = u.roles_in_group[j].role;
					roleInGroup.role = role;
					roleInGroup.roleInSpanish=roleInSpanish(role);
					member.rolesInGroup.push(roleInGroup);
				}
				member.roleAck = member.rolesInGroup[0].role;
				memberArray.push(member);
			}
			return memberArray;
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

		style: function(){
			if(this.state.currentTab=="users"){
				return "display: none;";
			}
			if(this.state.currentTab=="groups"){
				return "";
			}
			return "display:none;";
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
						<h4>Delegados: 
							<link-user-profile v-for="delegate in delegates"
								:userId="delegate.user_id"
								:userName="delegate.user_name"
							></link-user-profile>
						</h4>
						<p v-if="delegates.length==0">El grupo no tiene delegados.</p>
					</li>
					<li><h4>{{numberCooks}} chefs - {{numberDrivers}} distribuidores</h4></li>
					<li><h4>{{ackPendingStat}} miembros para contactar</h4></li>
				</ul>
			</div>
			<group-detail-printable :group="this.group"></group-detail-printable>
			<group-csv-link :group="this.group"></group-csv-link >
		</div>

			<table id="groupDetailTable" class="table table-striped" style="table-layout: fixed; width: 100%;">
				<colgroup>
				<col style="width: 6%;">
				<col style="width: 24%;">
					<col style="width: 20%;">
					<col style="width: 35%;">
					<col style="width: 15%;">
			</colgroup>
			<tr><th>Id</th> <th>Nombre</th><th>Dirección</th><th>Contacto</th><th>Rol(es)</th> </tr>
			<tr v-for="member in members" :style="member.style" >
				<td>{{ member.userId }}</td>
				<td>
					<link-user-profile
						:userId="member.userId"
						:userName="member.nameToShow"
					></link-user-profile>
					<button-ack-delegate
						v-if="member.showAckButton"
						v-bind:groupId="groupId"
						v-bind:userId="member.userId"
						v-bind:role="member.roleAck"
					></button-ack-delegate>
				</td>
				<td><a :href="member.urlMaps" target="_blank"> {{ member.addressToShow }} </a></td>
				<td style="word-wrap: break-word;width:5%;">
					{{member.email}}<br>
					{{member.cellphone}}
				</td>
				<td>
					<p v-for="roleInGroup in member.rolesInGroup">
						{{ roleInGroup.roleInSpanish }}<br>
						<button-delete-role
							:groupId="groupId"
							:userId="member.userId"
							:role="roleInGroup.role"
						></button-delete-role><br>
						<button-delete-inactivate-role
							:groupId="groupId"
							:userId="member.userId"
							:role="roleInGroup.role"
						></button-delete-inactivate-role>
					</p>			
				</td>
			</tr>
		</table>
	</div>
	{{ refresh }}
</div>
` 
});

