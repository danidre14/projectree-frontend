import DCL, { Button, Link, Loader, setContext, navigateTo } from "../DCL/core.js";

export default class Dashboard extends DCL {
	constructor(props) {
		super(props);
		this.setTitle("Sign In");

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
<div class="${tw`flex h-full flex-col flex-grow`}">
    <div class="${tw`bg-neutral-300 px-12`}">
		<div class="${tw`container mx-auto py-5`}">
			<h1 class="${tw`text-3xl sm:text-4xl`}">Sign In</h1>
		</div>
    </div>
    <form class="${tw`flex-grow px-12`}">
		<div class="${tw`container mx-auto flex h-full gap-12 flex-col py-12`}">
			<div class="${tw`grid gap-12 sm:grid-cols-2 xl:w-2/3`}">
				<div class="${tw`flex flex-col gap-1`}">
					<label for="username" class="${tw`text-xl italic text-neutral-600`}">Username</label>
					<input oninput="${setLoginState}" type="text" autocomplete="username" id="username" class="${tw`rounded-lg border border-neutral-300 bg-white py-1 px-3 text-xl shadow-inner outline-none focus:bg-gray-50`}" name="username" value="${this.state.username}" />
				</div>
				<div class="${tw`flex flex-col gap-1`}">
					<label for="password" class="${tw`text-xl italic text-neutral-600`}">Password</label>
					<input oninput="${setLoginState}" type="password" autocomplete="current-password" id="password" class="${tw`rounded-lg border border-neutral-300 bg-white py-1 px-3 text-xl shadow-inner outline-none focus:bg-gray-50`}" name="password" value="${this.state.password}" />
				</div>
			</div>
		</div>
    </form>
    <div class="${tw`sticky bottom-0 bg-neutral-300 px-12`}">
		<div class="${tw`container mx-auto py-5 flex`}">
			<div class="${tw`ml-auto whitespace-nowrap`}">
				${await new Button("Sign In", { class: tw`rounded bg-blue-500 py-2 px-5 font-semibold text-slate-50 shadow-lg hover:bg-blue-600`, onClick: setSignedIn }).mount(this)}
			</div>
		</div>
    </div>
</div>`;
	}
}

function attemptSignIn() {
	setContext("loggedIn", true);
	navigateTo("/");
}