import DCL, { Button, Link, getContext, setContext, clearContext, navigateTo, triggerFunc } from "../DCL/core.js";
import { get, post, patch, put, del, cancel } from "../utils/makeRequest.js";

import { makeString } from "../utils/helperUtils.js";

export default class Dashboard extends DCL {
	constructor(props) {
		super(props);

		this.loggedIn = getContext("loggedIn");
		if (this.loggedIn) {
			navigateTo("/dashboard");
		}

		this.state = {
			email: "",
			password: ""
		}
	}

	async onMount() {
	}

	async render() {
		const submitLoginForm = this.createFunc((evt) => {
			evt.preventDefault();
			attemptLogin(this.state);
		});

		const setLoginState = this.setState((state, evt) => {
			const loginState = state;
			loginState[evt.target.name] = evt.target.value;

			return loginState;
		});

		return `
<div class="${tw`flex h-full flex-grow flex-col`}">
	<div class="${tw`border-b border-zinc-200 bg-zinc-50`}">
		<div class="${tw`container mx-auto py-5 px-4 sm:px-12`}">
			<h1 class="${tw`font-semibold text-4xl`}">Sign In</h1>
		</div>
	</div>
	<form id="signin_form" class="${tw`container mx-auto flex-grow px-4 sm:px-12`}">
		<div class="${tw`flex h-full flex-col gap-12 py-12`}">
			<div class="${tw`grid gap-12 sm:grid-cols-2 xl:w-2/3`}">
				<div class="${tw`flex flex-col gap-1`}">
					<label for="email" class="${tw`text-xl italic text-neutral-600`}">Email</label>
					<input onchange="${setLoginState}" type="email" autocomplete="username" id="email" class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}" name="email" value="${this.state.email}" ${DCL.autoFocus}/>
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="account_password" class="${tw`text-xl italic text-neutral-600`}">Password</label>
					<input onchange="${setLoginState}" type="password" autocomplete="current-password" id="account_password" class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}" name="password" value="${this.state.password}" />
				</div>
			</div>
			<p class="${tw`italic`}">
				Don't have an account?
				${await new Link("Sign Up", { to: "/signup", class: tw`font-semibold text-red-400 underline hover:text-red-800` }).mount(this)}
			</p>
		</div>
	</form>
	<div class="${tw`sticky bottom-0 container mx-auto bg-zinc-50 px-4 sm:px-12`}">
		<div class="${tw`flex py-5`}">
			<div class="${tw`ml-auto whitespace-nowrap`}">
				${await new Button("Sign In", { form: "signin_form", class: tw`inline-block whitespace-nowrap rounded bg-red-400 py-2 px-5 font-bold text-zinc-50 hover:bg-red-800`, onClick: submitLoginForm }).mount(this)}
			</div>
		</div>
	</div>
</div>
`;
	}
}

async function attemptLogin(data) {
	let { email = "", password = "" } = data;
	email = makeString(email);
	password = makeString(password);

	if (!email) {
		alert("Email field required.");
		return;
	}
	if (!password) {
		alert("Password field required.");
		return;
	}

	try {
		const res = await post("/auth/login", { email, password });

		if (res.success) {
			const email = res.data.user.email;
			const user_id = res.data.user.user_id;
			const user = {
				email,
				id: user_id,
				token: btoa(`${email}:${password}`)
			}
			setContext("loggedIn", true);
			setContext("user", JSON.stringify(user));
			setContext("userEmail", user.email);
			setContext("userId", user.id);
			localStorage.setItem("loggedIn", true);
			localStorage.setItem("user", JSON.stringify(user));
			const successLink = getContext("signInReferrer") || "/dashboard";
			clearContext("signInReferrer");
			navigateTo(successLink);
		} else {
			const message = [];
			if (res.detail)
				message.push(res.detail);
			if (res.email)
				message.push(res.email);

			alert(message.join("\n"));
		}
	} catch (e) {
		alert("Sign in failed");
	}
}