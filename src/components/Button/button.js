export default {
	props: {
		size: {
			type: String,
			default: 'default',
			validator: function (value) {
				return ['small', 'medium', 'full', 'modal', 'default'].indexOf(value) !== -1;
			}
		},
		buttonType: {
			type: String,
			default: 'muted',
			validator: function (value) {
				return ['primary', 'outline', 'secondary', 'link', 'muted', 'error'].indexOf(value) !== -1;
			}
		}
	},
	computed: {
		classes() {
			return {
				btn: true,
				[`btn-${this.buttonType}`]: true,
				[`btn-${this.size}`]: true
			};
		}
	}
};
