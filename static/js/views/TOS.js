import DCL, { Link } from "../DCL/core.js";

export default class TOS extends DCL {

    async render() {
        return `
        <div class="${tw`flex h-full flex-grow flex-col`}">
            <div class="${tw`border-b border-zinc-200 bg-zinc-50`}">
                <div class="${tw`container mx-auto py-5 px-4 sm:px-12`}">
                    <h1 class="${tw`mx-auto max-w-5xl text-4xl font-semibold`}">Terms of Service</h1>
                </div>
            </div>
            <div class="${tw`container mx-auto flex-grow px-4 sm:px-12`}">
                <section class="${tw`mx-auto h-full max-w-5xl py-12`}">
                    <h5 class="${tw`mb-4 text-lg font-medium sm:text-2xl`}">The Gist</h5>
                    <p class="${tw`my-3 text-base`}">Basically, do not do anything that may take advantage of our
                        creations. If you have no idea what is good or bad, please 
                            ${await new Link("email", { to: "mailto:mailto@projectree.com", class: tw`whitespace-nowrap font-semibold text-red-400 underline hover:text-red-800` }).mount(this)} us before you do something!</p>
                    <p class="${tw`my-3 text-base`}">Generally, as this Software is an open source project, you are free to
                        fork the source and deploy your own versions of this project.</p>
                    <p class="${tw`my-3 text-base`}">However, the license grant included with the Software is not for
                        Projectree's trademarks, which include the Software logo designs. Projectree reserves all
                        trademark and copyright rights in and to all Projectree trademarks.</p>
                    <p class="${tw`my-3 text-base`}">The name Projectree, url ${await new Link("https://projectree.com", { to: "https://projectree.com", class: tw`font-semibold text-red-400 underline hover:text-red-800` }).mount(this)}, and related Projectree logos
                        are trademarks of Projectree's. By using this Software you agree not to claim these
                        trademarks as yours, or use them in any manner without Projectree's prior, written
                        permission, except as allowed in generated projectrees.</p>
                    <p class="${tw`my-3 text-base`}">For YouTubers, promoters, and journalists, generally feel free to
                        share our Software under fair use, if said work is publicly available... just, again, credit
                        us fully, and provide links to this site. I don't want anyone getting confused or
                        misdirected.</p>
                    <p class="${tw`my-3 text-base`}">For users and developers, feel free to use this Software to generate
                        and share your projectrees, or fork the source and modify it for your own purposes... just
                        again rebrand your versions, as Projectree is trademarked.</p>
                    <p class="${tw`my-3 text-base`}">And finally, please do not exploit, hack, or take advantage of our
                        work; be fair to other people using our website; and be kind.</p>

                    <h5 class="${tw`mt-5 mb-4 text-lg font-medium sm:text-2xl`}">1. Terms</h5>
                    <p class="${tw`my-3 text-base`}">By accessing the website at ${await new Link("https://projectree.com", { to: "https://projectree.com", class: tw`font-semibold text-red-400 underline hover:text-red-800` }).mount(this)}, you are agreeing to be bound
                        by these terms of service, all applicable laws and regulations, and agree that you are
                        responsible for compliance with any applicable local laws. If you do not agree with any of
                        these terms, you are prohibited from using or accessing this site. The materials contained
                        in this website are protected by applicable copyright and trademark law.</p>

                    <h5 class="${tw`mt-5 mb-4 text-lg font-medium sm:text-2xl`}">2. Use License</h5>
                    <ol type="a" class="${tw`ml-8 list-disc`}">
                        <li class="${tw`my-3`}">
                            Permission is granted to temporarily download one copy of the materials (information or
                            software) on Projectree's website for personal, non-commercial transitory viewing only.
                            This is the grant of a license, not a transfer of title, and under this license you may
                            not:
                            <ol type="i" class="${tw`ml-8 list-decimal`}">
                                <li>modify or copy the materials;</li>
                                <li>use the materials for any commercial purpose, or for any public display
                                    (commercial or non-commercial);</li>
                                <li>attempt to decompile or reverse engineer any software contained on Projectree's
                                    website;</li>
                                <li>remove any copyright or other proprietary notations from the materials; or</li>
                                <li>transfer the materials to another person or "mirror" the materials on any other
                                    server.</li>
                            </ol>
                        </li>
                        <li class="${tw`my-3`}">
                            However, permission is granted to fork Projectree's source for any use. With this fork,
                            you may:
                            <ol type="i" class="${tw`ml-8 list-decimal`}">
                                <li>modify and copy the materials;</li>
                                <li>use the materials for any commercial purpose, or for any public display
                                    (commercial or non-commercial);</li>
                                <li>attempt to decompile or reverse engineer any software contained in the source;
                                </li>
                                <li>replace any copyright or other proprietary notations from the materials; and
                                </li>
                                <li>transfer the materials to another person or "mirror" the materials on any other
                                    server.</li>
                            </ol>
                        </li>
                        <li class="${tw`my-3`}">Permission is also granted to modify or use projectrees generated using
                            this Software, in any way desired.</li>
                        <li class="${tw`my-3`}">This license shall automatically terminate if you violate any of these
                            restrictions and may be terminated by Projectree at any time. Upon terminating your
                            viewing of these materials or upon the termination of this license, you must destroy any
                            downloaded materials in your possession whether in electronic or printed format. This
                            does not apply for forked projects, or generated projectrees.</li>
                    </ol>

                    <h5 class="${tw`mt-5 mb-4 text-lg font-medium sm:text-2xl`}">3. Disclaimer</h5>
                    <ol type="a" class="${tw`ml-8 list-disc`}">
                        <li class="${tw`my-3`}">The materials on Projectree's website are provided on an 'as is' basis.
                            Proejctree makes no warranties, expressed or implied, and hereby disclaims and negates
                            all other warranties including, without limitation, implied warranties or conditions of
                            merchantability, fitness for a particular purpose, or non-infringement of intellectual
                            property or other violation of rights.</li>
                        <li class="${tw`my-3`}">Further, Projectree does not warrant or make any representations concerning
                            the accuracy, likely results, or reliability of the use of the materials on its website
                            or otherwise relating to such materials or on any sites linked to this site.</li>
                    </ol>

                    <h5 class="${tw`mt-5 mb-4 text-lg font-medium sm:text-2xl`}">4. Limitations</h5>
                    <p class="${tw`my-3 text-base`}">In no event shall Projectree or its suppliers be liable for any
                        damages (including, without limitation, damages for loss of data or profit, or due to
                        business interruption) arising out of the use or inability to use the materials on
                        Projectree's website, even if Projectree or a Projectree authorized representative has been
                        notified orally or in writing of the possibility of such damage. Because some jurisdictions
                        do not allow limitations on implied warranties, or limitations of liability for
                        consequential or incidental damages, these limitations may not apply to you.</p>

                    <h5 class="${tw`mt-5 mb-4 text-lg font-medium sm:text-2xl`}">5. Accuracy of materials</h5>
                    <p class="${tw`my-3 text-base`}">The materials appearing on Projectree's website or generated
                        projectrees could include technical, typographical, or photographic errors. Projectree does
                        not warrant that any of the materials on its website are accurate, complete or current.
                        Projectree may make changes to the materials contained on its website at any time without
                        notice. However Projectree does not make any commitment to update the materials.</p>

                    <h5 class="${tw`mt-5 mb-4 text-lg font-medium sm:text-2xl`}">6. Links</h5>
                    <p class="${tw`my-3 text-base`}">Projectree has not reviewed all of the sites linked to its website and
                        is not responsible for the contents of any such linked site. The inclusion of any link does
                        not imply endorsement by Projectree of the site. Use of any such linked website is at the
                        user's own risk.</p>

                    <h5 class="${tw`mt-5 mb-4 text-lg font-medium sm:text-2xl`}">7. Modifications</h5>
                    <p class="${tw`my-3 text-base`}">Projectree may revise these terms of service for its website at any
                        time without notice. By using this website you are agreeing to be bound by the then current
                        version of these terms of service.</p>

                    <h5 class="${tw`mt-5 mb-4 text-lg font-medium sm:text-2xl`}">8. Governing Law</h5>
                    <p class="${tw`my-3 text-base`}">These terms and conditions are governed by and construed in accordance
                        with the laws of Trinidad and Tobago without regard to its conflict of law provisions.</p>

                    <h5 class="${tw`mt-5 mb-4 text-lg font-medium sm:text-2xl`}">Privacy Policy</h5>
                    <p class="${tw`my-3 text-base`}">Your privacy is important to us. Here's our 
                    ${await new Link("privacy policy", { to: "/legal/privacy", class: tw`font-semibold text-red-400 underline hover:text-red-800` }).mount(this)}.</p>
                    <p class="${tw`my-3 text-base`}">We are committed to conducting our business in accordance with these
                        principles in order to ensure that the confidentiality of personal information is protected
                        and maintained.</p>

                    <p class="${tw`my-3 text-base`}">Terms of service effective as of 28 July, 2022.</p>
                </section>
            </div>
        </div>`;
    }
}