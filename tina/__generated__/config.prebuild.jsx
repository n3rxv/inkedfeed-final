// tina/config.js
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "_site"
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "_site"
    }
  },
  fields: [
    {
      type: "string",
      name: "layout",
      label: "Layout"
    },
    {
      type: "string",
      name: "title",
      label: "Title",
      isTitle: true,
      required: true
    },
    {
      type: "datetime",
      name: "date",
      label: "Date",
      required: true
    },
    {
      type: "string",
      name: "excerpt",
      label: "Excerpt",
      ui: {
        component: "textarea"
      }
    },
    {
      type: "string",
      name: "image",
      label: "Image URL"
    },
    {
      type: "string",
      name: "heroImage",
      label: "Hero Image URL"
    },
    {
      type: "boolean",
      name: "rotator",
      label: "Rotator"
    },
    {
      type: "string",
      name: "specialTag",
      label: "Special Tags"
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true
    }
  ],
  schema: {
    collections: [
      {
        name: "post",
        label: "Blog Posts",
        path: "src/posts",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true
          },
          {
            type: "string",
            name: "author",
            label: "Author"
          },
          {
            type: "image",
            name: "image",
            label: "Featured Image"
          },
          {
            type: "string",
            name: "imageAlt",
            label: "Image Alt Text"
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
