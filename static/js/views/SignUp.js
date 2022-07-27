import DCL, { Button, Link, getContext, setContext, navigateTo, useQuery, triggerFunc } from "../DCL/core.js";

import { get, post, patch, put, del, cancel } from "../utils/wrapperFetch.js";

import { makeString, isValidPassword } from "../utils/helperUtils.js";

export default class Dashboard extends DCL {
	constructor(props) {
		super(props);
		this.setTitle("Sign Up");

		this.loggedIn = getContext("loggedIn");
		if (this.loggedIn) {
			navigateTo("/dashboard");
		}

		this.state = {
			registration: {
				first_name: "", last_name: "",
				username: "",
				email_1: "", email_2: "",
				password_1: "", password_2: ""
			},
			confirmation: {
				email: "", code: ""
			}
		}

		this.queryParams = useQuery();
	}

	async onMount() {
		const queryParams = this.queryParams;

		if (queryParams.email) {
			triggerFunc(this.setState("confirmation", (state, event) => {
				const confimationState = state;
				confimationState.email = queryParams.email;
				return confimationState;
			}))
		}

		// const hi = this.setState("count", this.state.count + 5);
		// await window.asyncWait(1000);

		// DCL.triggerFunc(hi);
	}

	async render() {
		let confirmEmail = false;
		const queryParams = this.queryParams;

		console.log(this.state.registration)

		if (queryParams.confirm_email) {
			confirmEmail = true;
		}

		const submitRegistrationForm = this.createFunc(() => {
			attemptRegister(this.state.registration);
		});

		const submitConfirmationForm = this.createFunc(() => {
			attemptConfirmation(this.state.confirmation);
		});

		const setRegistrationState = this.setState("registration", (state, evt) => {
			const registrationState = state;
			registrationState[evt.target.name] = evt.target.value;


			return registrationState;
		});

		const setConfirmationState = this.setState("confirmation", (state, evt) => {
			const confirmationState = state;
			confirmationState[evt.target.name] = evt.target.value;

			return confirmationState;
		});

		return confirmEmail ? `

		<!-- Confirm Email Page -->
<div class="${tw`flex h-full flex-grow flex-col`}">
	<div class="${tw`border-b border-zinc-200 bg-zinc-50`}">
		<div class="${tw`container mx-auto py-5 px-12`}">
			<h1 class="${tw`text-4xl font-semibold`}">Confirm Email</h1>
		</div>
	</div>
	<form class="${tw`container mx-auto flex-grow px-12`}">
		<div class="${tw`flex h-full flex-col gap-12 py-12`}">
			<div class="${tw`grid gap-12 sm:grid-cols-2 xl:w-2/3`}">
				<div class="${tw`flex flex-col gap-1`}">
					<label for="email" class="${tw`text-xl italic text-neutral-600`}">Email</label>
					<input type="text" id="email" name="email"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						disabled value="${this.state.confirmation.email}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="code" class="${tw`text-xl italic text-neutral-600`}">Verification
						Code</label>
					<input onchange="${setConfirmationState}" type="text" id="code" name="code"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						value="${this.state.confirmation.code}" />
				</div>
			</div>
		</div>
	</form>
	<div class="${tw`container sticky bottom-0 mx-auto bg-zinc-50 px-12`}">
		<div class="${tw`container mx-auto flex py-5`}">
			<div class="${tw`ml-auto whitespace-nowrap`}">
				${await new Button("Confirm", { class: tw`inline-block whitespace-nowrap rounded bg-red-400 py-2 px-5 font-bold text-zinc-50 hover:bg-red-800`, onClick: submitConfirmationForm }).mount(this)}
			</div>
		</div>
	</div>
</div>` : `
<div class="${tw`flex h-full flex-grow flex-col`}">
	<div class="${tw`border-b border-zinc-200 bg-zinc-50`}">
		<div class="${tw`container mx-auto py-5 px-12`}">
			<h1 class="${tw`text-4xl font-semibold`}">Sign Up</h1>
		</div>
	</div>
	<form class="${tw`container mx-auto flex-grow px-12`}">
		<div class="${tw`flex h-full flex-col gap-12 py-12`}">
			<div class="${tw`grid gap-12 sm:grid-cols-2 xl:w-2/3`}">
				<div class="${tw`flex flex-col gap-1`}">
					<label for="first_name" class="${tw`text-xl italic text-neutral-600`}">First Name</label>
					<input onchange="${setRegistrationState}" type="text" id="first_name"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						name="first_name" value="${this.state.registration.first_name}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="last_name" class="${tw`text-xl italic text-neutral-600`}">Last Name</label>
					<input onchange="${setRegistrationState}" type="text" id="last_name"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						name="last_name" value="${this.state.registration.last_name}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="username" class="${tw`text-xl italic text-neutral-600`}">Username</label>
					<input onchange="${setRegistrationState}" type="text" autocomplete="username" id="username"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						name="username" value="${this.state.registration.username}" />
				</div>
				<div class="${tw`hidden sm:block`}"></div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="email_1" class="${tw`text-xl italic text-neutral-600`}">Email Address</label>
					<input onchange="${setRegistrationState}" type="text" id="email_1"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						name="email_1" value="${this.state.registration.email_1}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="email_2" class="${tw`text-xl italic text-neutral-600`}">Confirm Email</label>
					<input onchange="${setRegistrationState}" type="text" id="email_2"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						name="email_2" value="${this.state.registration.email_2}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="password_1" class="${tw`text-xl italic text-neutral-600`}">Password</label>
					<input onchange="${setRegistrationState}" type="password" autocomplete="new-password" id="password_1"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						name="password_1" value="${this.state.registration.password_1}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="password_2" class="${tw`text-xl italic text-neutral-600`}">Confirm Password</label>
					<input onchange="${setRegistrationState}" type="password" autocomplete="new-password" id="password_2"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						name="password_2" value="${this.state.registration.password_2}" />
				</div>
			</div>
			<p class="${tw`italic`}">
				Already have an account?
				${await new Link("Sign In", { to: "/signin", class: tw`font-semibold text-red-400 underline hover:text-red-800` }).mount(this)}
			</p>
		</div>
	</form>
	<div class="${tw`container sticky bottom-0 mx-auto bg-zinc-50 px-12`}">
		<div class="${tw`container mx-auto flex py-5`}">
			<div class="${tw`ml-auto whitespace-nowrap`}">
				${await new Button("Sign Up", { class: tw`inline-block whitespace-nowrap rounded bg-red-400 py-2 px-5 font-bold text-zinc-50 hover:bg-red-800`, onClick: submitRegistrationForm }).mount(this)}
			</div>
		</div>
	</div>
</div>`;
	}
}

