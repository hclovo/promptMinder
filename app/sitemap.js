// app/sitemap.js
const URL = 'https://prompt-minder.com'; // Consider using process.env.NEXT_PUBLIC_BASE_URL

export default async function sitemap() {
  // Add other static routes here if needed, e.g., /terms, /privacy
  const staticRoutes = [
    '/',
    // '/terms',
    // '/privacy',
    // '/services',
    // '/sign-in',
    // '/sign-up',
  ].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // Example for dynamic routes (e.g., /prompts/[id]):
  // const prompts = await fetchAllPrompts(); // Your function to get all prompt data
  // const promptRoutes = prompts.map((prompt) => ({
  //   url: `${URL}/prompts/${prompt.id}`,
  //   lastModified: new Date(prompt.updatedAt).toISOString(),
  // }));

  // Example for dynamic routes (e.g., /tags/[slug]):
  // const tags = await fetchAllTags(); // Your function to get all tag data
  // const tagRoutes = tags.map((tag) => ({
  //   url: `${URL}/tags/${tag.slug}`,
  //   lastModified: new Date(tag.updatedAt).toISOString(), // Assuming tags have an update timestamp
  // }));


  return [
    ...staticRoutes,
    // ...promptRoutes,
    // ...tagRoutes,
  ];
} 