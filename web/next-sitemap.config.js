/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.jr.co.th",
  generateRobotsTxt: true, // (optional)
  exclude: ["/categories.xml", "/category-table"],
  robotsTxtOptions: {
    additionalSitemaps: ["https://www.jr.co.th/categories.xml"],
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "AhrefsBot",
        allow: ["/category-table"],
      },
    ],
  },
};
