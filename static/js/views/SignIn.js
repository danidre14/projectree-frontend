import DCL, { Button, Link, getContext, setContext, clearContext, navigateTo } from "../DCL/core.js";

export default class Dashboard extends DCL {
	constructor(props) {
		super(props);
		this.setTitle("Sign In");

		this.loggedIn = getContext("loggedIn");
		if (this.loggedIn) {
			navigateTo("/dashboard");
		}

		this.state = {
			username: "",
			password: ""
		}
	}

	async onMount() {
		// const hi = this.setState("count", this.state.count + 5);
		// await window.asyncWait(1000);

		// DCL.triggerFunc(hi);
	}

	async render() {
		const setSignedIn = this.createFunc(() => {
			attemptSignIn();
		});

		const setLoginState = this.setState((state, evt) => {
			const loginState = state;
			loginState[evt.target.name] = evt.target.value;

			return loginState;
		})

		return `
<div class="${tw`flex h-full flex-grow flex-col`}">
	<div class="${tw`border-b border-zinc-200 bg-zinc-50`}">
		<div class="${tw`container mx-auto py-5 px-12`}">
			<h1 class="${tw`font-semibold text-4xl`}">Sign In</h1>
		</div>
	</div>
	<form class="${tw`container mx-auto flex-grow px-12`}">
		<div class="${tw`flex h-full flex-col gap-12 py-12`}">
			<div class="${tw`grid gap-12 sm:grid-cols-2 xl:w-2/3`}">
				<div class="${tw`flex flex-col gap-1`}">
					<label for="account_username" class="${tw`text-xl italic text-neutral-600`}">Username</label>
					<input onchange="${setLoginState}" type="text" autocomplete="username" id="username" class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}" name="username" value="${this.state.username}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="account_password" class="${tw`text-xl italic text-neutral-600`}">Password</label>
					<input onchange="${setLoginState}" type="password" autocomplete="current-password" id="password" class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}" name="password" value="${this.state.password}" />
				</div>
			</div>	
			<p class="${tw`italic`}">
				Don't have an account?
				${await new Link("Sign Up", { to: "/signup", class: tw`font-semibold text-red-400 underline hover:text-red-800` }).mount(this)}
			</p>
		</div>
	</form>
	<div class="${tw`sticky bottom-0 container mx-auto bg-zinc-50 px-12`}">
		<div class="${tw`flex py-5`}">
			<div class="${tw`ml-auto whitespace-nowrap`}">
				${await new Button("Sign In", { class: tw`inline-block whitespace-nowrap rounded bg-red-400 py-2 px-5 font-bold text-zinc-50 hover:bg-red-800`, onClick: setSignedIn }).mount(this)}
			</div>
		</div>
	</div>
</div>
`;
	}
}

function attemptSignIn() {
	setContext("loggedIn", true);
	const successLink = getContext("signInReferrer") || "/dashboard";
	clearContext("signInReferrer");
	navigateTo(successLink);
}