function displayStandard(projectree) {
    return `
    <header>
      <div class="${tw`flex h-72 sm:h-96 items-center justify-center font-bold bg-purple-700 text-white`}">
        <h1 class="${tw`text-3xl sm:text-5xl text-center`}">${projectree.title}</h1>
      </div>
    </header>
    <main class="${tw`container flex-grow mx-auto`}">
        ${projectree.projectItems.map(project_item => {
        const {
            name, description, languages, image, demoLink, sourceLink
        } = project_item;
        return `<section class="${tw`my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4`}">
            <div class="${tw`relative`}">
                <div class="${tw`flex sm:h-96 flex-1 items-center justify-center overflow-hidden rounded-xl`}">
                    <img class="${tw`w-full rounded-xl`}" src="${image}" onerror="if (this.src != '/static/images/default_project_photo.png') this.src = '/static/images/default_project_photo.png';" alt="" />
                </div>
                <div class="${tw`absolute bottom-0 left-0 flex flex-wrap gap-2 p-2`}">
                    ${sourceLink ? `
                    <div class="${tw`overflow-hidden rounded-full`}">
                    <a target="_blank" href="${sourceLink}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </a>
                    </div>
                    ` : ""}
                    ${demoLink ? `
                    <div class="${tw`overflow-hidden rounded-full`}">
                    <a target="_blank" href="${demoLink}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </a>
                    </div>
                    ` : ""}
                </div>
                </div>
                <div class="${tw`flex flex-col`}">
                <h2 class="${tw`mb-6 text-3xl font-semibold`}">${name}</h2>
                <p class="${tw`flex-grow whitespace-pre-line`}">${description}</p>
                <div class="${tw`flex flex-wrap gap-2 p-2`}">
                    ${languages.split(",").map(language => {
            return `<span class="${tw`inline-flex items-center gap-2 rounded-full bg-blue-300 p-1 pr-2`}">
                        <span class="${tw`h-4 w-4 rounded-full bg-white`}"></span>
                        <span class="${tw`text-xs`}">${language}</span>
                    </span>`;
        }).join("")}
                </div>
            </div>
        </section>`
    }).join("")}
    </main>
    <footer class="${tw`bg-purple-700 font-semibold text-white px-4`}">
      <div class="${tw`container mx-auto flex h-20 items-center justify-between`}">
        <p class="${tw`text-lg`}">${projectree.title}</p>
        <p class="${tw`text-lg`}">Designed by <a class="${tw`underline text-purple-200 visited:text-purple-300`}" href="https://www.projectree.net/">Projectree</a></p>
      </div>
    </footer>
    `;
}

function displayStandardRose(projectree) {
    return `
    <header>
      <div class="${tw`flex h-72 sm:h-96 items-center justify-center font-bold bg-pink-700 text-white`}">
        <h1 class="${tw`text-3xl sm:text-5xl text-center`}">${projectree.title}</h1>
      </div>
    </header>
    <main class="${tw`flex-grow bg-pink-200`}">
        <div class="${tw`mx-auto container`}">
            ${projectree.projectItems.map(project_item => {
        const {
            name, description, languages, image, demoLink, sourceLink
        } = project_item;
        return `<section class="${tw`my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4`}">
                <div class="${tw`relative`}">
                    <div class="${tw`flex sm:h-96 flex-1 items-center justify-center overflow-hidden rounded-xl`}">
                        <img class="${tw`w-full rounded-xl`}" src="${image}" onerror="if (this.src != '/static/images/default_project_photo.png') this.src = '/static/images/default_project_photo.png';" alt="" />
                    </div>
                    <div class="${tw`absolute bottom-0 left-0 flex flex-wrap gap-2 p-2`}">
                        ${sourceLink ? `
                        <div class="${tw`overflow-hidden rounded-full`}">
                        <a target="_blank" href="${sourceLink}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </a>
                        </div>
                        ` : ""}
                        ${demoLink ? `
                        <div class="${tw`overflow-hidden rounded-full`}">
                        <a target="_blank" href="${demoLink}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </a>
                        </div>
                        ` : ""}
                    </div>
                    </div>
                    <div class="${tw`flex flex-col`}">
                    <h2 class="${tw`mb-6 text-3xl font-semibold`}">${name}</h2>
                    <p class="${tw`flex-grow whitespace-pre-line`}">${description}</p>
                    <div class="${tw`flex flex-wrap gap-2 p-2`}">
                        ${languages.split(",").map(language => {
            return `<span class="${tw`inline-flex items-center gap-2 rounded-full bg-pink-400 p-1 pr-2`}">
                            <span class="${tw`h-4 w-4 rounded-full bg-white`}"></span>
                            <span class="${tw`text-xs`}">${language}</span>
                        </span>`;
        }).join("")}
                    </div>
                </div>
            </section>`
    }).join("")}
        <div>
    </main>
    <footer class="${tw`bg-pink-700 font-semibold text-white px-4`}">
      <div class="${tw`container mx-auto flex h-20 items-center justify-between`}">
        <p class="${tw`text-lg`}">${projectree.title}</p>
        <p class="${tw`text-lg`}">Designed by <a class="${tw`underline text-pink-200 visited:text-pink-300`}" href="https://www.projectree.net/">Projectree</a></p>
      </div>
    </footer>
    `;
}

