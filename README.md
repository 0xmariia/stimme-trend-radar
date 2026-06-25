# Stimme Trend Radar

Stimme Trend Radar is a product concept for helping local newsrooms understand what younger audiences care about and turn those insights into formats they actually want to read, save, and share.

The prototype is designed around Heilbronner Stimme and focuses on readers between 20 and 35 years old in the Heilbronn region. It shows how an editorial team could move from trend discovery to article validation to content creation in one workflow.

## Live Demo

Open the deployed prototype here:

https://stimme-trend-radar.vercel.app/

## Product Idea

Local newsrooms often know what they want to cover, but it is harder to know which topics will feel relevant to younger readers before an article is published. Stimme Trend Radar acts like an editorial decision-support tool: it gives the team a clearer view of local signals, explains why a topic matters, and helps adapt the story into youth-friendly formats.

The goal is not to replace editorial judgment. The goal is to make editorial decisions easier to explain, faster to test, and more connected to audience needs.

## Core Workflow

### 1. Discover Local Trends

The Radar section highlights current local topics such as housing, events, mobility, mental health, jobs, and nightlife. Each topic includes:

- A short editorial summary
- Audience fit for younger readers
- Week-over-week growth
- Trusted source links
- A quick view of which themes are gaining attention

This helps the newsroom decide what is worth covering now and why.

### 2. Validate an Article Draft

The Analyzer section checks whether an article draft is strong for the target audience. The score is based on realistic editorial criteria:

- Target-group relevance
- Local service value
- Text clarity
- Timeliness

The tool also gives a short recommendation, for example which information should appear earlier in the article to make it more useful and shareable.

### 3. Create Audience-Friendly Output

The Creator section shows how a selected story can be transformed into an Instagram carousel concept. Instead of only publishing a long article, the newsroom gets a format that can work better for discovery, saves, and mobile reading.

In the current demo, the story is about the Heilbronner Lichterfest and the generated carousel focuses on practical and visual information: what is happening, when it happens, why it is worth attending, and what readers should save.

## Why It Matters

Younger audiences often do not enter local journalism through the homepage first. They discover stories through mobile feeds, social formats, recommendations, and quick visual summaries. For a local publisher, this means the story itself is only one part of the product. The packaging, timing, format, and usefulness also matter.

Stimme Trend Radar demonstrates how a newsroom could:

- Identify promising local stories earlier
- Explain why a topic is relevant to younger readers
- Improve drafts before publishing
- Turn articles into mobile-first formats
- Build a clearer bridge between editorial planning and audience development

## Demo Scope

This is a prototype, not a live analytics platform. The data is modeled to feel realistic for the Heilbronn region and to demonstrate how the product would work in practice. Source links are included so the trend cards can be explained with trusted public references rather than social media screenshots.

## Running Locally

The deployed link above is enough to use the prototype. These commands are only needed for local development.

Install dependencies:

```bash
npm install
```

Start the project:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```
