# @enginehost/site-assistant

Shared assistant UI and server route helpers for EngineHost sites.

Each site provides a fixed slug, HTTPS domain, backend URL, and server-only
assistant key. The package never accepts a browser-supplied tenant slug.

~~~ts
import { createSiteAssistantConfig } from '@enginehost/site-assistant'

const config = createSiteAssistantConfig({
  slug: 'zheep',
  domain: 'zheep.com',
  apiBaseUrl: 'https://dashboard.zheep.com',
})
~~~

Use createAssistantRoute(config, { apiKey: process.env.SITE_API_KEY }) from a
same-origin Next.js route and render AssistantWidget({ config }) in the site
layout.
