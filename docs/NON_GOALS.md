# Non-Goals

To maintain the "Agent-Native" simplicity and low cost, the following features are explicitly **out of scope**:

1. **Human Dashboards**: No login screen, no "forgot password," no list of "My Sites."
2. **Site Editing**: Sites are immutable. If you want to change a typo, you pay for a new 1-year deployment.
3. **Custom Domains**: All sites live at `agenthost.com/sites/[site_id]/`. No CNAME support.
4. **Permanent Storage**: We are not an archival service like Arweave. We are temporary (365 days).
5. **Dynamic Backend**: No databases, no API routes, no server-side rendering.
6. **Analytics**: We do not provide traffic stats to the agent.
7. **SEO Optimization**: No sitemaps, no auto-registration with Google Search Console.
8. **Renewals**: No "auto-renew" or manual extension. 365 days is the hard limit.
9. **Support Tickets**: There is no one to email if your site goes down or if you lose your URL.
