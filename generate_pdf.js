const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Codelingo Frontend Architecture & Component Guide</title>
  <style>
    @page {
      size: letter;
      margin: 14mm 14mm 14mm 14mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      font-size: 9.5pt;
      line-height: 1.45;
    }

    .cover-page {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 90vh;
      padding: 20px 8px;
    }

    .cover-header {
      border-bottom: 4px solid #e52e2e;
      padding-bottom: 20px;
    }

    .badge-pill {
      display: inline-block;
      padding: 4px 12px;
      font-size: 8pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      border-radius: 9999px;
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
      margin-bottom: 10px;
    }

    .cover-title {
      font-size: 32pt;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 8px;
    }

    .cover-title span {
      color: #e52e2e;
    }

    .cover-subtitle {
      font-size: 13pt;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 16px;
    }

    .cover-meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 20px;
    }

    .meta-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 14px;
    }

    .meta-label {
      font-size: 7.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      margin-bottom: 4px;
    }

    .meta-value {
      font-size: 10pt;
      font-weight: 700;
      color: #1e293b;
    }

    .cover-summary {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #f8fafc;
      border-radius: 16px;
      padding: 22px;
      margin-top: 20px;
    }

    .cover-summary h3 {
      font-size: 11pt;
      font-weight: 800;
      color: #f87171;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 6px;
    }

    .cover-summary p {
      font-size: 9pt;
      line-height: 1.55;
      color: #cbd5e1;
    }

    .cover-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8pt;
      color: #64748b;
      font-weight: 600;
    }

    /* Section Styles */
    .section {
      margin-bottom: 22px;
    }

    .section-break {
      page-break-before: always;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
      margin-bottom: 12px;
      margin-top: 8px;
    }

    .section-number {
      background: #e52e2e;
      color: #ffffff;
      font-size: 8.5pt;
      font-weight: 900;
      width: 22px;
      height: 22px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .section-title {
      font-size: 14pt;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.02em;
    }

    h3 {
      font-size: 10.5pt;
      font-weight: 800;
      color: #1e293b;
      margin-top: 12px;
      margin-bottom: 6px;
    }

    p {
      margin-bottom: 8px;
      color: #334155;
      font-size: 9pt;
    }

    /* Grid & Cards */
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 12px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 12px;
    }

    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 12px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .card-title {
      font-size: 9.5pt;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .card-desc {
      font-size: 8pt;
      color: #64748b;
      line-height: 1.4;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px 0;
      font-size: 8pt;
    }

    thead {
      display: table-header-group;
    }

    tr {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    th {
      background: #f1f5f9;
      color: #475569;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 7pt;
      letter-spacing: 0.05em;
      padding: 6px 8px;
      text-align: left;
      border-top: 1px solid #cbd5e1;
      border-bottom: 2px solid #cbd5e1;
    }

    td {
      padding: 6px 8px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
      color: #334155;
    }

    tr:nth-child(even) td {
      background: #fafafa;
    }

    .tag {
      display: inline-block;
      padding: 1.5px 5px;
      border-radius: 4px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 7pt;
      font-weight: 700;
      background: #f1f5f9;
      color: #0f172a;
      border: 1px solid #e2e8f0;
    }

    .tag-red { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
    .tag-green { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }
    .tag-amber { background: #fffbeb; color: #d97706; border-color: #fde68a; }
    .tag-blue { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
    .tag-purple { background: #faf5ff; color: #9333ea; border-color: #e9d5ff; }

    /* Code blocks */
    pre, code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    .code-box {
      background: #0f172a;
      color: #f8fafc;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 7.5pt;
      margin: 6px 0;
      overflow-x: auto;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Progress simulation */
    .progress-bar-container {
      height: 10px;
      background: #e2e8f0;
      border-radius: 9999px;
      overflow: hidden;
      margin: 4px 0;
    }

    .progress-bar-fill {
      height: 100%;
      border-radius: 9999px;
    }

    .legend-row {
      display: flex;
      justify-content: space-between;
      font-size: 7pt;
      font-weight: 700;
      color: #64748b;
      margin-top: 3px;
    }

    .highlight-box {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 8px 10px;
      border-radius: 0 8px 8px 0;
      margin: 8px 0;
      font-size: 8pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .highlight-box.alert {
      background: #fef2f2;
      border-left-color: #ef4444;
    }

    .highlight-box.success {
      background: #ecfdf5;
      border-left-color: #10b981;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-page">
    <div class="cover-header">
      <div class="badge-pill">Codelingo System Documentation • Dev Branch</div>
      <h1 class="cover-title">Code<span>lingo</span></h1>
      <div class="cover-subtitle">Complete Frontend Architecture, UI Component Directory & System Specification</div>
    </div>

    <div class="cover-summary">
      <h3>Executive Summary</h3>
      <p>
        Codelingo is a Duolingo-inspired, gamified programming education web application. It combines adaptive AI pedagogical coaching (featuring <strong>Louis the Cardinal</strong>), real-time CodeMirror interactive coding sandboxes, psychometric learner mode branching (Swell integration), and a Duolingo-style staggered learning path. This document provides an exhaustive, production-grade technical inventory of every page, component, progression algorithm, API integration, and design token operating on the <strong>dev</strong> branch.
      </p>
    </div>

    <div class="cover-meta-grid">
      <div class="meta-card">
        <div class="meta-label">Git Branch & Status</div>
        <div class="meta-value">dev (Tracking origin/dev)</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">Latest Commit</div>
        <div class="meta-value">ca3abc4 (Path layout & icons fix)</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">Framework & Runtime</div>
        <div class="meta-value">React 19.2 • Vite 8.3 • TypeScript 6.0</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">Styling & UI Primitives</div>
        <div class="meta-value">Tailwind CSS v4 • Framer Motion v13 • CodeMirror 6</div>
      </div>
    </div>

    <div class="cover-footer">
      <div>Codelingo Web Application • Frontend Engineering Reference</div>
      <div>Confidential & Proprietary</div>
    </div>
  </div>

  <!-- TABLE OF CONTENTS -->
  <div class="section section-break">
    <div class="section-header">
      <div class="section-number">#</div>
      <div class="section-title">Table of Contents</div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 15%;">Section</th>
          <th style="width: 48%;">Topic</th>
          <th style="width: 37%;">Key Elements</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Section 1</strong></td>
          <td><strong>Executive Architecture & Tech Stack</strong></td>
          <td>React 19, TypeScript, Tailwind v4, TanStack Query, Framer Motion</td>
        </tr>
        <tr>
          <td><strong>Section 2</strong></td>
          <td><strong>Application Routing & Screen Hierarchy</strong></td>
          <td>LearnPage (/learn), LessonPage (/lesson/:lang/:id), CompletePage (/complete)</td>
        </tr>
        <tr>
          <td><strong>Section 3</strong></td>
          <td><strong>Complete UI Component Directory</strong></td>
          <td>Navigation, Layout, Path, Exercises, Gamification, Mascot, Auth</td>
        </tr>
        <tr>
          <td><strong>Section 4</strong></td>
          <td><strong>Louis Mascot & Adaptive Psychometrics</strong></td>
          <td>Louis Coach 4 Moods, Swell Personas, Adaptive Mode Renderers</td>
        </tr>
        <tr>
          <td><strong>Section 5</strong></td>
          <td><strong>Progression Engine & Dynamic Red-to-Green System</strong></td>
          <td>ProgressRecord, 5-stage Color Gradient, Milestones, All-Tracks Overview</td>
        </tr>
        <tr>
          <td><strong>Section 6</strong></td>
          <td><strong>Curriculum Engine & Supported Languages</strong></td>
          <td>8 Language Tracks, 10 Progressive Lessons, Dedicated Icons & Syntax Tags</td>
        </tr>
        <tr>
          <td><strong>Section 7</strong></td>
          <td><strong>State Management, API Client & Mock Layer</strong></td>
          <td>TanStack Query hooks, Fallback Mock Engine, ThemeContext (Dark Mode)</td>
        </tr>
        <tr>
          <td><strong>Section 8</strong></td>
          <td><strong>Source Code File Matrix</strong></td>
          <td>Full inventory of all files under src/ with line counts and export APIs</td>
        </tr>
      </tbody>
    </table>

    <div class="highlight-box success">
      <strong>Core Frontend Philosophy:</strong> The Codelingo frontend is designed around zero-friction micro-learning. Every exercise is chunked into 2-5 minute interactions, immediately verified via CodeMirror and regex evaluators, with continuous positive reinforcement delivered through animated streak fire, XP gains, and Louis the Cardinal reactions.
    </div>
  </div>

  <!-- SECTION 1: TECH STACK & ARCHITECTURE -->
  <div class="section">
    <div class="section-header">
      <div class="section-number">1</div>
      <div class="section-title">Executive Architecture & Tech Stack</div>
    </div>

    <p>
      The Codelingo client is a Single Page Application (SPA) built on Vite and React 19. It uses modern declarative state patterns, hardware-accelerated animations, and dark/light system theme sync.
    </p>

    <div class="grid-2">
      <div class="card">
        <div class="card-title">
          <span>Core UI Foundation</span>
          <span class="tag tag-blue">React 19.2</span>
        </div>
        <div class="card-desc">
          High-concurrency React 19 utilizing client-side routing with <code>react-router-dom v7</code>. Component state is clean, modular, and leverages custom hooks for theme and responsive layouts.
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          <span>Server State & Cache</span>
          <span class="tag tag-red">TanStack Query v5</span>
        </div>
        <div class="card-desc">
          Asynchronous data fetching, automatic background revalidation, query invalidation upon code evaluation, and seamless fallback to local mock data if the API backend is unreachable.
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          <span>Interactive Code Editor</span>
          <span class="tag tag-purple">CodeMirror 6</span>
        </div>
        <div class="card-desc">
          Powered by <code>@uiw/react-codemirror</code> with language extensions for Python and JavaScript/TypeScript. Features dark syntax themes, gutter line numbers, and active line glow.
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          <span>Micro-Interactions & FX</span>
          <span class="tag tag-amber">Framer Motion & Confetti</span>
        </div>
        <div class="card-desc">
          Fluid physics-based spring animations for Louis the Cardinal mascot, expandable progress accordions, pulsating nodes, and multi-particle dual-cannon canvas fireworks upon lesson completion.
        </div>
      </div>
    </div>

    <h3>Technology Inventory</h3>
    <table>
      <thead>
        <tr>
          <th>Package / Technology</th>
          <th>Version</th>
          <th>Primary Role in Frontend</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>react</code> & <code>react-dom</code></td>
          <td>^19.2.8</td>
          <td>Application component hierarchy, hooks, and DOM mounting</td>
        </tr>
        <tr>
          <td><code>react-router-dom</code></td>
          <td>^7.18.3</td>
          <td>Client routes: <code>/learn</code>, <code>/lesson/:lang/:id</code>, <code>/complete</code></td>
        </tr>
        <tr>
          <td><code>@tanstack/react-query</code></td>
          <td>^5.102.8</td>
          <td>Server state caching, mutation triggers, and optimistic UI refetching</td>
        </tr>
        <tr>
          <td><code>tailwindcss</code> & <code>@tailwindcss/vite</code></td>
          <td>^4.3.3</td>
          <td>Next-generation utility CSS engine with native dark-mode selectors</td>
        </tr>
        <tr>
          <td><code>@uiw/react-codemirror</code></td>
          <td>^4.25.11</td>
          <td>Embedded multi-language IDE code editor widget</td>
        </tr>
        <tr>
          <td><code>framer-motion</code></td>
          <td>^13.2.0</td>
          <td>Declarative layout animations, mascot emotions, modal transitions</td>
        </tr>
        <tr>
          <td><code>lucide-react</code></td>
          <td>^1.45.0</td>
          <td>High-clarity SVG icon library for lesson topics, tracks, and UI controls</td>
        </tr>
        <tr>
          <td><code>canvas-confetti</code></td>
          <td>^1.9.4</td>
          <td>Celebration confetti particle explosions on correct solutions</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- SECTION 2: APPLICATION ROUTING & PAGES -->
  <div class="section section-break">
    <div class="section-header">
      <div class="section-number">2</div>
      <div class="section-title">Application Routing & Screen Hierarchy</div>
    </div>

    <p>
      The application operates on three primary views connected via <code>react-router-dom</code>. Each page is designed for high accessibility, responsive mobile-to-desktop scaling, and zero layout shift.
    </p>

    <div class="card" style="margin-bottom: 10px;">
      <div class="card-title">
        <span>1. Learn Page (Dashboard / Track Navigator)</span>
        <span class="tag tag-blue">Route: /learn</span>
      </div>
      <div class="card-desc">
        <p>
          The central hub where users select their active language, view their learning path, inspect their gamification statistics, and launch lessons.
        </p>
        <ul style="padding-left: 16px; font-size: 8pt; color: #475569; line-height: 1.5;">
          <li><strong>Top Course Banner:</strong> Displays active programming language label, total percentage, and lesson progress counter.</li>
          <li><strong>Swell Personality Badge:</strong> Summarizes user's active cognitive trait (e.g. ANALYTICAL) and fit score (e.g. 88%).</li>
          <li><strong>Louis Coach Greeting:</strong> Warm mascot welcome with personalized message matching user profile.</li>
          <li><strong>Duolingo-Style Learning Path:</strong> Staggered alternating 2-column lesson nodes with central connected progress line.</li>
          <li><strong>Side Sticky Progress Column:</strong> Houses the interactive <code>ProgressRecord</code> with dynamic red-to-green meter.</li>
        </ul>
      </div>
    </div>

    <div class="card" style="margin-bottom: 10px;">
      <div class="card-title">
        <span>2. Lesson Page (Interactive Learning & Sandbox)</span>
        <span class="tag tag-amber">Route: /lesson/:language/:lessonId</span>
      </div>
      <div class="card-desc">
        <p>
          The core pedagogical sandbox where the user learns concepts and solves programming exercises.
        </p>
        <ul style="padding-left: 16px; font-size: 8pt; color: #475569; line-height: 1.5;">
          <li><strong>Sticky Header:</strong> Animated <code>LessonProgressBar</code> (0% &rarr; 50% &rarr; 100%) and <code>ThemeToggle</code>.</li>
          <li><strong>Lesson Topic Header:</strong> Shows language badge, lesson number out of 10, and topic icon (e.g., GitBranch for Conditions).</li>
          <li><strong>Demo Personality Switcher:</strong> Quick switcher bar enabling judges to test Analytical, Practical, and Visual modes in real time.</li>
          <li><strong>Adaptive Exercise Engine:</strong> Renders <code>DEEP_EXPLANATION</code> (ConceptCard + CodeMirror), <code>PRACTICE_FIRST</code> (Fill-in-the-Blank), or <code>VISUAL_GUIDED</code> (Flowchart + Guided Fill).</li>
          <li><strong>Bottom Action Sheet (FeedbackCard):</strong> Fixed bottom tray providing Check, Try Again, and Continue triggers with diagnostic error feedback.</li>
        </ul>
      </div>
    </div>

    <div class="card">
      <div class="card-title">
        <span>3. Complete Page (Milestone Celebration)</span>
        <span class="tag tag-green">Route: /complete</span>
      </div>
      <div class="card-desc">
        <p>
          High-dopamine payoff screen triggered upon completing an exercise.
        </p>
        <ul style="padding-left: 16px; font-size: 8pt; color: #475569; line-height: 1.5;">
          <li><strong>Dual-Cannon Fireworks:</strong> Automatic celebration confetti bursts from both left and right screen margins.</li>
          <li><strong>Giant Celebrating Mascot:</strong> Louis the Cardinal jumping with floating party poppers (🎉) and sparkles (✨).</li>
          <li><strong>Stat Cards:</strong> Animated Flame Daily Streak (+1 day) and Lightning XP Reward (+10 XP) cards.</li>
          <li><strong>Continue CTA:</strong> Primary button navigating the learner back to the updated learning path.</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- SECTION 3: COMPONENT CATALOG -->
  <div class="section section-break">
    <div class="section-header">
      <div class="section-number">3</div>
      <div class="section-title">Complete UI Component Directory</div>
    </div>

    <p>
      The frontend codebase is organized into atomic, highly reusable components in <code>src/components/</code>:
    </p>

    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Component</th>
          <th>File Location</th>
          <th>Primary Functionality</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td rowspan="4"><strong>Layout & Navigation</strong></td>
          <td><code>AppShell</code></td>
          <td><code>components/layout/AppShell.tsx</code></td>
          <td>Root layout wrapper managing header, content max-width, and padding</td>
        </tr>
        <tr>
          <td><code>TopNavigation</code></td>
          <td><code>components/navigation/TopNavigation.tsx</code></td>
          <td>Sticky brand header with logo, course selector, badges, and account CTA</td>
        </tr>
        <tr>
          <td><code>CourseSelector</code></td>
          <td><code>components/navigation/CourseSelector.tsx</code></td>
          <td>Dropdown menu to switch between 8 programming languages across 4 categories</td>
        </tr>
        <tr>
          <td><code>ThemeToggle</code></td>
          <td><code>components/navigation/ThemeToggle.tsx</code></td>
          <td>Button toggling dark and light mode with sun/moon icon animations</td>
        </tr>
        <tr>
          <td rowspan="2"><strong>Learning Path</strong></td>
          <td><code>LearningPath</code></td>
          <td><code>components/path/LearningPath.tsx</code></td>
          <td>Zigzag 2-column progression tree with central connector progress bar</td>
        </tr>
        <tr>
          <td><code>LessonNode</code></td>
          <td><code>components/path/LessonNode.tsx</code></td>
          <td>Circular button node with completed, current (pulse ring), and locked states</td>
        </tr>
        <tr>
          <td rowspan="5"><strong>Lesson Sandbox</strong></td>
          <td><code>CodeExercise</code></td>
          <td><code>components/lesson/CodeExercise.tsx</code></td>
          <td>CodeMirror IDE editor with syntax highlighting, gutter, and starter code</td>
        </tr>
        <tr>
          <td><code>FillBlankExercise</code></td>
          <td><code>components/lesson/FillBlankExercise.tsx</code></td>
          <td>Interactive code snippet with inline blank text input and error shake</td>
        </tr>
        <tr>
          <td><code>ConceptCard</code></td>
          <td><code>components/lesson/ConceptCard.tsx</code></td>
          <td>Card rendering technical concept explanations, bullets, and visual flowcharts</td>
        </tr>
        <tr>
          <td><code>FeedbackCard</code></td>
          <td><code>components/lesson/FeedbackCard.tsx</code></td>
          <td>Sticky bottom tray displaying check button, validation state, and feedback text</td>
        </tr>
        <tr>
          <td><code>LessonProgressBar</code></td>
          <td><code>components/lesson/LessonProgressBar.tsx</code></td>
          <td>Top horizontal progress bar tracking lesson completion percentage</td>
        </tr>
        <tr>
          <td rowspan="6"><strong>Gamification & AI</strong></td>
          <td><code>LouisCoach</code></td>
          <td><code>components/louis/LouisCoach.tsx</code></td>
          <td>Mascot widget with 4 mood states, bouncing animations, and speech bubbles</td>
        </tr>
        <tr>
          <td><code>ProgressRecord</code></td>
          <td><code>components/gamification/ProgressRecord.tsx</code></td>
          <td>Side card with dynamic red-to-green progress bar, milestones, and all tracks</td>
        </tr>
        <tr>
          <td><code>StreakBadge</code></td>
          <td><code>components/gamification/StreakBadge.tsx</code></td>
          <td>Pill badge showing active flame streak count with pop animation</td>
        </tr>
        <tr>
          <td><code>XpBadge</code></td>
          <td><code>components/gamification/XpBadge.tsx</code></td>
          <td>Pill badge showing accumulated XP points with lightning bolt</td>
        </tr>
        <tr>
          <td><code>PersonalityBadge</code></td>
          <td><code>components/personality/PersonalityBadge.tsx</code></td>
          <td>Pill displaying learner psychometric trait, learning mode, and score</td>
        </tr>
        <tr>
          <td><code>DemoPersonalitySwitch</code></td>
          <td><code>components/demo/DemoPersonalitySwitch.tsx</code></td>
          <td>Floating quick switcher for live demonstrations of adaptive modes</td>
        </tr>
        <tr>
          <td><strong>Auth & Profile</strong></td>
          <td><code>CreateAccountModal</code></td>
          <td><code>components/auth/CreateAccountModal.tsx</code></td>
          <td>Registration dialog with name, email, password, and instant account creation</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- SECTION 4: LOUIS COACH & PSYCHOMETRICS -->
  <div class="section section-break">
    <div class="section-header">
      <div class="section-number">4</div>
      <div class="section-title">Louis Mascot & Adaptive Psychometrics</div>
    </div>

    <p>
      Codelingo's signature feature is <strong>Louis the Cardinal</strong>, an interactive AI pedagogical coach paired with Swell psychometric cognitive analysis. Louis provides contextual, emotionally intelligent feedback at every stage.
    </p>

    <div class="grid-2">
      <div class="card">
        <div class="card-title">
          <span>Louis Coach Mascot States</span>
          <span class="tag tag-red">LouisMood</span>
        </div>
        <div class="card-desc">
          <ul style="padding-left: 16px; font-size: 8pt; line-height: 1.55;">
            <li><strong>idle:</strong> Subtle vertical hovering motion (2.6s loop) while learner browses.</li>
            <li><strong>thinking:</strong> Head-tilt rotation with floating lightbulb overlay (💡?) during deep explanations.</li>
            <li><strong>encouraging:</strong> Gentle breathing pulse with motivational tips before submission.</li>
            <li><strong>celebrating:</strong> Energetic bouncing jump (y: -16px, rotate: ±6°), with party popper (🎉) and sparkle (✨) particles.</li>
          </ul>
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          <span>Dynamic Speech Bubble</span>
          <span class="tag tag-blue">Framer Motion</span>
        </div>
        <div class="card-desc">
          Features an authentic pointing triangular arrow anchored directly to Louis's beak. Whenever Louis's message updates, the bubble performs a smooth fade-and-slide micro-transition (opacity: 0 &rarr; 1, y: 6 &rarr; 0) preventing jarring text jumps.
        </div>
      </div>
    </div>

    <h3>Swell Psychometric Learner Modes</h3>
    <p>
      Depending on the user's cognitive profile, the lesson dynamically restructures its presentation mode:
    </p>

    <table>
      <thead>
        <tr>
          <th>Trait</th>
          <th>Mode Key</th>
          <th>Pedagogical Strategy</th>
          <th>Rendered Component Flow</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="tag tag-blue">ANALYTICAL</span></td>
          <td><code>DEEP_EXPLANATION</code></td>
          <td>Theory first, rigorous syntax rules, step-by-step logic breakdown</td>
          <td><code>ConceptCard</code> (in-depth) &rarr; <code>CodeExercise</code> (Full CodeMirror)</td>
        </tr>
        <tr>
          <td><span class="tag tag-amber">PRACTICAL</span></td>
          <td><code>PRACTICE_FIRST</code></td>
          <td>Immediate hands-on challenge, minimal reading, trial-and-error</td>
          <td>Immediate <code>FillBlankExercise</code> &rarr; Instant execution feedback</td>
        </tr>
        <tr>
          <td><span class="tag tag-purple">VISUAL</span></td>
          <td><code>VISUAL_GUIDED</code></td>
          <td>Flowcharts, step-by-step visual logic diagrams, color cues</td>
          <td><code>ConceptCard</code> (Flowchart steps) &rarr; Guided <code>FillBlankExercise</code></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- SECTION 5: PROGRESSION ENGINE & RED-TO-GREEN -->
  <div class="section section-break">
    <div class="section-header">
      <div class="section-number">5</div>
      <div class="section-title">Progression Engine & Red-to-Green Dynamic System</div>
    </div>

    <p>
      Codelingo features a custom-engineered <strong>Dynamic Red-to-Green Color Progression Engine</strong> located in <code>ProgressRecord.tsx</code>. As the user completes lessons, the UI's progress bars, badges, and mastery indicators smoothly transition from crimson novice red to vibrant emerald mastery green.
    </p>

    <div class="card" style="margin-bottom: 12px;">
      <div class="card-title">
        <span>Progress Tier & Color Transition Scale</span>
        <span class="tag tag-green">Interpolated Gradient</span>
      </div>
      <div class="card-desc">
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: 100%; background: linear-gradient(90deg, #ef4444 0%, #f97316 25%, #f59e0b 50%, #84cc16 75%, #10b981 100%);"></div>
        </div>
        <div class="legend-row">
          <span style="color: #ef4444;">0-20% Novice (Crimson)</span>
          <span style="color: #f97316;">20-40% Apprentice (Orange)</span>
          <span style="color: #f59e0b;">40-60% Intermediate (Amber)</span>
          <span style="color: #84cc16;">60-80% Proficient (Lime)</span>
          <span style="color: #10b981;">80-100% Mastered (Emerald)</span>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-title">
          <span>Gradient Engine Formula</span>
          <span class="tag tag-purple">ProgressRecord.tsx</span>
        </div>
        <div class="card-desc">
          <pre class="code-box">const getProgressColor = (percent: number) => {
  if (percent >= 80) return "#10b981"; // Emerald
  if (percent >= 60) return "#84cc16"; // Lime
  if (percent >= 40) return "#f59e0b"; // Amber
  if (percent >= 20) return "#f97316"; // Orange
  return "#ef4444"; // Crimson Red
};</pre>
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          <span>Earned Milestones System</span>
          <span class="tag tag-amber">4 Core Badges</span>
        </div>
        <div class="card-desc">
          <ul style="padding-left: 14px; font-size: 8pt; line-height: 1.55;">
            <li><strong>First Steps:</strong> Unlocked upon completing 1st lesson (CheckCircle2 icon).</li>
            <li><strong>Flame Keeper:</strong> Maintained a 4+ day streak (Flame icon).</li>
            <li><strong>Centurion XP:</strong> Earned over 100 XP points (Zap lightning icon).</li>
            <li><strong>Polyglot Coder:</strong> Explored 3 or more tracks (Trophy icon).</li>
          </ul>
        </div>
      </div>
    </div>

    <h3>All Tracks Overview Grid</h3>
    <p>
      The bottom of <code>ProgressRecord</code> contains a compact 2x4 card grid tracking real-time completion across all 8 languages, complete with language icons and independent mini red-to-green progress bars.
    </p>
  </div>

  <!-- SECTION 6: CURRICULUM & SUPPORTED LANGUAGES -->
  <div class="section section-break">
    <div class="section-header">
      <div class="section-number">6</div>
      <div class="section-title">Curriculum Engine & Supported Languages</div>
    </div>

    <p>
      Codelingo supports 8 premier programming languages grouped into 4 distinct developer career tracks:
    </p>

    <table>
      <thead>
        <tr>
          <th>Track</th>
          <th>Badge</th>
          <th>Category</th>
          <th>Accent Color</th>
          <th>Curriculum Focus</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>C#</strong></td>
          <td><span class="tag tag-purple">C#</span></td>
          <td>Enterprise</td>
          <td><code>#9333EA</code></td>
          <td>Enterprise backend & game development with C# .NET</td>
        </tr>
        <tr>
          <td><strong>JavaScript</strong></td>
          <td><span class="tag tag-amber">JS</span></td>
          <td>Web & Frontend</td>
          <td><code>#F59E0B</code></td>
          <td>Web frontend, dynamic scripting & full-stack Node.js</td>
        </tr>
        <tr>
          <td><strong>TypeScript</strong></td>
          <td><span class="tag tag-blue">TS</span></td>
          <td>Web & Frontend</td>
          <td><code>#2563EB</code></td>
          <td>Type-safe modern web, large-scale apps & APIs</td>
        </tr>
        <tr>
          <td><strong>Python</strong></td>
          <td><span class="tag tag-blue">Py</span></td>
          <td>Popular</td>
          <td><code>#3B82F6</code></td>
          <td>Data science, AI scripting & readable backend logic</td>
        </tr>
        <tr>
          <td><strong>Rust</strong></td>
          <td><span class="tag tag-red">Rs</span></td>
          <td>Systems & Cloud</td>
          <td><code>#EA580C</code></td>
          <td>Ultra-fast systems programming, memory safety & WASM</td>
        </tr>
        <tr>
          <td><strong>Go (Golang)</strong></td>
          <td><span class="tag tag-blue">Go</span></td>
          <td>Systems & Cloud</td>
          <td><code>#06B6D4</code></td>
          <td>Microservices, cloud infrastructure & high concurrency</td>
        </tr>
        <tr>
          <td><strong>C++</strong></td>
          <td><span class="tag tag-blue">C++</span></td>
          <td>Systems & Cloud</td>
          <td><code>#1D4ED8</code></td>
          <td>Game engines, graphics, low latency & performance</td>
        </tr>
        <tr>
          <td><strong>Java</strong></td>
          <td><span class="tag tag-red">☕</span></td>
          <td>Enterprise</td>
          <td><code>#DC2626</code></td>
          <td>Enterprise architecture, Spring Boot & Android apps</td>
        </tr>
      </tbody>
    </table>

    <h3>10-Stage Progressive Lesson Templates</h3>
    <table>
      <thead>
        <tr>
          <th>Stage #</th>
          <th>Lesson ID</th>
          <th>Title</th>
          <th>Syntax Tag</th>
          <th>Topic & Concept Covered</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1</td><td><code>hello</code></td><td>1. Hello World</td><td><code>&gt;_</code></td><td>Console I/O, syntax basics, entry points</td></tr>
        <tr><td>2</td><td><code>variables</code></td><td>2. Variables & Types</td><td><code>var</code></td><td>Constants, primitive types, memory allocation</td></tr>
        <tr><td>3</td><td><code>conditions</code></td><td>3. Conditions</td><td><code>if</code></td><td>Boolean logic gates, if/else branch control</td></tr>
        <tr><td>4</td><td><code>functions</code></td><td>4. Functions</td><td><code>fn()</code></td><td>Parameters, return types, functional scope</td></tr>
        <tr><td>5</td><td><code>loops</code></td><td>5. Loops & Iteration</td><td><code>for</code></td><td>While, for-in, repetition and break guards</td></tr>
        <tr><td>6</td><td><code>arrays</code></td><td>6. Arrays & Slices</td><td><code>[ ]</code></td><td>Collections, zero-indexing, dynamic slices</td></tr>
        <tr><td>7</td><td><code>oop</code></td><td>7. Structs & Classes</td><td><code>class</code></td><td>Object modeling, encapsulation, constructors</td></tr>
        <tr><td>8</td><td><code>async</code></td><td>8. Async & Concurrency</td><td><code>async</code></td><td>Tasks, promises, coroutines, thread safety</td></tr>
        <tr><td>9</td><td><code>errors</code></td><td>9. Error Handling</td><td><code>try</code></td><td>Try/catch, Result types, panic recovery</td></tr>
        <tr><td>10</td><td><code>generics</code></td><td>10. Generics & Traits</td><td><code>&lt;T&gt;</code></td><td>Type parameters, protocols, interfaces, reuse</td></tr>
      </tbody>
    </table>
  </div>

  <!-- SECTION 7: STATE MANAGEMENT & API CLIENT -->
  <div class="section section-break">
    <div class="section-header">
      <div class="section-number">7</div>
      <div class="section-title">State Management, API Client & Mock Layer</div>
    </div>

    <p>
      Codelingo features a resilient hybrid networking layer. If the backend server is running on <code>http://localhost:3000</code>, real HTTP REST requests are dispatched. If the backend is unreachable or offline, the client automatically falls back to an extensive, deterministic in-memory mock engine (<code>mockData.ts</code>).
    </p>

    <div class="grid-2">
      <div class="card">
        <div class="card-title">
          <span>React Query Cache Keys</span>
          <span class="tag tag-red">@tanstack/react-query</span>
        </div>
        <div class="card-desc">
          <ul style="padding-left: 14px; font-size: 8pt; line-height: 1.55;">
            <li><code>["dashboard", userId]</code>: Fetches user stats, active tracks, and streaks.</li>
            <li><code>["personality", userId]</code>: Retrieves Swell cognitive scores and modes.</li>
            <li><code>["adaptiveLesson", lang, lessonId, trait]</code>: Fetches customized lesson content.</li>
          </ul>
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          <span>Theme Context & Dark Mode</span>
          <span class="tag tag-blue">ThemeContext.tsx</span>
        </div>
        <div class="card-desc">
          Maintains theme state across sessions. Persists to <code>localStorage</code> under <code>codelingo-theme</code> ("dark" | "light") and automatically toggles the <code>dark</code> class on <code>document.documentElement</code> for Tailwind v4 CSS variables.
        </div>
      </div>
    </div>

    <h3>REST Endpoints Matrix</h3>
    <table>
      <thead>
        <tr>
          <th>Method</th>
          <th>Endpoint</th>
          <th>Frontend Hook / Function</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>GET</code></td>
          <td><code>/api/dashboard?userId=...</code></td>
          <td><code>fetchDashboard(userId)</code></td>
          <td>Fetches user profile, streaks, and course progress for all 8 tracks</td>
        </tr>
        <tr>
          <td><code>GET</code></td>
          <td><code>/api/personality?userId=...</code></td>
          <td><code>fetchPersonality(userId)</code></td>
          <td>Fetches Swell cognitive scores, primary trait, and learning mode</td>
        </tr>
        <tr>
          <td><code>GET</code></td>
          <td><code>/api/lessons/:lang/:id</code></td>
          <td><code>fetchAdaptiveLesson(lang, id, uid)</code></td>
          <td>Fetches tailored lesson payload with CodeMirror starter code & prompts</td>
        </tr>
        <tr>
          <td><code>POST</code></td>
          <td><code>/api/evaluate</code></td>
          <td><code>evaluateExercise(payload)</code></td>
          <td>Evaluates submitted user code or fill-in-the-blank answers</td>
        </tr>
        <tr>
          <td><code>POST</code></td>
          <td><code>/api/demo/personality</code></td>
          <td><code>setDemoPersonality(userId, trait)</code></td>
          <td>Sets mock personality trait for instant live demonstration switching</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- SECTION 8: SOURCE CODE FILE MATRIX -->
  <div class="section section-break">
    <div class="section-header">
      <div class="section-number">8</div>
      <div class="section-title">Source Code File Matrix</div>
    </div>

    <p>
      Comprehensive inventory of all 42 source files residing under <code>codelingo-web/src/</code>:
    </p>

    <table>
      <thead>
        <tr>
          <th>Relative Path</th>
          <th>Lines</th>
          <th>Category</th>
          <th>Key Exported Symbols & Responsibilities</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>main.tsx</code></td><td>21</td><td>Entry</td><td>Root render with <code>QueryClientProvider</code> and <code>ThemeProvider</code></td></tr>
        <tr><td><code>App.tsx</code></td><td>44</td><td>Router</td><td>Browser router routing to <code>/learn</code>, <code>/lesson/:lang/:id</code>, <code>/complete</code></td></tr>
        <tr><td><code>App.css</code> & <code>index.css</code></td><td>130</td><td>Styles</td><td>Global resets, Tailwind imports, scrollbars, and focus rings</td></tr>
        <tr><td><code>pages/LearnPage.tsx</code></td><td>121</td><td>Page</td><td><code>LearnPage</code> component: Path, Louis coach, and sticky ProgressRecord</td></tr>
        <tr><td><code>pages/LessonPage.tsx</code></td><td>369</td><td>Page</td><td><code>LessonPage</code> component: Mode switching, CodeMirror, and FeedbackCard</td></tr>
        <tr><td><code>pages/CompletePage.tsx</code></td><td>146</td><td>Page</td><td><code>CompletePage</code> component: Celebration fireworks, streak & XP cards</td></tr>
        <tr><td><code>components/layout/AppShell.tsx</code></td><td>54</td><td>Layout</td><td><code>AppShell</code>: Standardized wrapper with sticky header</td></tr>
        <tr><td><code>components/navigation/TopNavigation.tsx</code></td><td>104</td><td>Nav</td><td><code>TopNavigation</code>: Header with course selector, streak, and XP</td></tr>
        <tr><td><code>components/navigation/CourseSelector.tsx</code></td><td>118</td><td>Nav</td><td><code>CourseSelector</code>: Dropdown with categorized language tracks</td></tr>
        <tr><td><code>components/navigation/ThemeToggle.tsx</code></td><td>48</td><td>Nav</td><td><code>ThemeToggle</code>: Dark/light mode button toggle</td></tr>
        <tr><td><code>components/path/LearningPath.tsx</code></td><td>129</td><td>Path</td><td><code>LearningPath</code>: 2-column zigzag tree with middle progress line</td></tr>
        <tr><td><code>components/path/LessonNode.tsx</code></td><td>112</td><td>Path</td><td><code>LessonNode</code>: Circular button with completed/current/locked states</td></tr>
        <tr><td><code>components/lesson/CodeExercise.tsx</code></td><td>91</td><td>Lesson</td><td><code>CodeExercise</code>: CodeMirror dark code editor</td></tr>
        <tr><td><code>components/lesson/FillBlankExercise.tsx</code></td><td>88</td><td>Lesson</td><td><code>FillBlankExercise</code>: Interactive code snippet with blank input</td></tr>
        <tr><td><code>components/lesson/ConceptCard.tsx</code></td><td>115</td><td>Lesson</td><td><code>ConceptCard</code>: Markdown explanation and visual flowcharts</td></tr>
        <tr><td><code>components/lesson/FeedbackCard.tsx</code></td><td>138</td><td>Lesson</td><td><code>FeedbackCard</code>: Bottom action sheet with validation banners</td></tr>
        <tr><td><code>components/lesson/LessonProgressBar.tsx</code></td><td>42</td><td>Lesson</td><td><code>LessonProgressBar</code>: Top animated horizontal progress meter</td></tr>
        <tr><td><code>components/louis/LouisCoach.tsx</code></td><td>123</td><td>Mascot</td><td><code>LouisCoach</code>: Cardinal mascot with 4 mood states & speech bubble</td></tr>
        <tr><td><code>components/gamification/ProgressRecord.tsx</code></td><td>422</td><td>Gamification</td><td><code>ProgressRecord</code>: Red-to-green dynamic progress card</td></tr>
        <tr><td><code>components/gamification/StreakBadge.tsx</code></td><td>45</td><td>Gamification</td><td><code>StreakBadge</code>: Flame daily streak indicator</td></tr>
        <tr><td><code>components/gamification/XpBadge.tsx</code></td><td>45</td><td>Gamification</td><td><code>XpBadge</code>: Lightning bolt XP points counter</td></tr>
        <tr><td><code>components/personality/PersonalityBadge.tsx</code></td><td>58</td><td>Gamification</td><td><code>PersonalityBadge</code>: Swell cognitive trait pill</td></tr>
        <tr><td><code>components/demo/DemoPersonalitySwitch.tsx</code></td><td>62</td><td>Utility</td><td><code>DemoPersonalitySwitch</code>: Live switcher for demo judges</td></tr>
        <tr><td><code>components/auth/CreateAccountModal.tsx</code></td><td>132</td><td>Auth</td><td><code>CreateAccountModal</code>: User registration dialog</td></tr>
        <tr><td><code>api/client.ts</code></td><td>45</td><td>API</td><td>Base HTTP fetch client with error normalization</td></tr>
        <tr><td><code>api/dashboard.ts</code></td><td>32</td><td>API</td><td>Dashboard query function with mock fallback</td></tr>
        <tr><td><code>api/lessons.ts</code></td><td>48</td><td>API</td><td>Adaptive lesson query function with mock fallback</td></tr>
        <tr><td><code>api/evaluate.ts</code></td><td>52</td><td>API</td><td>Code and blank solution evaluation mutation</td></tr>
        <tr><td><code>api/personality.ts</code></td><td>36</td><td>API</td><td>Personality query function with mock fallback</td></tr>
        <tr><td><code>api/demo.ts</code></td><td>28</td><td>API</td><td>Demo personality update mutation</td></tr>
        <tr><td><code>api/mockData.ts</code></td><td>480</td><td>Mock</td><td>Deterministic fallback data for all 8 tracks and 10 lessons</td></tr>
        <tr><td><code>context/ThemeContext.tsx</code></td><td>64</td><td>Context</td><td>Theme provider syncing dark mode to document element</td></tr>
        <tr><td><code>context/useTheme.ts</code></td><td>18</td><td>Context</td><td><code>useTheme</code> hook helper</td></tr>
        <tr><td><code>lib/constants.ts</code></td><td>152</td><td>Lib</td><td><code>SUPPORTED_LANGUAGES</code> and <code>LESSON_TEMPLATES</code> definitions</td></tr>
        <tr><td><code>lib/icons.tsx</code></td><td>130</td><td>Lib</td><td><code>LessonTopicIcon</code> and <code>LanguageTrackIcon</code> mappings</td></tr>
        <tr><td><code>types/api.ts</code></td><td>88</td><td>Types</td><td>TypeScript interfaces for API requests and payloads</td></tr>
        <tr><td><code>types/lesson.ts</code></td><td>15</td><td>Types</td><td><code>LouisMood</code>, <code>SubmitStatus</code>, and <code>PathLessonNode</code> types</td></tr>
      </tbody>
    </table>

    <div class="highlight-box">
      <strong>Summary of Frontend Assets:</strong> In addition to code files, the frontend bundles essential static graphic assets in <code>public/</code> and <code>assets/</code> including <code>louis-transparent.png</code> (official mascot), <code>logo.png</code> (Codelingo brand emblem), and language track badges.
    </div>
  </div>

</body>
</html>
`;

const htmlPath = path.join(__dirname, 'frontend_documentation.html');
const pdfPath = path.join(__dirname, 'Codelingo_Frontend_Guide.pdf');

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('Rendering PDF via Microsoft Edge headless...');
execFileSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${pdfPath}`,
  htmlPath
]);

if (fs.existsSync(pdfPath)) {
  const stats = fs.statSync(pdfPath);
  console.log(`PDF successfully generated at: ${pdfPath}`);
  console.log(`File size: ${stats.size} bytes (${(stats.size / 1024).toFixed(1)} KB)`);
}
