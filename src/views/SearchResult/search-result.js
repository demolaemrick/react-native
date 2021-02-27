import VNav from '../Nav.vue';
import ToggleDropdown from '@/components/ToggleDropdown';
import { mapMutations, mapGetters } from 'vuex';
export default {
	name: 'SearchResult',
	components: {
		VNav,
		ToggleDropdown
	},
	computed: {
		...mapGetters({
			getNotepad: 'search_services/getNotepad'
		}),
		notepad: {
			get() {
				return this.getNotepad;
			},
			set(value) {
				this.saveNotepad(value);
			}
		}
	},
	methods: {
		...mapMutations({
			saveNotepad: 'search_services/saveNotepad'
		})
	}
};
