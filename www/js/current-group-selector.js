Vue.component('current-group-selector', {
	data: function(){
			return {
				state: store.state,
				placeHolderInputText: 'Ver grupo',
			}
	},
	computed: {
		containerStyle : function(){
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
		onSelectedAutoCompleteEvent(id, text){
			if (id.toString()!="NaN"){
				setKey("currentGroupId",id);
				showGroupById(id);
			}
		},
	},
	template:`
<autocomplete-group-component
	:on-selected-auto-complete-event="onSelectedAutoCompleteEvent"
	:place-holder-input-text="placeHolderInputText"
	:containerStyle="containerStyle">
</autocomplete-group-component>
`
});

