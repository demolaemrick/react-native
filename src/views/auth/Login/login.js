import { ValidationObserver } from 'vee-validate';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import TextInput from '@/components/Input/TextInput';
import CButton from '@/components/Button';
import PasswordInput from '@/components/Input/PasswordInput';
import Loader from '@/components/Loader';
import Logo from '@/components/Logo';
export default {
	name: 'Login',
	data() {
		return {
			form: {
				email: null,
				password: null
			},
			loading: false
		};
	},
	methods: {
		...mapMutations({
			saveUserSession: 'auth/loginSuccess',
			setLastSearchResult: 'auth/setLastSearchResult'
		}),
		...mapActions({
			login: 'auth/login',
			research_history: 'search_services/research_history',
			showAlert: 'showAlert'
		}),
		async getHistory() {
			try {
				const response = await this.research_history({ page: 1, limit: 1 });
				const historyLength = response.data.data.history.length
				this.$router.push({ [this.lastSearch ? 'path': 'name']: this.lastSearch ?? (historyLength ? 'ContactResearch': 'Search') });
				return true;
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			}
		},
		async submit() {
			this.loading = true;
			try {
				const response = await this.login(this.form);
				const { status, data, statusText } = response;
				if (status === 200 && statusText === 'OK') {
					await this.saveUserSession(data.data);
					if (data.data.role === 'admin' || data.data.role === 'superadmin') {
						this.$router.push({ path: this.lastSearch ?? '/dashboard/users' }).then(() => {
							this.lastSearch && this.setLastSearchResult(null)
						});
					} else {
						await this.getHistory();
					}
				}
				return true;
			} catch (error) {
				const err = { error };
				this.showAlert({
					status: 'error',
					message: err.error.response.data.message,
					showAlert: true
				});
			} finally {
				this.loading = false;
			}
		}
	},
	computed: {
		...mapGetters({
			lastSearch: 'auth/getLastSearchResult'
		})
	},
	components: {
		ValidationObserver,
		TextInput,
		CButton,
		PasswordInput,
		Loader,
		Logo
	}
};
