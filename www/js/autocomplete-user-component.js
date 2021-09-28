Vue.component('autocomplete-user-component', {
	data: function(){
			return {
				state: store.state,
				autoCompleteResult: [],
				autoCompleteProgress: false,
				autoCompleteText: "text",
				autoCompleteFieldId: "user_id",
		        placeHolderInputText: "Buscar usuario",
			}
	},
	computed: {
		containerStyle: function(){
			if(this.state.token=="") return "display:none;"
			return "";
		}
	},
	methods:{
		onKeyUpAutoCompleteEvent(keywordEntered){
			this.autoCompleteResult = [];
			this.autoCompleteProgress = false;
			if(keywordEntered.length > 2){
				this.autoCompleteProgress = true;
				do_request("/search/users/"+keywordEntered, null, true, "GET")
				.then(results => {
					var newData = [];
					results.forEach(function(item, index){
						var x = {
							user_id:item["user_id"],
							text: tidySpaces(item["text"])
						};
						newData.push(x);

					});
					this.autoCompleteResult = newData;
					this.autoCompleteProgress = false;
				})
				.catch(e => {
					this.autoCompleteProgress = false;
					this.autoCompleteResult = [];
				});
			}else{
				this.autoCompleteProgress = false;
				this.autoCompleteResult = [];
			}
		},
		onSelectedAutoCompleteEvent(id,text){
			this.autoCompleteProgress = false;
			this.autoCompleteResult = [];
			if (id.toString()!="NaN"){
				setKey("currentUserId",id);
				showModalProfile(id);
			}
		},
	},
	template: `
<div class="ui-widget" :style="containerStyle">
	<autocomplete 
		:place-holder-text="placeHolderInputText"
		:result-items="autoCompleteResult"
		:on-key-up="onKeyUpAutoCompleteEvent"
		:on-selected="onSelectedAutoCompleteEvent"
		:auto-complete-progress="autoCompleteProgress"
		:item-text="autoCompleteText"
		:item-id="autoCompleteFieldId">
	</autocomplete>
</div>`
});

