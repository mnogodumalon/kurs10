# Design Brief: KursManager

## 1. App Analysis
- **What this app does:** A comprehensive course management system for educational institutions or training centers. Manages courses, instructors, participants, rooms, and enrollments in one unified interface.
- **Who uses this:** Administrative staff at training centers, small universities, or continuing education providers. Non-technical users who need to quickly add courses, assign instructors, manage room bookings, and track enrollments.
- **The ONE thing users care about most:** Seeing an overview of active courses and managing enrollments efficiently.
- **Primary actions:** Create/edit courses, register participants for courses, manage instructor assignments, track payments.

## 2. What Makes This Design Distinctive
- **Visual identity:** Academic elegance with a structured, organized feel. Uses deep indigo as primary color paired with warm amber accents - suggesting knowledge (blue) and energy (gold), like a university crest.
- **Layout strategy:** Tab-based navigation across the 5 entity types with a hero dashboard showing key metrics. Each tab contains a clean data table with inline actions and a prominent "Add" button.
- **Unique element:** A gradient header bar with course statistics that uses a refined indigo-to-violet gradient, giving the app an institutional yet modern feel.

## 3. Theme & Colors
- **Font family:** Plus Jakarta Sans - professional, geometric, excellent readability for data-heavy interfaces
- **Google Fonts URL:** `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap`
- **Color palette:**
  - Primary: hsl(234 85% 45%) - Deep indigo
  - Primary foreground: hsl(0 0% 100%)
  - Primary glow: hsl(234 85% 65%) - Lighter indigo
  - Accent: hsl(38 92% 50%) - Warm amber/gold
  - Accent foreground: hsl(38 92% 15%)
  - Background: hsl(230 25% 97%) - Cool off-white
  - Card: hsl(0 0% 100%)
  - Card foreground: hsl(234 30% 15%)
  - Muted: hsl(230 15% 93%)
  - Muted foreground: hsl(230 10% 45%)
  - Border: hsl(230 15% 88%)
  - Destructive: hsl(0 72% 51%)
  - Success: hsl(152 60% 42%)
- **Background treatment:** Subtle cool-toned off-white with no visible pattern

## 4. Mobile Layout
- **Layout approach:** Single column, full-width. Tab navigation becomes a horizontal scrollable strip at the top. Tables become card-based lists.
- **What users see:** Header with app name + hero stats row -> Tab strip -> Content area with cards/list -> Floating action button (FAB) at bottom right
- **Touch targets:** Minimum 44px, FAB is 56px

## 5. Desktop Layout
- **Overall structure:** Full-width container with max-width 1400px, centered. Header spans full width with gradient background.
- **Section layout:**
  - Top: Gradient header with 4 stat cards in a row
  - Below: Tab bar for entity navigation
  - Content: Full-width data tables with action columns
- **Hover states:** Table rows highlight on hover, buttons scale slightly

## 6. Components
- **Hero KPI:** Total active courses (large number with trend)
- **Secondary KPIs:** Total participants, Active instructors, Rooms available, Pending payments
- **Charts:** Not primary - this is a data management app
- **Lists/Tables:** 5 entity tables (Courses, Instructors, Participants, Rooms, Enrollments) each with CRUD
- **Primary Action Button:** "Neuer Kurs" / "Neuer Dozent" etc. - context-dependent per active tab

## 7. Visual Details
- Border radius: 12px for cards, 8px for buttons, 6px for inputs
- Shadows: Soft shadow for cards (0 1px 3px rgba(0,0,0,0.08)), elevated shadow for header
- Spacing: 24px between sections, 16px within cards
- Animations: Smooth tab transitions, subtle fade-in for table rows

## 8. CSS Variables

```css
:root {
  --radius: 0.75rem;
  --font-sans: 'Plus Jakarta Sans', sans-serif;

  --background: hsl(230 25% 97%);
  --foreground: hsl(234 30% 15%);

  --card: hsl(0 0% 100%);
  --card-foreground: hsl(234 30% 15%);

  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(234 30% 15%);

  --primary: hsl(234 85% 45%);
  --primary-foreground: hsl(0 0% 100%);

  --secondary: hsl(230 20% 94%);
  --secondary-foreground: hsl(234 30% 25%);

  --muted: hsl(230 15% 93%);
  --muted-foreground: hsl(230 10% 45%);

  --accent: hsl(38 92% 50%);
  --accent-foreground: hsl(38 92% 15%);

  --destructive: hsl(0 72% 51%);

  --border: hsl(230 15% 88%);
  --input: hsl(230 15% 88%);
  --ring: hsl(234 85% 55%);

  --chart-1: hsl(234 85% 45%);
  --chart-2: hsl(38 92% 50%);
  --chart-3: hsl(152 60% 42%);
  --chart-4: hsl(280 60% 50%);
  --chart-5: hsl(200 70% 50%);

  /* Custom tokens */
  --gradient-header: linear-gradient(135deg, hsl(234 85% 40%), hsl(260 70% 50%));
  --shadow-card: 0 1px 3px hsl(234 30% 15% / 0.06), 0 1px 2px hsl(234 30% 15% / 0.04);
  --shadow-elevated: 0 4px 12px hsl(234 30% 15% / 0.1);
  --success: hsl(152 60% 42%);
  --success-foreground: hsl(0 0% 100%);
  --warning: hsl(38 92% 50%);
  --warning-foreground: hsl(38 92% 15%);
}
```
