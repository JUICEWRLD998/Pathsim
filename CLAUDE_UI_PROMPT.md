# Claude Sonnet 4.6 — PathSim Professional UI Implementation Prompt

## Context & Project Overview

You are implementing a production-grade UI for **PathSim AI**, a career simulation platform for high school students. This is a hackathon submission that must compete at the highest level for design excellence.

**Stack Available:**
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 3.x
- Framer Motion (animations)
- Three.js + React Three Fiber (3D)
- GSAP + ScrollTrigger (scroll animations)
- Zustand (state)

**Key Dependencies to Leverage:**
```
framer-motion, three, @react-three/fiber, gsap, zustand, d3, lucide-react
```

---

## Design Requirements — NO COMPROMISES

### 1. Visual Standards
- **Zero Emojis:** Remove all emoji usage. Use professional iconography only (Lucide React icons or custom SVG)
- **Award-Winning Design:** Research and implement UI patterns from:
  - Dribbble top shots (motion design)
  - Awwwards winners (interaction design)
  - Apple design system (clarity)
  - Figma design community (modern UI trends)
  - Vercel/Linear/Stripe (tech company UI excellence)
- **Professional Color Palette:** Deep, sophisticated colors with meaningful contrast
  - Primary: Electric Violet (#a855f7)
  - Accent: Cyan (#22d3ee)
  - Background: Deep void-like (#040812, #080f1e)
  - NO neon overload—restraint is key
- **Typography Excellence:**
  - Use system fonts (Inter, Space Grotesk) with careful hierarchy
  - Proper line-height, letter-spacing, font weights
  - Contrast ratios must meet WCAG AAA (for accessibility)

### 2. Motion & Interaction Standards
- **Purposeful Animation:** Every animation serves a function
  - Page transitions: Smooth, not distracting
  - Micro-interactions: Confirm user actions (button feedback, form validation)
  - Scroll-triggered reveals: Builds hierarchy as user scrolls
  - 3D elements: Used sparingly for high-impact moments (e.g., Career Galaxy)
- **Performance:** All animations must:
  - Use GPU-accelerated transforms (transform, opacity)
  - Load in <3s on 4G
  - Never block interactivity
- **Accessibility:** Respect prefers-reduced-motion

### 3. Component Quality
- **Consistent Design System:** Every UI element follows clear design rules
  - Buttons: 3 variants (primary, secondary, ghost)
  - Cards: Glassmorphism with subtle borders
  - Spacing: 4px baseline (Tailwind default)
  - Shadows: Subtle glows for depth, not drop shadows
- **Responsive Design:** Mobile-first, works perfectly on all devices
- **Dark Mode Default:** This app is dark-mode only (no light toggle)

---

## Research Task — Execute This First

**Before writing code**, research and document:

1. **Inspiration Sources:**
   - Find 3 award-winning career/education UI examples
   - Find 2 motion design examples you'll replicate patterns from
   - Document what makes them feel premium (specific techniques)

2. **Design Patterns to Implement:**
   - Glassmorphism + backdrop blur for depth
   - Subtle gradient underlines on interactive elements
   - Progressive loading (skeleton screens, staggered reveals)
   - Intentional whitespace
   - Icon + text pairing (Lucide React)

3. **Animation Library Decisions:**
   - When to use Framer Motion (page transitions, stagger, variants)
   - When to use GSAP (scroll-triggered animations)
   - When to use Three.js (Career Galaxy, 3D moments only)
   - Avoid animation fatigue

---

## Page-Level Implementation Specs

### Landing Page (`/`)
- **Hero Section:**
  - Large, confident headline (no jargon)
  - Single CTA button (primary style)
  - Subtle background animation (GSAP, not distracting)
  - Testimonial cards with smooth scroll reveal
- **How It Works Section:**
  - Step-by-step cards with numbers
  - Scroll-triggered number counter animation (GSAP)
  - Icons from Lucide React (ChevronRight, ArrowRight, etc.)
- **Career Preview Cards:**
  - 6 cards, 3 per row (responsive to 1)
  - Hover state: subtle lift, border glow, no emoji
  - Click → navigate to quiz
- **Footer:**
  - Links, copyright, minimal design

### Quiz Page (`/quiz`)
- **Progress Indicator:**
  - Animated progress bar (Framer Motion)
  - Current question: X / 5
- **Question Card:**
  - Clean question text
  - 4 option buttons with radio selection
  - Smooth transition to next question
  - Previous/Next navigation
- **Submit Button:**
  - Disabled until all answered
  - Pulsing animation when ready
- **Loading State:**
  - Skeleton while generating recommendations

### Simulation Page (`/simulation`)
- **Header:**
  - Career name + logo (Lucide icon)
  - Match score progress ring (animated SVG)
- **Scenario Card:**
  - Situation text (readable, professional)
  - 4 choice buttons, distinct visual hierarchy
  - Smooth fade between scenarios
- **Decision History:**
  - Sidebar showing past choices (sticky)
  - Clean list with subtle numbering
- **Loading Spinner:**
  - Elegant, professional (not spinning dash)

### Dashboard Page (`/dashboard`)
- **Match Score Ring:**
  - Animated SVG circle (animated to final score on load)
  - Percentage text in center
  - Color-coded: red (<60), yellow (60-80), green (>80)
- **Strengths & Growth Areas:**
  - Two columns with skill tags
  - Icons from Lucide React
  - Smooth entrance animations (Framer Motion stagger)
- **Related Careers:**
  - Horizontal scroll carousel
  - Cards with subtle hover state
- **Roadmap CTA:**
  - Prominent button leading to roadmap

### Career Galaxy Page (`/galaxy`)
- **3D Force Graph (Three.js + D3):**
  - Career nodes as glowing spheres (not emoji)
  - Interactive: hover = highlight + name + salary
  - Click = navigate to simulation
  - Smooth camera transitions (Three.js controls)
  - Legend showing career clusters + colors
- **Fallback (no WebGL):**
  - SVG force graph with Framer Motion
- **Background:**
  - Starfield or subtle particle effect (GSAP)

### Roadmap Page (`/roadmap`)
- **Timeline:**
  - Vertical timeline (or horizontal on mobile)
  - Milestones with dates
  - Action items listed under each
  - Scroll-triggered reveals (GSAP ScrollTrigger)
- **Resource Cards:**
  - Icon, title, platform link
  - No emojis—use Lucide React icons
- **CTA Buttons:**
  - "Start Learning" buttons with external links

---

## Implementation Checklist

### Phase 1: Global Design System
- [ ] CSS custom properties (colors, spacing, shadows)
- [ ] Tailwind config extends with custom colors
- [ ] Font loading optimized (next/font)
- [ ] Dark mode only (no toggle)

### Phase 2: Reusable Components
- [ ] Button (primary, secondary, ghost)
- [ ] Card (glassmorphism base)
- [ ] Badge / Tag
- [ ] ProgressBar / RingChart
- [ ] LoadingSpinner (elegant)
- [ ] Navbar (sticky, minimal)
- [ ] PageWrapper (Framer Motion transitions)
- [ ] Icon library integration (Lucide)

### Phase 3: Animation System
- [ ] Framer Motion variant definitions (shared)
- [ ] GSAP ScrollTrigger setup
- [ ] Three.js scene initialization
- [ ] Responsive breakpoint handling

### Phase 4: Page Implementation
- [ ] Landing → Hero + Cards + CTA
- [ ] Quiz → Progress + Options + Submit
- [ ] Simulation → Scenario + Choices + History
- [ ] Dashboard → Score + Strengths + Related
- [ ] Galaxy → 3D Graph + Interactions
- [ ] Roadmap → Timeline + Resources

### Phase 5: Polish
- [ ] Loading states for all async operations
- [ ] Error boundaries + fallback UI
- [ ] Mobile responsiveness (viewport units, flex wrapping)
- [ ] Accessibility (contrast, focus states, skip links)
- [ ] Performance (Lighthouse >90)

---

## Code Quality Standards

- **TypeScript:** Strict mode, full typing
- **Component Structure:** Separate client/server, clear responsibility
- **Performance:** Lazy loading, code splitting, memoization where needed
- **Accessibility:** ARIA labels, semantic HTML, keyboard navigation
- **Git-Ready:** Clean, documented commits

---

## What NOT to Do

❌ No emojis anywhere  
❌ No neon-only color schemes  
❌ No animations for animation's sake  
❌ No heavy drop shadows  
❌ No busy backgrounds  
❌ No custom fonts (use next/font)  
❌ No Redux (Zustand is simpler)  
❌ No inline styles (Tailwind only)  
❌ No placeholder text like "Lorem ipsum"  
❌ No unoptimized images  

---

## Success Criteria

- **Visual:** Professional enough to win design awards
- **Functional:** Zero bugs, smooth interactions
- **Performant:** Lighthouse score >90
- **Accessible:** WCAG AAA compliant
- **Responsive:** Perfect on mobile and desktop
- **Code:** Clean, typed, maintainable

---

## Deliverable

Implement the complete UI with:
1. **All page components** ready for integration with existing Zustand stores
2. **Reusable component library** (buttons, cards, etc.)
3. **Global animation system** (Framer Motion setup, GSAP utils)
4. **Professional iconography** (Lucide React only)
5. **Responsive, accessible, performant code**

Start with research, then execute in order: System → Components → Pages → Polish.

This is a hackathon entry. It must look award-winning. Go make it happen.
