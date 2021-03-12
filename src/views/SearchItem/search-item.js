import VNav from '../Nav.vue';
import ToggleDropdown from '@/components/ToggleDropdown';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import DCheckbox from '@/components/DefaultCheckbox';
import CTag from '@/components/Tag';
import DropdownCheckbox from '@/components/DropdownCheckbox';
import LoadingState from '@/components/LoadingState'
export default {
	name: 'SearchResult',
	components: {
		VNav,
		ToggleDropdown,
		DCheckbox,
		CTag,
		DropdownCheckbox,
		LoadingState
	},
	data() {
		return {
			hideSearch: false,
			rows: 1,
			searchType: '',
			filterValue: [],
			itemContent: [],
			loading: false
		};
	},
	watch: {
		hideSearch(value) {
			value ? (this.rows = 30) : (this.rows = 1);
		}
	},
	created() {
		this.searchType = this.getSearchedItem.type;
		this.fetchContent();
	},
	computed: {
		...mapGetters({
			getNotepad: 'search_services/getNotepad',
			getSearchedItem: 'search_services/getSearchedItem',
			getSearchedResult: 'search_services/getSearchedResult',
			getPayload: 'search_services/getPayload'
		}),
		getContentPayload:{
			get(){
				const payload = {}
				payload.company = this.getPayload.company;
				payload.full_name = this.getPayload.full_name;
				payload.role = this.getPayload.role;
				payload.link = this.getSearchedItem.item.url
				return payload
			}
		},
		notepad: {
			get() {
				return this.getNotepad;
			},
			set(value) {
				this.saveNotepad(value);
			}
		},
		research: {
			get() {
				let newObj = {};
				const data = this.getSearchedResult[this.searchType];
				if (this.filterValue.length === 0) {
					for (const key in data) {
						if (Object.hasOwnProperty.call(data, key) && data[key].length !== 0) {
							const element = data[key];
							newObj[key] = element;
						}
					}
				} else {
					this.filterValue.map((value) => {
						const element = Object.keys(data).includes(value) ? data[value] : null;
						newObj[value] = element;
					});
				}
				return newObj;
			}
		}
	},
	methods: {
		...mapMutations({
			saveNotepad: 'search_services/saveNotepad',
			saveSearchedItem: 'search_services/saveSearchedItem',
			
		}),
		...mapActions({
			content: 'search_services/content',
			showAlert: 'showAlert'
		}),
		getYYYYMMDD(dob) {
			const d = new Date(dob);
			return new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0];
		},
		fetchContent(){
			this.loading = true;
			this.content(this.getContentPayload)
				.then(async (response) => {
					if (response.data.status === 'success') {
						this.itemContent = response.data.data.content;
						return true;
					}
					this.showAlert({
						status: 'error',
						message: 'Something went wrong',
						showAlert: true
					});
				})
				.catch((error) => {
					this.showAlert({
						status: 'error',
						message: error.response.data.message,
						showAlert: true
					});
				})
				.finally(() => {
					this.loading = false;
				});
		},
		expandNotepad() {
			this.hideSearch = true;
		},
		logFilter() {
			console.log(this.filterValue);
		},
		async displaySearchItem(type, item) {
			const data = {
				type: type,
				item: item
			};
			await this.saveSearchedItem(data);
			await this.fetchContent();
		},
	}
};
