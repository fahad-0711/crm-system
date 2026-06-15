# Implementation Plan: Premium Cyberpunk Luxury Real Estate CRM

Build a premium, high-fidelity Real Estate Vertical CRM dashboard in Cyberpunk Luxury Dark Mode. It targets small real estate agencies (2–10 agents) and is engineered for visual wow-factor, smooth motion, and deep interactivity.

---

## 🎨 Visual Design System & Core Styles

We will construct a customized Tailwind CSS config inside `src/index.css` leveraging Tailwind CSS variables or theme extensions:
*   **Colors**:
    *   `background-dark`: `#0a0a0f`
    *   `background-gradient`: linear-gradient(135deg, `#0a0a0f` 0%, `#0d0d1a` 100%)
    *   `primary-cyan`: `#00f5ff`
    *   `secondary-purple`: `#bf00ff`
    *   `tertiary-magenta`: `#ff006e`
    *   `text-primary`: `#ffffff`
    *   `text-secondary`: `#94a3b8`
    *   `border-neon`: `rgba(0, 245, 255, 0.15)`
*   **Aesthetics**:
    *   `glass-card`: `rgba(255, 255, 255, 0.03)` background, `1px solid rgba(0, 245, 255, 0.15)` border, and `backdrop-filter: blur(20px)`.
    *   `neon-glow-cyan`: `box-shadow: 0 0 20px rgba(0, 245, 255, 0.5)`
    *   `neon-glow-purple`: `box-shadow: 0 0 20px rgba(191, 0, 255, 0.5)`
*   **Fonts**:
    *   UI: 'Inter', sans-serif
    *   Headings: 'Space Grotesk', sans-serif
*   **Border Radius**:
    *   Cards: `16px` (`rounded-2xl`)
    *   Inputs: `12px` (`rounded-xl`)
    *   Buttons: `8px` (`rounded-lg`)

---

## 🏗️ App Architecture & Directory Structure

```
src/
├── assets/
├── components/
│   ├── UI/
│   │   ├── Button.jsx         # Premium button with neon hover
│   │   ├── Card.jsx           # Glassmorphism container
│   │   ├── Badge.jsx          # Status badges (cyan, yellow, gray, green)
│   │   ├── Input.jsx          # Form input with active neon styling
│   │   ├── Modal.jsx          # Scale up & fade animator
│   │   └── Toast.jsx          # Slide-in notifications
│   ├── Layout/
│   │   ├── Sidebar.jsx        # Sidebar navigation & online team members
│   │   └── Topbar.jsx         # Welcome bar, search, dynamic calendar
│   ├── Dashboard/
│   │   ├── StatCard.jsx       # Counter cards with mini sparklines
│   │   ├── FunnelOverview.jsx # Horizontal pipeline overview
│   │   ├── SourceBreakdown.jsx# Recharts donut chart
│   │   ├── RecentLeadsTable.jsx# Hover-glow rows & action items
│   │   ├── TodayActivities.jsx# Neon timeline, checklist tracker
│   │   ├── AgentLeaderboard.jsx# Top agents with crown indicators
│   │   └── FunnelChart.jsx    # Recharts conversion funnel
│   ├── Leads/
│   │   ├── FilterBar.jsx      # Lead filter panel
│   │   ├── LeadCard.jsx       # Grid view card
│   │   ├── LeadTable.jsx      # Sortable list view table
│   │   ├── LeadDetail.jsx     # Side-drawer/overlay panel for detailed lead history
│   │   └── AddLeadModal.jsx   # Two-column form validator
│   └── Kanban/
│       ├── KanbanBoard.jsx    # Drag and Drop wrapper
│       └── KanbanColumn.jsx   # Individual status column
├── context/
│   └── CRMContext.jsx         # Global state context for leads, activities, agents
├── pages/
│   ├── DashboardPage.jsx      # Main dashboard layout
│   ├── LeadsPage.jsx          # Leads list / grid / detail router
│   ├── PipelinePage.jsx       # Kanban view
│   └── PlaceholderPage.jsx    # Simple views for reports, settings, etc.
├── App.jsx                    # Routing & global providers
├── index.css                  # Tailwinds, fonts, custom keyframe animations
└── main.jsx                   # React bootstrapper
```

