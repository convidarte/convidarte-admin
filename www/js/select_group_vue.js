Vue.component('select-group-component', {
	data: function(){
			return {
				state: store.state,
			}
	},
	computed: {
		refreshOptions: function (){
			var groups = store.state.groups;
			var options = groups.map( g => g["group_id"]+": " + g["name"] );
			$("#groupList").autocomplete({
				source: options,
				select: function(event,ui){
							selectedOption = ui.item.label
							document.getElementById("groupList").value = selectedOption;
							num = parseFloat(selectedOption.split(":")[0]);
							if (num.toString()!="NaN"){
								store.setCurrentGroupId(num);
								showGroupById(num);
							}
						}
			});
			return "";
		},
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
	methods: {
		clearText: function(event){
			event.target.value="";
		},
	},
	template: `
	  <div id="selectGroupContainer" class="ui-widget" :style="style">
		<label for="groupList"><span style="color:black">Ver grupo:</span></label>
		<input id="groupList" v-on:click="clearText">
		{{ refreshOptions }}
	  </div>
`
})


