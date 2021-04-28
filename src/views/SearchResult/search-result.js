import VNav from '../Nav.vue';
import ToggleDropdown from '@/components/ToggleDropdown';
import DropdownCheckbox from '@/components/DropdownCheckbox';
import VHeader from '@/components/Header/searchResult/Header';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import DCheckbox from '@/components/DefaultCheckbox';
import ScreenWidthMixin from '@/mixins/screen-width';
import { response } from '@/data/response.json';
import DotLoader from '@/components/DotLoader.vue';
export default {
	name: 'SearchResult',
	components: {
		VNav,
		ToggleDropdown,
		DCheckbox,
		DropdownCheckbox,
		DotLoader,
		VHeader
	},
	mixins: [ScreenWidthMixin],
	data() {
		return {
			companyFilter: [],
			contactFilter: [],
			searchType: 'contact_research',
			response: response,
			researchedPayload: {
				type: Object
			},
			loadMore: false,
			searchedResult: {},
			loading: false,
			userBookmarks: null,
			bookmarkLoading: true,
			editNote: false,
			rowId: null,
			userNote: null,
			notepadTXT: null
		};
	},
	async created() {
		if (this.$route.query.rowId) {
			await this.getResult();
			await this.getFilterKeys();
		} else if (Object.keys(this.getSearchedResult).length > 0) {
			this.searchedResult = this.getSearchedResult;
			await this.getFilterKeys();
			this.researchedPayload = Object.assign({}, this.getPayload);
		} else {
			this.$router.push({ name: 'Search' });
		}
		// console.log(this.$route.query.rowId);
		// this.researchedPayload = Object.assign({}, this.getPayload);
		//this.getNextResearch();
		this.getRowID();
		await this.initUserBookmarks();
		await this.initUserNote(this.rowId);
	},
	computed: {
		...mapGetters({
			getNotepad: 'search_services/getNotepad',
			getSearchedResult: 'search_services/getSearchedResult',
			getPayload: 'search_services/getPayload'
		}),
		socials: {
			get() {
				if (this.searchedResult.socials) {
					return this.searchedResult.socials.filter((x) => {
						return !Object.values(x).every((i) => i === null);
					});
				}
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
		screenType: {
			get() {
				if (this.screenWidth > 796) {
					this.searchType = '';
					return 'large';
				} else {
					return 'small';
				}
			}
		},
		contact_research: {
			get() {
				let newObj = {};
				const data = this.searchedResult.contact_research;
				//const data = this.response.data.contact_research
				// if (this.contactFilter.length === 0) {
				// 	for (const key in data) {
				// 		if (Object.hasOwnProperty.call(data, key) && data[key].length !== 0) {
				// 			const element = data[key];

				// 			newObj[key] = element;
				// 		}
				// 	}
				// } else {

				this.contactFilter.map((value) => {
					const element = Object.keys(data).includes(value) ? data[value] : null;
					newObj[value] = element;
				});
				//}
				return newObj;
			}
		},
		company_research: {
			get() {
				let newObj = {};
				const data = this.searchedResult.company_research;
				//const data = this.response.data.company_research
				this.companyFilter.map((value) => {
					const element = Object.keys(data).includes(value) ? data[value] : null;
					newObj[value] = element;
				});
				return newObj;
			}
		},
		userBookmarksCount() {
			let total = 0;
			if (this.userBookmarks) {
				const { company_research, contact_research } = this.userBookmarks;
				if (company_research && contact_research) {
					total = company_research.length + contact_research.length;
				}
			}
			return total;
		},
		showFirstBookmark() {
			let result = {
				contact_research: '',
				company_research: ''
			};

			if (this.userBookmarks) {
				const { company_research, contact_research } = this.userBookmarks;
				if (company_research && company_research.length) {
					const { type, description } = company_research[0];
					result[type] = { type, description };
				}

				if (contact_research && contact_research.length) {
					const { type, description } = contact_research[0];
					result[type] = { type, description };
				}
			}
			return result;
		}
	},
	methods: {
		...mapMutations({
			saveNotepad: 'search_services/saveNotepad',
			saveSearchedItem: 'search_services/saveSearchedItem',
			saveSearchedResult: 'search_services/saveSearchedResult',
			saveSearchPayload: 'search_services/saveSearchPayload'
		}),
		...mapActions({
			research: 'search_services/research',
			researchedResult: 'search_services/researchedResult',
			showAlert: 'showAlert',
			getUserBookmarks: 'user/getBookmarks',
			getUserNote: 'user/getNote',
			updateUserNote: 'user/updateNote',
			addToBookmarks: 'user/addToBookmarks',
			removeFromBookmarks: 'user/removeFromBookmarks'
		}),
		getRowID() {
			const { rowId } = this.getSearchedResult;
			this.rowId = rowId;
		},
		async initUserBookmarks() {
			try {
				const userBookmarks = await this.getUserBookmarks();
				const { status, data, statusText } = userBookmarks;
				if (status === 200 && statusText === 'OK') {
					this.userBookmarks = data.response;
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.bookmarkLoading = false;
			}
		},
		async initUserNote(rowID) {
			try {
				const userNote = await this.getUserNote(rowID);
				const { status, data, statusText } = userNote;
				if (status === 200 && statusText === 'OK') {
					if (data.data && data.data.length) {
						this.userNote = data.data;
						this.notepadTXT = data.data.note;
					}
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.noteLoading = false;
			}
		},
		async handleTextareaBlur() {
			this.editNote = !this.editNote;
			try {
				await this.updateUserNote({
					rowId: this.rowId,
					note: this.notepadTXT,
					title: ''
				});
				this.userNote = this.notepadTXT;
				this.showAlert({
					status: 'success',
					message: 'Note updated successfully',
					showAlert: true
				});
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: 'error updating note',
					showAlert: true
				});
			}
		},
		btnBookmarkClick() {
			this.$router.push('/bookmarks');
		},
		async getResult() {
			this.loading = true;
			try {
				const response = await this.researchedResult(this.$route.query.rowId);
				this.searchedResult = response.data.data;
				await this.saveSearchedResult(response.data.data);
				return true;
			} catch (error) {
				console.log(error);
			} finally {
				this.loading = false;
			}
		},
		getNextResearch() {
			window.onscroll = async () => {
				if (this.researchedPayload.pagination !== 2) {
					let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
					if (bottomOfWindow) {
						this.loadMore = true;
						this.researchedPayload.pagination = 2;
						try {
							const response = await this.research(this.researchedPayload);
							if (response.data.status === 'success') {
								let data = response.data.data;
								const contact_research = [
									...this.getSearchedResult.contact_research.others,
									...response.data.data.contact_research.others
								];
								const company_research = [
									...this.getSearchedResult.company_research.others,
									...response.data.data.company_research.others
								];
								data.contact_research['others'] = contact_research;
								data.company_research['others'] = company_research;
								await this.saveSearchedResult(data);
								await this.saveSearchPayload(this.researchedPayload);
								return true;
							}
							this.showAlert({
								status: 'error',
								message: 'Something went wrong',
								showAlert: true
							});
						} catch (error) {
							this.showAlert({
								status: 'error',
								message: error.response.data.message,
								showAlert: true
							});
						} finally {
							this.loadMore = false;
						}
					}
				}
			};
		},
		sortByRelevance(researchType) {
			if (researchType === 'contact_research') {
				for (const key in this.contact_research) {
					const element = this.contact_research[key];
					return element.sort((a, b) => (a.meta.relevanceScore < b.meta.relevanceScore ? 1 : -1));
				}
			}
			if (researchType === 'company_research') {
				for (const key in this.company_research) {
					const element = this.company_research[key];
					return element.sort((a, b) => (a.meta.relevanceScore < b.meta.relevanceScore ? 1 : -1));
				}
			}
		},
		sortByRecent(researchType) {
			if (researchType === 'contact_research') {
				for (const key in this.contact_research) {
					const element = this.contact_research[key];
					return element.sort((a, b) => {
						return (
							new Date(b.meta.published != null) - new Date(a.meta.published != null) ||
							new Date(b.meta.published) - new Date(a.meta.published)
						);
					});
				}
			}
			if (researchType === 'company_research') {
				for (const key in this.company_research) {
					const element = this.company_research[key];
					return element.sort((a, b) => {
						return (
							new Date(b.meta.published != null) - new Date(a.meta.published != null) ||
							new Date(b.meta.published) - new Date(a.meta.published)
						);
					});
				}
			}
		},
		displaySearchItem(type, item) {
			const data = {
				type: type,
				item: item
			};
			this.saveSearchedItem(data);
			this.$router.push({ name: 'SearchItem' });
		},
		getFilterKeys() {
			this.contactFilter = [];
			this.companyFilter = [];
			for (const key in this.searchedResult.contact_research) {
				//for (const key in this.response.data.contact_research) {
				this.contactFilter.push(key);
			}
			for (const key in this.searchedResult.company_research) {
				//for (const key in this.response.data.company_research) {
				this.companyFilter.push(key);
			}
		},
		validateURL(link) {
			if (link.indexOf('https://') === 0) {
				console.log('The link has http or https.');
				return link;
			} else {
				return `https://${link}`;
			}
		},
		async btnAddToBookMarks(dataItem) {
			await this.addToBookmarks({
				rowId: this.rowId,
				url: dataItem.url,
				type: dataItem.type,
				description: dataItem.description,
				relevance_score: dataItem.meta.relevanceScore,
				title: dataItem.title
			});
			const searchResultClone = { ...this.getSearchedResult };
			searchResultClone[dataItem.type].others[dataItem.index].is_bookmarked = true;
			await this.saveSearchedResult(searchResultClone);
			this.showAlert({
				status: 'success',
				message: 'Added to bookmarks',
				showAlert: true
			});
		},
		async btnRemoveFromBookMarks(dataItem) {
			await this.removeFromBookmarks({
				url: dataItem.url
			});
			const searchResultClone = { ...this.getSearchedResult };
			searchResultClone[dataItem.type].others[dataItem.index].is_bookmarked = false;
			await this.saveSearchedResult(searchResultClone);
			this.showAlert({
				status: 'success',
				message: 'Removed from bookmarks',
				showAlert: true
			});
		}
	}
};
