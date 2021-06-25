import { ValidationObserver } from 'vee-validate';
import { mapActions, mapGetters } from 'vuex';
import CButton from '@/components/Button';
import TextInput from '@/components/Input';
import VTable from '@/components/Table';
import VHeader from '@/components/Header/search/Header';
import ToggleDropdown from '@/components/ToggleDropdown';
import Modal from '@/components/Modal';
import Loader from '@/components/Loader';
import Status from '@/components/Status';
import Toggle from '@/components/Toggle';
import InputTag from '@/components/InputTag';
import StatusTag from '@/components/StatusTag';
import VButton from '@/components/Button';
import debounce from 'lodash.debounce';

export default {
	name: 'Dashboard',
	data() {
		return {
			form: {
				email: '',
				role: ''
			},
			info: {
				name: '',
				email: '',
				role: ''
			},
			emailInput: '',
			loading: false,
			sendInvites: false,
			deactivateModal: false,
			activateModal: false,
			suspendModal: false,
			checkedContacts: [],
			tableHeaders: [
				{
					name: '',
					elementSlot: true
				},
				{
					name: 'Name',
					sortHeader: 'full_name'
				},
				{
					name: 'Email Address'
				},
				{
					name: 'Admin Role'
				},
				{
					name: 'Status',
					sortHeader: ''
				},
				{
					name: 'Date Added'
				},
				{
					name: ' '
				}
			],
			history: [
				{
					name: 'Kingsley Omin',
					email: 'Abass@apple.com',
					adminRole: 'Super Admin',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 1,
					status: {
						statusCode: 'ACTIVE',
						message: 'Active'
					}
				},
				{
					name: 'Kingsley Omin',
					email: 'Abass@apple.com',
					adminRole: 'Admin User',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 2,
					status: {
						statusCode: 'INACTIVE',
						message: 'Inactive'
					}
				},
				{
					name: 'Kingsley Omin',
					email: 'Abass@apple.com',
					adminRole: 'Admin User',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 3,
					status: {
						statusCode: 'ACTIVE',
						message: 'active'
					}
				},
				{
					name: 'Kingsley Omin',
					email: 'Abass@apple.com',
					adminRole: 'Admin User',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 4,
					status: {
						statusCode: 'ACTIVE',
						message: 'active'
					}
				},
				{
					name: 'Kingsley Omin',
					email: 'Abass@apple.com',
					adminRole: 'Admin User',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 5,
					status: {
						statusCode: 'ACTIVE',
						message: 'active'
					}
				},
				{
					name: 'Kingsley Omin',
					email: 'Abass@apple.com',
					adminRole: 'Admin User',
					date: 'May 09, 2021',
					time: '12:38 PM',
					rowId: 6,
					status: {
						statusCode: 'ACTIVE',
						message: 'Active'
					}
				}
			],
			emailList: [],
			showEditModal: false,
			toggleClass: true,
			adminLoading: false,
			currentPage: 1,
			totalPages: 5,
			limit: 50,
			page: 1,
			total: 0,
			count: 0,
			nextPage: null,
			admins: [],
			adminInfo: {},
			currentAdmin: {},
			adminId: null,
			searchQuery: null,
			roles: ['User', 'Admin', 'Super Admin']
		};
	},
	props: {
		modalName: String
	},
	components: {
		ValidationObserver,
		CButton,
		TextInput,
		VTable,
		VHeader,
		ToggleDropdown,
		Modal,
		Status,
		Toggle,
		InputTag,
		Loader,
		StatusTag,
		VButton
	},
	mounted() {
		this.getAdmins();
	},
	computed: {
		...mapGetters({
			loggedInUser: 'auth/getLoggedUser'
		})
	},
	methods: {
		...mapActions({
			adminInvite: 'admin_management/adminInvite',
			allAdmins: 'admin_management/allAdmins',
			deactivateAdmin: 'admin_management/deactivateAdmin',
			activateAdmin: 'admin_management/activateAdmin',
			suspendAdmin: 'admin_management/suspendAdmin',
			updateAdmin: 'admin_management/updateAdmin',
			adminSearch: 'admin_management/adminSearch',
			showAlert: 'showAlert'
		}),
		async getAdmins() {
			this.adminLoading = true;
			try {
				const response = await this.allAdmins({ page: this.page, limit: this.limit });
				const { status, data, statusText } = response;
				if (status === 200 && statusText === 'OK') {
					this.admins = data.data.data;
					console.log(this.admins);
					this.count = data.data.count;
					this.currentPage = data.data.currentPage;
					this.total = Math.ceil(data.data.count / this.limit);
					this.nextPage = data.data.nextPage;
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.adminLoading = false;
			}
		},
		async inviteAdmin() {
			this.loading = true;
			if (this.emailInput !== '') {
				this.emailList.push(this.emailInput);
				this.emailInput = '';
			}
			try {
				const response = await this.adminInvite({ email: this.emailList });
				if (response.status === 200) {
					this.showAlert({
						status: 'success',
						message: 'Invite sent Successfully',
						showAlert: true
					});
					this.emailList = [];
					this.toggleSendInvites();
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
		},
		toggleEditModal() {
			if (!this.showEditModal) {
				this.showEditModal = true;
			} else {
				this.toggleClass = !this.toggleClass;
				setTimeout(() => {
					this.showEditModal = !this.showEditModal;
					this.toggleClass = !this.toggleClass;
				}, 500);
			}
		},
		openEditModal(item) {
			this.adminInfo = item;
			this.toggleEditModal();
		},
		toggleSendInvites() {
			if (!this.sendInvites) {
				this.sendInvites = true;
			} else {
				this.toggleClass = !this.toggleClass;
				setTimeout(() => {
					this.sendInvites = !this.sendInvites;
					this.toggleClass = !this.toggleClass;
				}, 500);
			}
		},
		toggleDeactivateModal() {
			if (!this.deactivateModal) {
				this.deactivateModal = true;
			} else {
				this.toggleClass = !this.toggleClass;
				setTimeout(() => {
					this.deactivateModal = !this.deactivateModal;
					this.toggleClass = !this.toggleClass;
				}, 500);
			}
		},
		toggleActivateModal() {
			if (!this.activateModal) {
				this.activateModal = true;
			} else {
				this.toggleClass = !this.toggleClass;
				setTimeout(() => {
					this.activateModal = !this.activateModal;
					this.toggleClass = !this.toggleClass;
				}, 500);
			}
		},
		toggleSuspendModal() {
			if (!this.suspendModal) {
				this.suspendModal = true;
			} else {
				this.toggleClass = !this.toggleClass;
				setTimeout(() => {
					this.suspendModal = !this.suspendModal;
					this.toggleClass = !this.toggleClass;
				}, 500);
			}
		},
		addEmail(e) {
			if (e.target.validity.valid) {
				this.emailList.push(this.emailInput);
				this.emailInput = '';
			}
		},
		deleteEmail(index) {
			const list = this.emailList;
			list.splice(index, 1);
		},
		checkAll(event) {
			if (event.target.checked) {
				this.history.forEach((item) => {
					if (item.status.statusCode === 'ACTIVE' || item.status.statusCode === 'INACTIVE') {
						this.checkedContacts.push(item.rowId);
						return item.rowId;
					}
					return item.rowId;
				});
			} else {
				this.checkedContacts = [];
			}
		},
		clickCallback(page) {
			this.currentPage = page;
		},
		openDeactivateModal(item) {
			const { _id, last_name, first_name } = item;
			this.adminToModify = { ...this.adminToModify, _id, last_name, first_name };
			this.deactivateModal = true;
		},
		async deactivate() {
			this.loading = true;
			try {
				const changeStatus = await this.deactivateAdmin(this.adminToModify._id);
				const { status, statusText } = changeStatus;
				if (status === 200 && statusText === 'OK') {
					this.toggleDeactivateModal();
					await this.getAdmins();
					this.adminToModify = {};
					this.showAlert({
						status: 'success',
						message: changeStatus.data.message,
						showAlert: true
					});
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
		},
		openActivateModal(item) {
			const { _id, last_name, first_name } = item;
			this.adminToModify = { ...this.adminToModify, _id, last_name, first_name };
			this.activateModal = true;
		},
		async activate() {
			this.loading = true;
			try {
				const changeStatus = await this.activateAdmin(this.adminToModify._id);
				const { status, statusText } = changeStatus;
				if (status === 200 && statusText === 'OK') {
					this.toggleActivateModal();
					await this.getAdmins();
					this.adminToModify = {};
					this.showAlert({
						status: 'success',
						message: changeStatus.data.message,
						showAlert: true
					});
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
		},
		openSuspendModal(item) {
			const { _id, last_name, first_name } = item;
			this.adminToModify = { ...this.adminToModify, _id, last_name, first_name };
			this.suspendModal = true;
		},
		async suspend() {
			this.loading = true;
			try {
				const changeStatus = await this.suspendAdmin(this.adminToModify._id);
				const { status, statusText } = changeStatus;
				if (status === 200 && statusText === 'OK') {
					this.toggleSuspendModal();
					await this.getAdmins();
					this.adminToModify = {};
					this.showAlert({
						status: 'success',
						message: changeStatus.data.message,
						showAlert: true
					});
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
		},
		async editAdmin() {
			this.loading = true;
			const { first_name, last_name, role, monthly_research, organisation, profession } = this.adminInfo;
			try {
				const response = await this.updateAdmin({
					id: this.adminInfo._id,
					admin: { first_name, last_name, role, monthly_research, organisation, profession }
				});
				const { status, statusText } = response;
				if (status === 200 && statusText === 'OK') {
					await this.getAdmins();
					this.toggleEditModal();
					this.showAlert({
						status: 'success',
						message: 'user successfully updated',
						showAlert: true
					});
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
		},
		async searchPage() {
			this.adminLoading = true;
			try {
				const response = await this.adminSearch(this.searchQuery);
				if (response.data.response.data.length) {
					this.admins = response.data.response.data;
				} else {
					this.showAlert({
						status: 'error',
						message: 'No admin found',
						showAlert: true
					});
				}
			} catch (error) {
				console.log(error);
			} finally {
				this.adminLoading = false;
			}
		}
	},
	watch: {
		searchQuery: debounce(function(newVal) {
			if (newVal) {
				this.searchPage({ q: newVal });
			}
		}, 600)
	}
};
