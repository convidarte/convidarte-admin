Vue.component('autocomplete-group-component', {
	data: function(){
			return {
				autoCompleteResult: [],
				autoCompleteProgress: false,
				autoCompleteText: "name",
				autoCompleteFieldId: "group_id"
			}
	},
    props: {
        placeHolderInputText: String,
        onSelectedAutoCompleteEvent: Function,
        containerStyle: String,
	},
	methods: {
		onKeyUpAutoCompleteEvent(keywordEntered){
			this.autoCompleteResult = [];
			this.autoCompleteProgress = false;
			if(keywordEntered.length > 2){
				this.autoCompleteProgress = true;
				do_request("/admin/groups", null, true, "GET")
				.then(response => {
					var groups = response["groups"];
					var newData = [];
					groups.forEach(function(item, index){
						if(item.name.toLowerCase().indexOf(keywordEntered.toLowerCase()) >= 0){
							newData.push(item);
						}
					});
					this.autoCompleteResult = newData;
					this.autoCompleteProgress = false;
				})
				.catch(e => {
					this.autoCompleteProgress = false;
					this.autoCompleteResult = [];
				})
			}else{
				this.autoCompleteProgress = false;
				this.autoCompleteResult = [];
			}
		},
		onSelectedAutoCompleteEventInternal(id,text){
			this.autoCompleteProgress = false;
			this.autoCompleteResult = [];
			this.onSelectedAutoCompleteEvent(id,text);
		},
	},
	template: `
<div class="ui-widget" :style="containerStyle">
	<autocomplete 
		:place-holder-text="placeHolderInputText"
		:result-items="autoCompleteResult"
		:on-key-up="onKeyUpAutoCompleteEvent"
		:on-selected="onSelectedAutoCompleteEventInternal"
		:auto-complete-progress="autoCompleteProgress"
		:item-text="autoCompleteText"
		:item-id="autoCompleteFieldId">
	</autocomplete>
</div>
`
});


