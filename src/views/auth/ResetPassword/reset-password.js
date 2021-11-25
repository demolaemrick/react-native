import { ValidationObserver } from 'vee-validate';
import { mapActions } from 'vuex';
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
				token: null,
				password: null
			},
			expiresAt: null,
			isExpired: false,
			loading: false
		};
	},
	created() {
		const token = this.$route.query.token;
		if (token) {
			const decode = Buffer.from(token, 'base64').toString('utf-8');
			const decoded = JSON.parse(decode);
			const date = new Date(decoded.expiresAt);
			this.expiresAt = date.getTime();
			this.form.token = decoded.token || token;
		}
	},
	mounted() {
		const date = new Date();
		if (this.expiresAt && date.getTime() > this.expiresAt) {
			this.isExpired = true;
		}
	},
	methods: {
		...mapActions({
			resetPassword: 'auth/resetPassword',
			showAlert: 'showAlert'
		}),
		async changePassword() {
			this.loading = true;
			try {
				const response = await this.resetPassword(this.form);
				if (response.status === 200) {
					this.showAlert({
						status: 'success',
						message: 'Successfully reset password',
						showAlert: true
					});
					this.$router.push({ name: 'Login' });
					return true;
				}
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			} finally {
				this.loading = false;
			}
		}
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