function displayStandardGold(projectree) {
    return `
    <header>
      <div class="${tw`flex h-72 sm:h-96 items-center justify-center font-bold bg-yellow-500 text-white`}">
        <h1 class="${tw`text-3xl sm:text-5xl text-center`}">${projectree.title}</h1>
      </div>
    </header>
    <main class="${tw`flex-grow bg-white`}">
        <div class="${tw`mx-auto container`}">
            ${projectree.projectItems.map(project_item => {
        const {
            name, description, languages, image, demoLink, sourceLink
        } = project_item;
        return `<section class="${tw`my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4`}">
                <div class="${tw`relative`}">
                    <div class="${tw`flex sm:h-96 flex-1 items-center justify-center overflow-hidden rounded-xl`}">
                        <img class="${tw`w-full rounded-xl`}" src="${image}" onerror="if (this.src != '/static/images/default_project_photo.png') this.src = '/static/images/default_project_photo.png';" alt="" />
                    </div>
                    <div class="${tw`absolute bottom-0 left-0 flex flex-wrap gap-2 p-2`}">
                        ${sourceLink ? `
                        <div class="${tw`overflow-hidden rounded-full`}">
                        <a target="_blank" href="${sourceLink}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </a>
                        </div>
                        ` : ""}
                        ${demoLink ? `
                        <div class="${tw`overflow-hidden rounded-full`}">
                        <a target="_blank" href="${demoLink}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </a>
                        </div>
                        ` : ""}
                    </div>
                    </div>
                    <div class="${tw`flex flex-col`}">
                    <h2 class="${tw`mb-6 text-3xl font-semibold`}">${name}</h2>
                    <p class="${tw`flex-grow whitespace-pre-line`}">${description}</p>
                    <div class="${tw`flex flex-wrap gap-2 p-2`}">
                        ${languages.split(",").map(language => {
            return `<span class="${tw`inline-flex items-center gap-2 rounded-full text-white font-bold bg-yellow-400 p-1 pr-2`}">
                            <span class="${tw`h-4 w-4 rounded-full bg-white`}"></span>
                            <span class="${tw`text-xs`}">${language}</span>
                        </span>`;
        }).join("")}
                    </div>
                </div>
            </section>`
    }).join("")}
        <div>
    </main>
    <footer class="${tw`bg-yellow-500 font-semibold text-white px-4`}">
      <div class="${tw`container mx-auto flex h-20 items-center justify-between`}">
        <p class="${tw`text-lg`}">${projectree.title}</p>
        <p class="${tw`text-lg`}">Designed by <a class="${tw`underline text-yellow-50 visited:text-yellow-200`}" href="https://www.projectree.net/">Projectree</a></p>
      </div>
    </footer>
    `;
}