---

## 🛠️ State Management Strategy

All lead data, activities, and agent logs will reside in `CRMContext.jsx` using standard React state hooks to make the application interactive:
1.  **Leads State**: Initialized with 10–12 sample leads. Methods to add, update, delete, and reorder.
2.  **Activities State**: Chronological history of actions (site visits, phone calls). Add activity options linked directly from dashboard / leads pages.
3.  **Agents State**: Active leads per agent, sales conversions, and online indicators.
4.  **Notification System**: Global toast queue with standard slide-out animations.

---

## 📦 Proposed Changes

### [NEW] [CRMContext.jsx](file:///c:/Users/FAHAD/OneDrive/Desktop/CRM/src/context/CRMContext.jsx)
Global React Context providing CRM states, search filters, modal triggers, and toast notifications.

### [NEW] [index.css](file:///c:/Users/FAHAD/OneDrive/Desktop/CRM/src/index.css)
Declare Google Fonts (`Space Grotesk`, `Inter`), configure custom Tailwind layers, implement custom glow classes, shimmer keyframes, particle physics animations, and horizontal/vertical scrollbars.

### [NEW] [Sidebar.jsx](file:///c:/Users/FAHAD/OneDrive/Desktop/CRM/src/components/Layout/Sidebar.jsx) & [Topbar.jsx](file:///c:/Users/FAHAD/OneDrive/Desktop/CRM/src/components/Layout/Topbar.jsx)
App frame with avatar badges, active navigation glow effects, and search routing.

### [NEW] [DashboardPage.jsx](file:///c:/Users/FAHAD/OneDrive/Desktop/CRM/src/pages/DashboardPage.jsx)
Assemble components for stats, donut charts, pipeline funnel, activity trackers, and agent leaderboards.

### [NEW] [LeadsPage.jsx](file:///c:/Users/FAHAD/OneDrive/Desktop/CRM/src/pages/LeadsPage.jsx)
Integrates filters, search matching, TabSwitcher, grid views (cards), and the list view (table), plus the detail drawer.

### [NEW] [PipelinePage.jsx](file:///c:/Users/FAHAD/OneDrive/Desktop/CRM/src/pages/PipelinePage.jsx)
Kanban board implementing `@hello-pangea/dnd` for smooth, responsive drag-and-drop actions.

---

## 💡 Dynamic Animation Checklist
*   [ ] **Page Load Cards**: `@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }` applied with custom staggered delays.
*   [ ] **Online Icons**: Pulsing dot animations.
*   [ ] **Stat Cards Count-Up**: Custom React hook using `requestAnimationFrame` to animate values from 0.
*   [ ] **Drifting Particles**: Canvas-based or HTML-based particle system rendering 15–20 tiny glowing nodes drifting at slow speeds.
*   [ ] **Pipeline Funnel**: SVG or HTML bars growing in size via width transition on load.
*   [ ] **Skeleton Shimmer**: Animated background gradient mask running on cards during initial mount.

---

## ❓ Open Questions for the User

> [!NOTE]
> Since we are in planning mode, please review these details. No blocking decisions are required immediately, but feedback is welcome.
> 1. Do you want the **Lead Detail** view to appear as a sliding side drawer or a modal popup when clicking a lead?
> 2. Should we pre-populate the **Documents** panel in the Lead Detail drawer with some mock files (e.g. `Registration_Draft.pdf`, `Property_Brochure.pdf`) or keep it empty for uploads?

---

## 🧪 Verification Plan

### Automated Tests
Verify building and compiling via:
`npm run build`

### Manual Verification
1.  **Dashboard Load**: Check count-up stats, sparkline paths, and donut chart interactions.
2.  **Filter/Search Match**: Input local names (e.g. "Ravi", "Ananya") and check grid/list view dynamic updates.
3.  **Kanban Drag & Drop**: Drag a card from "New Inquiry" to "Negotiation". Confirm column count changes, total value is re-calculated, and success toast shows.
4.  **Create Lead Validation**: Trigger the modal, attempt empty submissions, verify error messages, fill details, and watch the list update.
