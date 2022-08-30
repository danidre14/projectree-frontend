import DCL, { Button, Link, getContext, navigateTo, useQuery, triggerFunc } from "../DCL/core.js";

import { post } from "../utils/makeRequest.js";

import { makeString } from "../utils/helperUtils.js";

export default class Dashboard extends DCL {
	constructor(props) {
		super(props);

		this.loggedIn = !!getContext("user");
		if (this.loggedIn) {
			navigateTo("/dashboard");
		}

		this.state = {
			registration: {
				firstName: "", lastName: "",
				username: "",
				email1: "", email2: "",
				password1: "", password2: ""
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
	}

	async render() {
		let confirmEmail = false;
		const queryParams = this.queryParams;

		if (queryParams.confirm_email) {
			confirmEmail = true;
		}

		const submitRegistrationForm = this.createFunc((evt) => {
			evt.preventDefault();
			attemptRegister(this.state.registration);
		});

		const submitConfirmationForm = this.createFunc((evt) => {
			evt.preventDefault();
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
		<div class="${tw`container mx-auto py-5 px-4 sm:px-12`}">
			<h1 class="${tw`text-4xl font-semibold`}">Confirm Email</h1>
		</div>
	</div>
	<form id="confirm_form" class="${tw`container mx-auto flex-grow px-4 sm:px-12`}">
		<div class="${tw`flex h-full flex-col gap-12 py-12`}">
			<div class="${tw`grid gap-12 sm:grid-cols-2 xl:w-2/3`}">
				<div class="${tw`flex flex-col gap-1`}">
					<label for="email" class="${tw`text-xl italic text-neutral-600`}">Email</label>
					<input type="email" id="email" name="email"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						disabled value="${this.state.confirmation.email}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="code" class="${tw`text-xl italic text-neutral-600`}">Verification
						Code</label>
					<input onchange="${setConfirmationState}" type="text" id="code" name="code"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						value="${this.state.confirmation.code}" ${DCL.autoFocuss || ""}/>
				</div>
			</div>
		</div>
	</form>
	<div class="${tw`container sticky bottom-0 mx-auto bg-zinc-50 px-4 sm:px-12`}">
		<div class="${tw`container mx-auto flex py-5`}">
			<div class="${tw`ml-auto whitespace-nowrap`}">
				${await new Button("Confirm", { form: "confirm_form", class: tw`inline-block whitespace-nowrap rounded bg-red-400 py-2 px-5 font-bold text-zinc-50 hover:bg-red-800`, onClick: submitConfirmationForm }).mount(this)}
			</div>
		</div>
	</div>
</div>` : `
<div class="${tw`flex h-full flex-grow flex-col`}">
	<div class="${tw`border-b border-zinc-200 bg-zinc-50`}">
		<div class="${tw`container mx-auto py-5 px-4 sm:px-12`}">
			<h1 class="${tw`text-4xl font-semibold`}">Sign Up</h1>
		</div>
	</div>
	<form id="signup_form" class="${tw`container mx-auto flex-grow px-4 sm:px-12`}">
		<div class="${tw`flex h-full flex-col gap-12 py-12`}">
			<div class="${tw`grid gap-12 sm:grid-cols-2 xl:w-2/3`}">
				<div class="${tw`flex flex-col gap-1`}">
					<label for="firstName" class="${tw`text-xl italic text-neutral-600`}">First Name</label>
					<input onchange="${setRegistrationState}" type="text" id="firstName"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						name="firstName" value="${this.state.registration.firstName}" ${DCL.autoFocuss || ""}/>
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="lastName" class="${tw`text-xl italic text-neutral-600`}">Last Name</label>
					<input onchange="${setRegistrationState}" type="text" id="lastName"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						name="lastName" value="${this.state.registration.lastName}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="username" class="${tw`text-xl italic text-neutral-600`}">Username</label>
					<input onchange="${setRegistrationState}" type="text" autocomplete="username" id="username"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						name="username" value="${this.state.registration.username}" />
				</div>
				<div class="${tw`hidden sm:block`}"></div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="email1" class="${tw`text-xl italic text-neutral-600`}">Email Address</label>
					<input onchange="${setRegistrationState}" type="email" id="email1"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						name="email1" value="${this.state.registration.email1}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="email2" class="${tw`text-xl italic text-neutral-600`}">Confirm Email</label>
					<input onchange="${setRegistrationState}" type="email" id="email2"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						name="email2" value="${this.state.registration.email2}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="password1" class="${tw`text-xl italic text-neutral-600`}">Password</label>
					<input onchange="${setRegistrationState}" type="password" autocomplete="new-password" id="password1"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						name="password1" value="${this.state.registration.password1}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="password2" class="${tw`text-xl italic text-neutral-600`}">Confirm Password</label>
					<input onchange="${setRegistrationState}" type="password" autocomplete="new-password" id="password2"
						class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
						name="password2" value="${this.state.registration.password2}" />
				</div>
			</div>
			<p class="${tw`italic`}">
				Already have an account?
				${await new Link("Sign In", { to: "/signin", class: tw`font-semibold text-red-400 underline hover:text-red-800` }).mount(this)}
			</p>
		</div>
	</form>
	<div class="${tw`container sticky bottom-0 mx-auto bg-zinc-50 px-4 sm:px-12`}">
		<div class="${tw`container mx-auto flex py-5`}">
			<div class="${tw`ml-auto whitespace-nowrap`}">
				${await new Button("Sign Up", { form: "signup_form", class: tw`inline-block whitespace-nowrap rounded bg-red-400 py-2 px-5 font-bold text-zinc-50 hover:bg-red-800`, onClick: submitRegistrationForm }).mount(this)}
			</div>
		</div>
	</div>
</div>`;
	}
}

async function attemptRegister(data) {
	let {
		firstName = "", lastName = "",
		username = "",
		email1 = "", email2 = "",
		password1 = "", password2 = ""
	} = data;

	firstName = makeString(firstName);
	lastName = makeString(lastName);
	username = makeString(username).toLowerCase();
	email1 = makeString(email1).toLowerCase();
	email2 = makeString(email2).toLowerCase();
	password1 = makeString(password1);
	password2 = makeString(password2);

	if (!firstName) {
		alert("First name field required");
		return;
	}
	if (!lastName) {
		alert("Last name field required");
		return;
	}

	if (!username) {
		alert("Username field required");
		return;
	}
	if (username.length < 4 || username.length > 15) {
		alert("Username must be 4-15 characters long");
		return;
	} else {
		if (username.charAt(0).match(/^[a-z]+$/ig) === null) {
			alert("Username must start with a letter\n");
			return;
		} else if (username.match(/^[a-z][a-z\d]+$/ig) === null) {
			alert("Symbols/Spaces not allowed in username");
			return;
		}
	}

	if (!email1 || !email2) {
		alert("Email fields required");
		return;
	}

	if (!password1 || !password2) {
		alert("Password fields required");
		return;
	}
	if (password1.length < 8) {
		alert("Password must be 8 or more characters\n");
		return;
	}
	if (password1.search(/\d/) === -1) {
		alert("Password must contain at least one number\n");
		return;
	}
	if (password1.search(/[A-Z]/) === -1) {
		alert("Password must contain at least one uppercase letter\n");
		return;
	}

	if (email1 !== email2) {
		alert("Emails do not match");
		return;
	}

	if (password1 !== password2) {
		alert("Passwords do not match");
		return;
	}

	try {
		const res = await post("/auth/signup", {
			firstName,
			lastName,
			username,
			email1,
			email2,
			password1,
			password2
		});

		if (res.success) {
			// navigateTo("/signin");
			if (res.message)
				alert(res.message);
		} else {
			if (res.message)
				alert(res.message);
		}
	} catch (err) {
		alert("Sign up failed: ", err);
		console.error(err)
	}
}

function attemptConfirmation() {
	navigateTo("/signin");
}