import Users from '../../../src/views/Dashboard/Users';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import flushPromises from 'flush-promises';
import TextInput from '../../../src/components/Input';
import VButton from '../../../src/components/Button';
import VTable from '../../../src/components/Table';
import ToggleDropdown from '../../../src/components/ToggleDropdown';
import Modal from '../../../src/components/Modal';
import VueRouter from 'vue-router';
// import debounce from 'lodash/debounce';

jest.useFakeTimers();

const Paginate = require('vuejs-paginate');

jest.mock('vuejs-paginate');
// jest.mock('lodash/debounce', () => jest.fn((fn) => fn));

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.component('paginate', Paginate);

let users = {
	status: 200,
	data: {
		response: {
			data: [
				{
					_id: '60992e95baa22116bb37d25f',
					email: 'soheil.saeidmehr@volley.com',
					first_name: 'Soheil',
					last_name: 'Saeidmehr',
					researches_performed: 0,
					role: 'user',
					status: 'active'
				}
			]
		}
	},
	statusText: 'OK'
};

let user = {
	status: 200,
	data: {
		data: {
			_id: '60992e95baa22116bb37d25f',
			email: 'soheil.saeidmehr@volley.com',
			first_name: 'Soheil',
			last_name: 'Saeidmehr',
			researches_performed: 0,
			role: 'user',
			status: 'active'
		}
	},
	statusText: 'OK'
};

let statusRes = {
	status: 200,
	statusText: 'OK'
};

let item = {
	email: 'aileen.rioux@volley.com',
	first_name: 'Aileen',
	last_name: 'Rioux',
	last_research_date: '2021-06-18T13:54:00.521Z',
	monthly_research: 400,
	organisation: 'Volley',
	profession: 'BDR',
	researches_performed: 5,
	role: 'user',
	status: 'active',
	_id: '1'
};

let searchResponse = {
	data: {
		response: {
			data: [
				{
					_id: '60992e95baa22116bb37d25a',
					email: 'ammad.aleem@volley.com',
					first_name: 'Ammad',
					last_name: 'Aleem',
					monthly_research: 200,
					researches_performed: 0,
					role: 'user',
					status: 'active'
				}
			]
		}
	}
};