function displayStandardClover(projectree) {
    return `
    <header>
      <div class="${tw`flex h-72 sm:h-96 items-center justify-center font-bold bg-green-700 text-white`}">
        <h1 class="${tw`text-3xl sm:text-5xl text-center`}">${projectree.title}</h1>
      </div>
    </header>
    <main class="${tw`flex-grow bg-green-100`}">
        <div class="${tw`mx-auto container`}">
            ${projectree.projectItems.map(project_item => {
        const {
            name, description, languages, image, demoLink, sourceLink
        } = project_item;
        return `<section class="${tw`my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4`}">
                <div class="${tw`relative`}">
                    <div class="${tw`flex sm:h-96 flex-1 items-center justify-center overflow-hidden rounded-xl`}">
                        <img class="${tw`w-full rounded-xl`}" src="${image}" onerror="if (this.src != '/static/images/default_project_photo.png') this.src = '/static/images/default_project_photo.png';" alt="" />
                    </div>
                    <div class="${tw`absolute bottom-0 left-0 flex flex-wrap gap-2 p-2`}">
                        ${sourceLink ? `
                        <div class="${tw`overflow-hidden rounded-full`}">
                        <a target="_blank" href="${sourceLink}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </a>
                        </div>
                        ` : ""}
                        ${demoLink ? `
                        <div class="${tw`overflow-hidden rounded-full`}">
                        <a target="_blank" href="${demoLink}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </a>
                        </div>
                        ` : ""}
                    </div>
                    </div>
                    <div class="${tw`flex flex-col`}">
                    <h2 class="${tw`mb-6 text-3xl font-semibold`}">${name}</h2>
                    <p class="${tw`flex-grow whitespace-pre-line`}">${description}</p>
                    <div class="${tw`flex flex-wrap gap-2 p-2`}">
                        ${languages.split(",").map(language => {
            return `<span class="${tw`inline-flex items-center gap-2 rounded-full text-white font-bold bg-green-500 p-1 pr-2`}">
                            <span class="${tw`h-4 w-4 rounded-full bg-white`}"></span>
                            <span class="${tw`text-xs`}">${language}</span>
                        </span>`;
        }).join("")}
                    </div>
                </div>
            </section>`
    }).join("")}
        <div>
    </main>
    <footer class="${tw`bg-green-700 font-semibold text-white px-4`}">
      <div class="${tw`container mx-auto flex h-20 items-center justify-between`}">
        <p class="${tw`text-lg`}">${projectree.title}</p>
        <p class="${tw`text-lg`}">Designed by <a class="${tw`underline text-green-200 visited:text-green-300`}" href="https://www.projectree.net/">Projectree</a></p>
      </div>
    </footer>
    `;
}

function displayStandardSky(projectree) {
    return `
    <header>
      <div class="${tw`flex h-72 sm:h-96 items-center justify-center font-bold bg-blue-500 text-white`}">
        <h1 class="${tw`text-3xl sm:text-5xl text-center`}">${projectree.title}</h1>
      </div>
    </header>
    <main class="${tw`flex-grow bg-white`}">
        <div class="${tw`mx-auto container`}">
            ${projectree.projectItems.map(project_item => {
        const {
            name, description, languages, image, demoLink, sourceLink
        } = project_item;
        return `<section class="${tw`my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4`}">
                <div class="${tw`relative`}">
                    <div class="${tw`flex sm:h-96 flex-1 items-center justify-center overflow-hidden rounded-xl`}">
                        <img class="${tw`w-full rounded-xl`}" src="${image}" onerror="if (this.src != '/static/images/default_project_photo.png') this.src = '/static/images/default_project_photo.png';" alt="" />
                    </div>
                    <div class="${tw`absolute bottom-0 left-0 flex flex-wrap gap-2 p-2`}">
                        ${sourceLink ? `
                        <div class="${tw`overflow-hidden rounded-full`}">
                        <a target="_blank" href="${sourceLink}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </a>
                        </div>
                        ` : ""}
                        ${demoLink ? `
                        <div class="${tw`overflow-hidden rounded-full`}">
                        <a target="_blank" href="${demoLink}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </a>
                        </div>
                        ` : ""}
                    </div>
                    </div>
                    <div class="${tw`flex flex-col`}">
                    <h2 class="${tw`mb-6 text-3xl font-semibold`}">${name}</h2>
                    <p class="${tw`flex-grow whitespace-pre-line`}">${description}</p>
                    <div class="${tw`flex flex-wrap gap-2 p-2`}">
                        ${languages.split(",").map(language => {
            return `<span class="${tw`inline-flex items-center gap-2 rounded-full text-white font-bold bg-blue-400 p-1 pr-2`}">
                            <span class="${tw`h-4 w-4 rounded-full bg-white`}"></span>
                            <span class="${tw`text-xs`}">${language}</span>
                        </span>`;
        }).join("")}
                    </div>
                </div>
            </section>`
    }).join("")}
        <div>
    </main>
    <footer class="${tw`bg-blue-500 font-semibold text-white px-4`}">
      <div class="${tw`container mx-auto flex h-20 items-center justify-between`}">
        <p class="${tw`text-lg`}">${projectree.title}</p>
        <p class="${tw`text-lg`}">Designed by <a class="${tw`underline text-blue-50 visited:text-blue-200`}" href="https://www.projectree.net/">Projectree</a></p>
      </div>
    </footer>
    `;
}

