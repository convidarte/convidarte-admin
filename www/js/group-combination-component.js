

Vue.component('group-combination-component', {
	data: function(){
			return {
				state: store.state,
			}
	},
	props: ['groupId','userId','role'],
	methods:{
		showModalGroupCombination:function(){
			$("#modalGroupCombination").modal('show');
		},
	},
	computed:{
		style : function(){
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
<div>
	<button	type="button" v-on:click="showModalGroupCombination" :style="style">Combinar dos grupos</button>
	<modal-group-combination></modal-group-combination>
</div>
`,
});


Vue.component('modal-group-combination', {
	data: function(){
			return {
				state: store.state,
				user: null,
			}
	},
	computed:{
		refresh : function(){
			return "";
		},
		refreshOptions: function (){
			var groups = store.state.groups;
			var options = groups.map( g => g["group_id"]+": " + g["name"] );
			autocompleteGroupOptions("groupList1", options);
			autocompleteGroupOptions("groupList2", options);
			return "";
		},

		userId :function(){
			return store.state.currentUserId;
		}
	},
	methods:{
		open: function(){
			$("#modalGroupCombination").modal();
		},
		combineGroups: function(){
			var t1 = $("#groupList1")[0].value;
			var t2 = $("#groupList2")[0].value;
			var gid1 = parseInt( t1.split(":")[0] );
			var gid2 = parseInt( t2.split(":")[0] );
			var newGroupName = $("#combinedGroupName")[0].value;
			if( confirm("¿Realmente desea combinar los grupos "+ t1 + " y " + t2 + "?" )){
				console.log("Combinar grupos:", gid1, gid2, newGroupName);
				combineGroups(gid1,gid2,newGroupName);
				$("#modalGroupCombination").modal('hide');
				refreshEverything();
			}else{
			
			}
		},
		clearText: function(event){
			event.target.value="";
		},
	},
	template:
`
<div>
	{{ refresh }}
	<div
		class="modal fade"
		id="modalGroupCombination"
		tabindex="-1"
		role="dialog"
		aria-labelledby="exampleModalLabel"
		aria-hidden="true">
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
						<h2> Se combinarán los siguientes grupos:</h2>
						<div id="groupToCombine1" class="ui-widget">
							<label for="groupList1"><span style="color:black">Primer grupo:</span></label>
							<input id="groupList1" v-on:click="clearText" style="height:25px;">
						</div>

						<div id="groupToCombine2" class="ui-widget">
							<label for="groupList2"><span style="color:black">Segundo grupo:</span></label>
							<input id="groupList2" v-on:click="clearText" style="height:25px;">
						</div>
						<br>
						<div>
						Nombre del nuevo grupo:						
						<input type="text" id="combinedGroupName"></input>
						</div>
						{{ refreshOptions }}
						<div>
						<br>						<br>
						<button
							type="button"
							class="btn btn-primary float-right"
							@click="combineGroups" >Combinar los grupos
						</button>
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

function autocompleteGroupOptions(id,options){
	$("#" + id ).autocomplete({
		source: options,
		select: function(event,ui){
			selectedOption = ui.item.label
			document.getElementById( id ).value = selectedOption;
		}
	});
}
