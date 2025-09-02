import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Haoyuehxの Docs Lib",
  tagline: "Dinosaurs are cool",
  //   favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://docs.haoyuehx.dpdns.org/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "my-docs", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["en", "zh-Hans"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // 启用文档描述和更新信息
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "test", // Give the new docs instance a unique ID
        path: "test", // The directory where your API docs markdown files will live
        routeBasePath: "test", // The base path for your API docs on the website
        sidebarPath: require.resolve("./sidebars.ts"), // The sidebar file for these docs
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "project1", // Give the new docs instance a unique ID
        path: "project1", // The directory where your API docs markdown files will live
        routeBasePath: "project1", // The base path for your API docs on the website
        sidebarPath: require.resolve("./sidebars.ts"), // The sidebar file for these docs
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    // image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Haoyuehx docs",
    //   logo: {
    //     alt: "My Site Logo",
    //     src: "img/logo.svg",
    //   },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Tutorial",
        },

        // // Add a new navbar item for your API docs
        // {
        //     type: 'doc', // Note: For a multi-instance doc link, you use the 'doc' type
        //     docId: 'intro', // This is the ID of the file you want to link to (e.g., 'intro.md')
        //     docsPluginId: 'api', // The ID of the docs instance you're linking to
        //     label: 'API Docs',
        //     position: 'left',
        // },

        {
          href: "https://blog.haoyuehx.dpdns.org/",
          label: "Blog",
          position: "right",
        },
        {
          href: "https://github.com/Haoyuehexi",
          label: "GitHub",
          position: "right",
        },
        {
          type: "search",
          position: "right",
        },
      ],
    },
    footer: {
      style: "light",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Tutorial",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/docusaurus",
            },
            {
              label: "Discord",
              href: "https://discordapp.com/invite/docusaurus",
            },
            {
              label: "X",
              href: "https://x.com/docusaurus",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              href: "https://blog.haoyuehx.dpdns.org/",
            },
            {
              label: "GitHub",
              href: "https://github.com/Haoyuehexi",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
