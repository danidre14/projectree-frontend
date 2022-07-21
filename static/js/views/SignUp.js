import DCL, { Button, Link, Loader, setContext, navigateTo } from "../DCL/core.js";

export default class Dashboard extends DCL {
	constructor(props) {
		super(props);
		this.setTitle("Sign Up");

		this.state = {
			first_name: "", last_name: "",
			username: "",
			email_1: "", email_2: "",
			password_1: "", password_2: ""
		}
	}

	async onMount() {
		// const hi = this.setState("count", this.state.count + 5);
		// await window.asyncWait(1000);

		// DCL.triggerFunc(hi);
	}

	async render() {
		const submitRegistrationForm = this.createFunc(() => {
			attemptRegister();
		});

		const setRegisterState = this.setState((state, evt) => {
			const registerState = state;
			registerState[evt.target.name] = evt.target.value;

			return registerState;
		})

		return 		`
<div class="${tw`flex h-full flex-grow flex-col`}">
	<div class="${tw`bg-neutral-300 px-12`}">
		<div class="${tw`container mx-auto py-5`}">
			<h1 class="${tw`text-3xl sm:text-4xl`}">Sign Up</h1>
		</div>
	</div>
	<form class="${tw`flex-grow px-12`}">
		<div class="${tw`container mx-auto flex h-full flex-col gap-12 py-12`}">
			<div class="${tw`grid gap-12 sm:grid-cols-2 xl:w-2/3`}">
				<div class="${tw`flex flex-col gap-1`}">
					<label for="first_name" class="${tw`text-xl italic text-neutral-600`}">First Name</label>
					<input oninput="${setRegisterState}" type="text" id="first_name"
						class="${tw`rounded-lg border border-neutral-300 bg-white py-1 px-3 text-xl shadow-inner outline-none focus:bg-gray-50`}"
						name="first_name" value="${this.state.first_name}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="last_name" class="${tw`text-xl italic text-neutral-600`}">Last Name</label>
					<input oninput="${setRegisterState}" type="text" id="last_name"
						class="${tw`rounded-lg border border-neutral-300 bg-white py-1 px-3 text-xl shadow-inner outline-none focus:bg-gray-50`}"
						name="last_name" value="${this.state.last_name}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="username" class="${tw`text-xl italic text-neutral-600`}">Username</label>
					<input oninput="${setRegisterState}" type="text" autocomplete="username" id="username"
						class="${tw`rounded-lg border border-neutral-300 bg-white py-1 px-3 text-xl shadow-inner outline-none focus:bg-gray-50`}"
						name="username" value="${this.state.username}" />
				</div>
				<div class="${tw`hidden sm:block`}"></div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="email_1" class="${tw`text-xl italic text-neutral-600`}">Email Address</label>
					<input oninput="${setRegisterState}" type="text" id="email_1"
						class="${tw`rounded-lg border border-neutral-300 bg-white py-1 px-3 text-xl shadow-inner outline-none focus:bg-gray-50`}"
						name="email_1" value=""${this.state.email_1}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="email_2" class="${tw`text-xl italic text-neutral-600`}">Confirm Email</label>
					<input oninput="${setRegisterState}" type="text" id="email_2"
						class="${tw`rounded-lg border border-neutral-300 bg-white py-1 px-3 text-xl shadow-inner outline-none focus:bg-gray-50`}"
						name="email_2" value=""${this.state.email_2}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="password_1" class="${tw`text-xl italic text-neutral-600`}">Password</label>
					<input oninput="${setRegisterState}" type="password" autocomplete="new-password" id="password_1"
						class="${tw`rounded-lg border border-neutral-300 bg-white py-1 px-3 text-xl shadow-inner outline-none focus:bg-gray-50`}"
						name="password_1" value=""${this.state.password_1}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="password_2" class="${tw`text-xl italic text-neutral-600`}">Confirm Password</label>
					<input oninput="${setRegisterState}" type="password" autocomplete="new-password" id="password_2"
						class="${tw`rounded-lg border border-neutral-300 bg-white py-1 px-3 text-xl shadow-inner outline-none focus:bg-gray-50`}"
						name="password_2" value=""${this.state.password_2}" />
				</div>
			</div>
		</div>
	</form>
	<div class="${tw`sticky bottom-0 bg-neutral-300 px-12`}">
		<div class="${tw`container mx-auto flex py-5`}">
			<div class="${tw`ml-auto whitespace-nowrap`}">
				${await new Button("Sign Up", { class: tw`rounded bg-blue-500 py-2 px-5 font-semibold text-slate-50 shadow-lg hover:bg-blue-600`, onClick: submitRegistrationForm }).mount(this)}
			</div>
		</div>
	</div>
</div>`;
	}
}

function attemptRegister() {
	// setContext("loggedIn", true);
	navigateTo("/signup?confirm_email=true");
}