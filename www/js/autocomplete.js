var autoCompleteComponent = Vue.component('autocomplete', {
    props: {
        placeHolderText: String,
        onKeyUp: Function,
        onSelected: Function,
        resultItems: Array,
        autoCompleteProgress: Boolean,
        itemText: String,
        itemId: String
    },

    data() {
        return {
            keywordSearch: '',
        }
    },
	methods:{
		onBlur: function(){
			var self = this;
			setTimeout(function() {
				self.autoCompleteProgress=false;
				self.resultItems=[];    
			}, 100);
		},
		onMouseDown: function(event) {
			event.preventDefault();
		},
	},
    template: `
		<div class="autocomplete" >
			<input type="text" :placeholder="placeHolderText" v-model="keywordSearch" class="form-textinput" :class="{ 'loading-circle' : (keywordSearch.length > 2), 'hide-loading-circle': resultItems.length > 0 || resultItems.length == 0 && !autoCompleteProgress  }" @keyup="!autoCompleteProgress ? onKeyUp(keywordSearch) : ''" @blur="onBlur" />
			<ul class="autocomplete-results" v-if="resultItems.length > 0">
				<li class="autocomplete-result" v-for="(item,i) in resultItems" :key="i" @click="keywordSearch='';onSelected(item[itemId], item[itemText])" @mousedown="onMouseDown" >
					{{ item[itemText] }}
				</li>
			</ul>
		</div>
	`
});

