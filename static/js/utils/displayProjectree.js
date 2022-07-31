function displayStandard(projectree) {
    let html = `
<header>
  <div class="${tw`flex h-96 items-center justify-center font-bold bg-purple-700 text-white`}">
    <h1 class="${tw`text-5xl text-center`}">${projectree.title}</h1>
  </div>
</header>
<main class="${tw`container flex-grow mx-auto`}">
    ${projectree.project_items.map(project_item => {
        const {
            name, description, programming_language, image, demo_link, source_code
        } = project_item;
        return `<section class="${tw`my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4`}">
		<div class="${tw`relative`}">
			<div class="${tw`flex h-96 flex-1 items-center justify-center overflow-hidden rounded-xl`}">
				<img class="${tw`w-full rounded-xl`}" src="${image}" onerror="if (this.src != 'assets/default_project_photo.png') this.src = 'assets/default_project_photo.png';" alt="" />
			</div>
			<div class="${tw`absolute bottom-0 left-0 flex flex-wrap gap-2 p-2`}">
				${source_code ? `
				<div class="${tw`overflow-hidden rounded-full`}">
				<a target="_blank" href="${source_code}">
					<svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
					</svg>
				</a>
				</div>
				` : ""}
				${demo_link ? `
				<div class="${tw`overflow-hidden rounded-full`}">
				<a target="_blank" href="${demo_link}">
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
			<p class="${tw`flex-grow`}">${description}</p>
			<div class="${tw`flex flex-wrap gap-2 p-2`}">
				${programming_language.split(",").map(language => {
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
    return html;
}

export default {
    standard: displayStandard
}