function displayStandardOcean(projectree) {
    return `
    <header>
      <div class="${tw`flex h-72 sm:h-96 items-center justify-center font-bold bg-blue-900 text-white`}">
        <h1 class="${tw`text-3xl sm:text-5xl text-center`}">${projectree.title}</h1>
      </div>
    </header>
    <main class="${tw`flex-grow bg-blue-50`}">
        <div class="${tw`mx-auto container`}">
            ${projectree.projectItems.map(project_item => {
        const {
            name, description, languages, image, demoLink, sourceLink
        } = project_item;
        return `<section class="${tw`my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4`}">
                <div class="${tw`relative`}">
                    <div class="${tw`flex sm:h-96 flex-1 items-center justify-center overflow-hidden rounded-xl`}">
                        <img class="${tw`w-full rounded-xl`}" src="${image}" onerror="if (this.src != '/static/images/default_project_photo.png') this.src = '/static/images/default_project_photo.png';" alt="" />
                    </div>
                    <div class="${tw`absolute bottom-0 left-0 flex flex-wrap gap-2 p-2`}">
                        ${sourceLink ? `
                        <div class="${tw`overflow-hidden rounded-full`}">
                        <a target="_blank" href="${sourceLink}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </a>
                        </div>
                        ` : ""}
                        ${demoLink ? `
                        <div class="${tw`overflow-hidden rounded-full`}">
                        <a target="_blank" href="${demoLink}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </a>
                        </div>
                        ` : ""}
                    </div>
                    </div>
                    <div class="${tw`flex flex-col`}">
                    <h2 class="${tw`mb-6 text-3xl font-semibold`}">${name}</h2>
                    <p class="${tw`flex-grow whitespace-pre-line`}">${description}</p>
                    <div class="${tw`flex flex-wrap gap-2 p-2`}">
                        ${languages.split(",").map(language => {
            return `<span class="${tw`inline-flex items-center gap-2 rounded-full text-white font-bold bg-blue-800 p-1 pr-2`}">
                            <span class="${tw`h-4 w-4 rounded-full bg-white`}"></span>
                            <span class="${tw`text-xs`}">${language}</span>
                        </span>`;
        }).join("")}
                    </div>
                </div>
            </section>`
    }).join("")}
        <div>
    </main>
    <footer class="${tw`bg-blue-900 font-semibold text-white px-4`}">
      <div class="${tw`container mx-auto flex h-20 items-center justify-between`}">
        <p class="${tw`text-lg`}">${projectree.title}</p>
        <p class="${tw`text-lg`}">Designed by <a class="${tw`underline text-blue-200 visited:text-blue-400`}" href="https://www.projectree.net/">Projectree</a></p>
      </div>
    </footer>
    `;
}

export default {
    themes: {
        standard: "Standard",
        ["standard-rose"]: "Standard: Rose",
        ["standard-gold"]: "Standard: Gold",
        ["standard-clover"]: "Standard: Clover",
        ["standard-sky"]: "Standard: Sky",
        ["standard-ocean"]: "Standard: Ocean",
    },
    standard: displayStandard,
    ["standard-rose"]: displayStandardRose,
    ["standard-gold"]: displayStandardGold,
    ["standard-clover"]: displayStandardClover,
    ["standard-sky"]: displayStandardSky,
    ["standard-ocean"]: displayStandardOcean,
}