async function attemptRegister(data) {
	let {
		first_name = "", last_name = "",
		username = "",
		email_1 = "", email_2 = "",
		password_1 = "", password_2 = ""
	} = data;

	first_name = makeString(first_name);
	last_name = makeString(last_name);
	username = makeString(username);
	email_1 = makeString(email_1);
	email_2 = makeString(email_2);
	password_1 = makeString(password_1);
	password_2 = makeString(password_2);

	if (!first_name) {
		alert("First name field required");
		return;
	}
	if (!last_name) {
		alert("Last name field required");
		return;
	}
	if (!username) {
		alert("Username field required");
		return;
	}
	if (!email_1 || !email_2) {
		alert("Email fields required");
		return;
	}
	if (!password_1 || !password_2) {
		alert("Password fields required");
		return;
	}

	if (email_1 !== email_2) {
		alert("Emails do not match");
		return;
	}

	if (password_1 !== password_2) {
		alert("Passwords do not match");
		return;
	}

	if (!isValidPassword(password_1)) {
		alert("Password must be 4 or more alphanumeric characters");
		return;
	}

	try {
		const res = await post("/auth/register", {
			first_name, last_name,
			username, email: email_1, password: password_1
		});

		if (res.success) {
			navigateTo("/signin");
		} else {
			if (res.message)
				alert(res.message);
		}
	} catch (e) {
		alert("Sign up failed");
	}
}

function attemptConfirmation() {
	navigateTo("/signin");
}