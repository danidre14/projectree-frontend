import DCL, { Link } from "../DCL/core.js";

export default class Privacy extends DCL {

    async render() {
        return `
        <div class="${tw`flex h-full flex-grow flex-col`}">
            <div class="${tw`border-b border-zinc-200 bg-zinc-50`}">
                <div class="${tw`container mx-auto py-5 px-4 sm:px-12`}">
                    <h1 class="${tw`mx-auto max-w-5xl text-4xl font-semibold`}">Privacy Policy</h1>
                </div>
            </div>
            <div class="${tw`container mx-auto flex-grow px-4 sm:px-12`}">
                <section class="${tw`mx-auto h-full max-w-5xl py-12`}">
                    <p class="${tw`my-3 mt-0 text-base`}">Your privacy is important to us. It is Projectree's policy to
                        respect your privacy regarding any information we may collect from you across our website, ${await new Link("https://projectree.com", { to: "https://projectree.com", class: tw`font-semibold text-red-400 underline hover:text-red-800` }).mount(this)}
                        , and other sites we own and
                        operate.</p>

                    <h5 class="${tw`mt-5 mb-4 text-lg font-medium sm:text-2xl`}">Personal identification information</h5>
                    <p class="${tw`my-3 text-base`}">We only ask for personal information when we truly need it to provide
                        a service to you. We collect it by fair and lawful means, with your knowledge and consent.
                        We also let you know why we're collecting it and how it will be used.</p>

                    <h5 class="${tw`mt-5 mb-4 text-lg font-medium sm:text-2xl`}">How we protect your information</h5>
                    <p class="${tw`my-3 text-base`}">We only retain collected information for as long as necessary to
                        provide you with your requested service. We adopt appropriate data collection, storage and
                        processing practices and security measures within commercially acceptable means to prevent
                        loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
                    </p>

                    <h5 class="${tw`mt-5 mb-4 text-lg font-medium sm:text-2xl`}">Sharing your personal information</h5>
                    <p class="${tw`my-3 text-base`}">We don't share any personally identifying information publicly or with
                        third-parties, except when required to by law.</p>

                    <h5 class="${tw`mt-5 mb-4 text-lg font-medium sm:text-2xl`}">Third party websites</h5>
                    <p class="${tw`my-3 text-base`}">Our website may link to external sites that are not operated by us.
                        Please be aware that we have no control over the content and practices of these sites, and
                        cannot accept responsibility or liability for their respective privacy policies.</p>

                    <h5 class="${tw`mt-5 mb-4 text-lg font-medium sm:text-2xl`}">Your acceptance of these terms</h5>
                    <p class="${tw`my-3 text-base`}">You are free to refuse our request for your personal information, with
                        the understanding that we may be unable to provide you with some of your desired services.
                        Your continued use of our website will be regarded as acceptance of our practices around
                        privacy and personal information.</p>

                    <h5 class="${tw`mt-5 mb-4 text-lg font-medium sm:text-2xl`}">Contacting us</h5>
                    <p class="${tw`my-3 text-base`}">If you have any questions about this Privacy Policy, the practices of
                        this site, or how we handle user data and personal information, feel free to 
                            ${await new Link("contact us", { to: "mailto:mailto@projectree.com", class: tw`font-semibold text-red-400 underline hover:text-red-800` }).mount(this)}.</p>

                    <p class="${tw`my-3 text-base`}">This policy is effective as of 28 July, 2022.</p>
                </section>
            </div>
        </div>`;
    }
}