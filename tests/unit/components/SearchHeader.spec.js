import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import searchHeader from '@/components/Header/search/Header.vue';
import VueRouter from 'vue-router';
const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

describe('searchHeader', () => {
	let mutations;
	let store;
	const router = new VueRouter({
		routes: [
			{ path: '/login', name: 'Login' },
			{ path: '/settings', name: 'Settings' }
		]
	});
	beforeEach(() => {
		mutations = {
			logout: jest.fn()
		};
		store = new Vuex.Store({
			modules: {
				auth: {
					namespaced: true,
					mutations
				}
			}
		});
	});

	it('should be a vue instance', () => {
		const wrapper = shallowMount(searchHeader, {
			localVue,
			store,
			router
		});

		expect(wrapper.vm).toBeTruthy();
	});

	it('should route to login', async () => {
		const wrapper = shallowMount(searchHeader, {
			localVue,
			store,
			router
		});
		wrapper.vm.logoutUser();
		await wrapper.vm.$nextTick();
	});
	it('should route to settings', async () => {
		const wrapper = shallowMount(searchHeader, {
			localVue,
			store,
			router
		});
		wrapper.vm.gotoSettings();
		await wrapper.vm.$nextTick();
	});
});
