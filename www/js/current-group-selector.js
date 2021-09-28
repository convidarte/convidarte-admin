Vue.component('current-group-selector', {
	data: function(){
			return {
				state: store.state,
				placeHolderInputText: 'Ver grupo',
			}
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
	:place-holder-input-text="placeHolderInputText">
</autocomplete-group-component>
`
});