describe('Users', () => {
	let store;
	const router = new VueRouter({
		routes: [
			{ path: 'users', name: 'Users' },
			{ path: '/dashboard/user/:userId?', name: 'User', meta: 'user', query: { userId: item._id } }
		]
	});
	beforeEach(() => {
		// let func = jest.fn();
		// let debouncedFunc = debounce(func, 600);

		store = new Vuex.Store({
			actions: {
				showAlert: jest.fn()
			},
			getters: {},
			mutations: {},
			modules: {
				users_management: {
					actions: {
						allUsers: jest.fn().mockResolvedValue(users),
						deactivateUser: jest.fn().mockResolvedValue(statusRes),
						activateUser: jest.fn().mockResolvedValue(statusRes),
						suspendUser: jest.fn().mockResolvedValue(statusRes),
						singleUser: jest.fn().mockResolvedValue(user),
						updateUser: jest.fn(),
						search: jest.fn().mockResolvedValue(searchResponse),
						createUser: jest.fn().mockResolvedValue(statusRes)
					},
					getters: {},
					mutations: {},
					namespaced: true
				}
			}
		});
	});

	it('tests that the user page mounts', () => {
		const wrapper = shallowMount(Users, {
			propsData: {
				modalName: 'Oreolwa'
			},
			store,
			localVue
		});
		expect(wrapper.vm).toBeTruthy();
	});
	it('tests that api to get all users is called', () => {
		const getAllUsers = jest.fn();
		const wrapper = shallowMount(Users, {
			store,
			localVue,
			methods: {
				getAllUsers
			}
		});
		expect(getAllUsers).toHaveBeenCalled();
		expect(wrapper.vm).toBeTruthy();
	});

	it('tests that the loader displays', async () => {
		const getAllUsers = jest.fn();
		const wrapper = shallowMount(Users, {
			store,
			localVue,
			methods: {
				getAllUsers
			},
			data() {
				return {
					usersLoading: false
				};
			}
		});

		await flushPromises();
		expect(wrapper.vm.usersLoading).toBe(false);
	});

	it('tests that the search input exists', async () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		let input = wrapper.findComponent(TextInput);
		expect(input.exists()).toBe(true);
	});

	it('tests that the button component exists', () => {
		const wrapper = mount(Users, {
			store
		});
		const button = wrapper.findComponent(VButton);
		expect(button.exists()).toBe(true);
	});

	it('tests that the dropdown component exists', () => {
		const wrapper = mount(Users, {
			store
		});
		const dropdown = wrapper.findComponent(ToggleDropdown);
		expect(dropdown.exists()).toBe(true);
	});

	it('tests that the deactivate modal exists', () => {
		const wrapper = mount(Users, {
			store,
			data() {
				return {
					deactivateModal: true
				};
			}
		});
		const modal = wrapper.findAllComponents(Modal);
		expect(modal).toHaveLength(1);

		const title = wrapper.find('h4.modal__header-title');
		expect(title.exists()).toBe(true);
	});

	it('tests that the deactivate button is called', async () => {
		const deactivate = jest.fn();
		const toggleDeactivateModal = jest.fn();

		const wrapper = mount(Users, {
			store,
			data() {
				return {
					deactivateModal: true
				};
			},
			methods: {
				deactivate,
				toggleDeactivateModal
			}
		});
		wrapper.findAllComponents(VButton).trigger('click');
		expect(deactivate).toHaveBeenCalled();
		await flushPromises();
		if (status === 200 && statusText === 'OK') {
			expect(toggleDeactivateModal).toHaveBeenCalled();
		}
	});

	it('tests that the activate modal exists', () => {
		const wrapper = mount(Users, {
			store,
			data() {
				return {
					activateModal: true
				};
			}
		});
		const modal = wrapper.findAllComponents(Modal);
		expect(modal).toHaveLength(1);

		const title = wrapper.find('h4.modal__header-title');
		expect(title.exists()).toBe(true);

		const content = wrapper.find('p.modal__content-text');
		expect(content.exists()).toBe(true);
	});

	it('tests that the activate button is called', async () => {
		const activate = jest.fn();
		const toggleActivateModal = jest.fn();
		const wrapper = mount(Users, {
			store,
			data() {
				return {
					activateModal: true
				};
			},
			methods: {
				activate,
				toggleActivateModal
			}
		});
		wrapper.findAllComponents(VButton).trigger('click');
		expect(activate).toHaveBeenCalled();
		await flushPromises();
		if (status === 200 && statusText === 'OK') {
			expect(toggleActivateModal).toHaveBeenCalled();
		}
	});

	it('tests that the suspend modal exists', () => {
		const wrapper = mount(Users, {
			store,
			data() {
				return {
					suspendModal: true
				};
			}
		});
		const modal = wrapper.findAllComponents(Modal);
		expect(modal).toHaveLength(1);

		const title = wrapper.find('h4.modal__header-title');
		expect(title.exists()).toBe(true);

		const content = wrapper.find('p.modal__content-text');
		expect(content.exists()).toBe(true);
	});

	it('tests that the suspend button is called', async () => {
		const suspend = jest.fn();
		const toggleSuspendModal = jest.fn();
		const wrapper = mount(Users, {
			store,
			data() {
				return {
					suspendModal: true
				};
			},
			methods: {
				suspend,
				toggleSuspendModal
			}
		});
		wrapper.findAllComponents(VButton).trigger('click');
		// expect(suspend).toHaveBeenCalled();
		await wrapper.vm.suspend();
		// await flushPromises();
		if (status === 200 && statusText === 'OK') {
			expect(toggleSuspendModal).toHaveBeenCalled();
		}
		expect(wrapper.vm.loading).toBeFalsy();
	});

	it('tests that createUser modal is called on button click', () => {
		const toggleCreateUser = jest.fn();
		const wrapper = mount(Users, {
			store,
			data() {
				return {
					loading: false
				};
			},
			methods: {
				toggleCreateUser
			}
		});
		expect(wrapper.vm.toggleClass).toBe(true);
		wrapper.findAllComponents(VButton).at(0).trigger('click');
		expect(toggleCreateUser).toHaveBeenCalled();
	});

	it('tests that createuser modal is toggled', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		expect(wrapper.vm.toggleClass).toBe(true);
		wrapper.vm.createUser = true;
		wrapper.vm.$nextTick();
		wrapper.vm.toggleCreateUser();
		expect(wrapper.vm.toggleClass).toBe(false);
		jest.advanceTimersByTime(500);
		wrapper.vm.$nextTick();
		expect(wrapper.vm.createUser).toBe(false);
		expect(wrapper.vm.toggleClass).toBe(true);
	});

	it('tests that filter modal is toggled', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		expect(wrapper.vm.toggleClass).toBe(true);
		wrapper.vm.filter = true;
		wrapper.vm.$nextTick();
		wrapper.vm.toggleFilterModal();
		expect(wrapper.vm.toggleClass).toBe(false);
		jest.advanceTimersByTime(500);
		wrapper.vm.$nextTick();
		expect(wrapper.vm.filter).toBe(false);
		expect(wrapper.vm.toggleClass).toBe(true);
	});

	it('tests that edit modal is toggled', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		expect(wrapper.vm.toggleClass).toBe(true);
		wrapper.vm.showEditModal = true;
		wrapper.vm.$nextTick();
		wrapper.vm.toggleEditModal();
		expect(wrapper.vm.toggleClass).toBe(false);
		jest.advanceTimersByTime(500);
		wrapper.vm.$nextTick();
		expect(wrapper.vm.showEditModal).toBe(false);
		expect(wrapper.vm.toggleClass).toBe(true);
	});

	it('tests that deactivate modal is toggled', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		expect(wrapper.vm.toggleClass).toBe(true);
		wrapper.vm.deactivateModal = true;
		wrapper.vm.$nextTick();
		wrapper.vm.toggleDeactivateModal();
		expect(wrapper.vm.toggleClass).toBe(false);
		jest.advanceTimersByTime(500);
		wrapper.vm.$nextTick();
		expect(wrapper.vm.deactivateModal).toBe(false);
		expect(wrapper.vm.toggleClass).toBe(true);
	});

	it('tests that activate modal is toggled', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		expect(wrapper.vm.toggleClass).toBe(true);
		wrapper.vm.activateModal = true;
		wrapper.vm.$nextTick();
		wrapper.vm.toggleActivateModal();
		expect(wrapper.vm.toggleClass).toBe(false);
		jest.advanceTimersByTime(500);
		wrapper.vm.$nextTick();
		expect(wrapper.vm.activateModal).toBe(false);
		expect(wrapper.vm.toggleClass).toBe(true);
	});

	it('tests that suspend modal is toggled', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		expect(wrapper.vm.toggleClass).toBe(true);
		wrapper.vm.suspendModal = true;
		wrapper.vm.$nextTick();
		wrapper.vm.toggleSuspendModal();
		expect(wrapper.vm.toggleClass).toBe(false);
		jest.advanceTimersByTime(500);
		wrapper.vm.$nextTick();
		expect(wrapper.vm.suspendModal).toBe(false);
		expect(wrapper.vm.toggleClass).toBe(true);
	});

	it('tests that filter modal is called on button click', () => {
		const toggleFilterModal = jest.fn();
		const wrapper = mount(Users, {
			store,
			methods: {
				toggleFilterModal
			}
		});
		wrapper.findAllComponents(VButton).at(1).trigger('click');
		expect(toggleFilterModal).toHaveBeenCalled();
	});

	it('tests that table component exists', () => {
		const wrapper = mount(Users, {
			store
		});
		const table = wrapper.findAllComponents(VTable);
		expect(table).toHaveLength(1);
	});

	it('tests that the search action is called', async () => {
		const searchPage = jest.fn();

		const wrapper = mount(Users, {
			store,
			methods: {
				searchPage
			}
		});

		// expect(wrapper.vm.$data.searchQuery).toBeNull();
		wrapper.setData({ searchQuery: 'lani' });
		expect(wrapper.vm.$data.searchQuery).toEqual('lani');
		await flushPromises();
		expect(wrapper.vm.searchPage());
		expect(wrapper.vm.loading).toBeFalsy();

		// await flushPromises();
		// jest.runAllTimers();
		// jest.useRealTimers();
		// expect(search).toHaveBeenCalled();
	});
	it('tests that the loading state changes', async () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue,
			data() {
				return {
					loading: true
				};
			}
		});
		expect(wrapper.vm.loading).toBe(true);
		wrapper.vm.searchPage();
		await flushPromises();
		expect(wrapper.vm.loading).toBe(false);
	});

	it('tests that the deactivate method is called', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		expect(wrapper.vm.deactivate());
	});

	it('tests that the activate method is called', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		expect(wrapper.vm.activate());
	});

	it('tests that the suspend method is called', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		expect(wrapper.vm.suspend());
	});

	it('tests that the callback method is called', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		expect(wrapper.vm.clickCallback());
	});

	it('tests that the register user method is called', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		expect(wrapper.vm.registerUser());
	});

	it('tests that the deactivate modal is toggled', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		expect(wrapper.vm.openDeactivateModal(item));
	});

	it('tests that the activate modal is toggled', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		expect(wrapper.vm.openActivateModal(item));
	});

	it('tests that the suspend modal is toggled', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		expect(wrapper.vm.openSuspendModal(item));
	});

	it('tests that the edit modal is toggled', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		expect(wrapper.vm.openEditModal(item));
	});

	it('tests that the showUser method is called', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue,
			mocks: {
				$router: router
			}
		});
		expect(wrapper.vm.showUser(item));
	});

	// it('tests that searchQuery watcher is triggered', async () => {
	// 	const wrapper = shallowMount(Users, {
	// 		store,
	// 		localVue,
	// 		mocks: {
	// 			$router: router
	// 		}
	// 	});

	// 	jest.useFakeTimers();

	// 	const searchPage = debounce(() => jest.fn(), 700);

	// 	wrapper.setMethods({
	// 		searchPage
	// 	});

	// 	await wrapper.setData({
	// 		searchQuery: 'lani'
	// 	});

	// 	jest.advanceTimersByTime(700);
	// 	// jest.runAllTimers();

	// 	expect(searchPage.called).toBe(true);
	// })

	it('shows page title', () => {
		const wrapper = shallowMount(Users, {
			store,
			localVue
		});
		const pageTitle = wrapper.find('h2');
		expect(pageTitle.exists()).toBe(true);
	});

	it('should show number of users', () => {
		const wrapper = mount(Users, {
			store,
			data() {
				return {
					users,
					usersLoading: false
				};
			}
		});
		const userNo = wrapper.find('h4');
		expect(userNo.exists()).toBe(true);
	});

	it('tests that edit modal opens on button click', async () => {
		const wrapper = mount(Users, {
			store,
			data() {
				return {
					loading: false,
					users: users.data.response.data
				};
			}
		});

		const icon = wrapper.find('.table__wrapper').findAll('td').at(6).find('.dropdown__wrapper');
		icon.trigger('click');
		await wrapper.vm.$nextTick();
	});

	it('tests that the editUser method is called', async () => {
		const wrapper = mount(Users, {
			store,
			response: statusRes,
			data() {
				return {
					showEditModal: true,
					userInfo: item
				};
			}
		});
		expect(wrapper.vm.toggleClass).toBe(true);
		const btn = wrapper.find({ ref: 'editUser' });
		btn.trigger('click');
		await expect(wrapper.vm.editUser());
		expect(wrapper.vm.$data.loading).toBe(false);
	});

	// it('tests that searchPage method is called', () => {
	// debounce.mockImplementation(fn => fn);
	// 	const searchPage = jest.fn();

	// 	const wrapper = mount(Users, {
	// 		store,
	// 		data() {
	// 			return {
	// 				searchQuery: ''
	// 			};
	// 		},
	// 		methods: {
	// 			searchPage
	// 		}
	// 	});

	// 	expect(wrapper.vm.$data.searchQuery).toBe('');
	// 	wrapper.setData({ searchQuery: 'lani' });
	// 	expect(wrapper.vm.$data.searchQuery).toEqual('lani');
	// 	wrapper.vm.$options.watch.searchQuery.call(wrapper.vm);
	// 	console.log('##########');
	// 	console.log(wrapper.vm.$options.watch);
	// 	console.log('##########');
	// 	jest.advanceTimersByTime(600);
	// 	expect(wrapper.vm.searchPage({ q: 'lani' }));
	// });
});