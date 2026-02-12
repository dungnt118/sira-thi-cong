# WF-01: Admin Dashboard Desktop

**Screen:** Admin Dashboard  
**Platform:** Desktop (1920x1080)  
**User Role:** Admin  
**Navigation:** Home > Dashboard  

---

## SCREEN OVERVIEW

The Admin Dashboard provides a comprehensive overview of system health, user activity, and key metrics. Unlike operational dashboards (PM, Supervisor), this focuses on **system-level monitoring** rather than project execution.

**Primary Functions:**
- Monitor system health (server, database, API)
- Track user activity and sessions
- View recent admin actions
- Quick access to critical admin tasks
- System alerts and notifications

---

## LAYOUT STRUCTURE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Logo] SIRA Admin                    [🔍 Search]  [🔔 3]  [👤 Admin]       │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │  Home > Dashboard                                                │
│  👥 Users│  ──────────────────────────────────────────────────────────────  │
│  🏢 Org  │                                                                  │
│  📊 Data │  ┌──────────────────────────────────────────────────────────┐   │
│  🔧 System│  │ SYSTEM HEALTH                                            │   │
│  🔒 Security│ ├──────────────────────────────────────────────────────────┤   │
│  📈 Monitor│  │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │   │
│  ⚙️ Settings│ │ │ CPU     │ │ Memory  │ │ Database│ │ API     │        │   │
│          │  │ │ 45%     │ │ 62%     │ │ Healthy │ │ 120ms   │        │   │
│          │  │ │ ████░░░ │ │ ██████░ │ │ ✅      │ │ ✅      │        │   │
│          │  │ └─────────┘ └─────────┘ └─────────┘ └─────────┘        │   │
│          │  └──────────────────────────────────────────────────────────┘   │
│          │                                                                  │
│          │  ┌──────────────────────────────────────────────────────────┐   │
│          │  │ USER ACTIVITY                                            │   │
│          │  ├──────────────────────────────────────────────────────────┤   │
│          │  │ Active Users: 47  |  Peak Today: 89  |  Total: 234      │   │
│          │  │ ────────────────────────────────────────────────────────  │   │
│          │  │ [Line Chart: Active Users Last 24h]                      │   │
│          │  │                                                          │   │
│          │  │   100 ┤                                                  │   │
│          │  │    80 ┤        ╭─╮                                       │   │
│          │  │    60 ┤    ╭───╯ ╰─╮                                     │   │
│          │  │    40 ┤╭───╯       ╰───╮                                 │   │
│          │  │    20 ┤╯               ╰─────                            │   │
│          │  │     0 └────────────────────────────────                  │   │
│          │  │       0h  4h  8h  12h 16h 20h 24h                        │   │
│          │  └──────────────────────────────────────────────────────────┘   │
│          │                                                                  │
│          │  ┌────────────────────────┬─────────────────────────────────┐   │
│          │  │ RECENT ADMIN ACTIONS   │ SYSTEM ALERTS                   │   │
│          │  ├────────────────────────┼─────────────────────────────────┤   │
│          │  │ 🔵 User created        │ ⚠️  High CPU usage (85%)        │   │
│          │  │    John Doe            │    Server 1 - 2 min ago         │   │
│          │  │    2 minutes ago       │    [View Details]               │   │
│          │  │                        │                                 │   │
│          │  │ 🟢 Schema updated      │ 🔴 Failed backup                │   │
│          │  │    Project schema      │    Database backup failed       │   │
│          │  │    15 minutes ago      │    [Retry] [View Log]           │   │
│          │  │                        │                                 │   │
│          │  │ 🟡 Role modified       │ 🟡 License expiring             │   │
│          │  │    Manager role        │    30 days remaining            │   │
│          │  │    1 hour ago          │    [Renew License]              │   │
│          │  │                        │                                 │   │
│          │  │ [View All Actions]     │ [View All Alerts]               │   │
│          │  └────────────────────────┴─────────────────────────────────┘   │
│          │                                                                  │
│          │  ┌──────────────────────────────────────────────────────────┐   │
│          │  │ QUICK ACTIONS                                            │   │
│          │  ├──────────────────────────────────────────────────────────┤   │
│          │  │ [➕ Create User] [📊 Create Schema] [⚙️ System Settings]  │   │
│          │  │ [🔐 Manage Roles] [📋 View Audit Log] [💾 Backup Now]    │   │
│          │  └──────────────────────────────────────────────────────────┘   │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT SPECIFICATIONS

### 1. Top Bar (64px height)
- **Logo + App Name:** "SIRA Admin" (left)
- **Global Search:** Center-right, 300px width
- **Notifications:** Bell icon with badge (3 unread)
- **User Profile:** Avatar + "Admin" dropdown

### 2. Side Navigation (240px width)
- **Menu Items:**
  - 👥 Users
  - 🏢 Organization
  - 📊 Data Management
  - 🔧 System Configuration
  - 🔒 Security
  - 📈 Monitoring
  - ⚙️ Settings
- **Active State:** Blue background for current page
- **Hover:** Light gray background

### 3. Breadcrumbs (40px height)
- **Path:** Home > Dashboard
- **Style:** Gray text, clickable segments

### 4. System Health Cards (4 cards)
**Layout:** 4 columns, equal width

**Card 1: CPU**
- **Value:** 45%
- **Visual:** Progress bar (blue)
- **Status:** Normal (< 80%)

**Card 2: Memory**
- **Value:** 62%
- **Visual:** Progress bar (blue)
- **Status:** Normal (< 80%)

**Card 3: Database**
- **Value:** "Healthy"
- **Visual:** Green checkmark
- **Status:** Connected

**Card 4: API**
- **Value:** 120ms (avg response time)
- **Visual:** Green checkmark
- **Status:** Normal (< 500ms)

**Specifications:**
- Height: 120px
- Border: 1px solid gray-300
- Border-radius: 8px
- Padding: 16px
- Background: White

### 5. User Activity Chart
**Type:** Line chart (time-series)

**Data:**
- Active users over last 24 hours
- X-axis: Time (0h - 24h)
- Y-axis: User count (0 - 100)

**Metrics:**
- Active Users: 47 (current)
- Peak Today: 89
- Total Users: 234

**Specifications:**
- Height: 240px
- Chart library: Chart.js or Recharts
- Line color: Blue (#1976D2)
- Grid: Light gray dotted lines

### 6. Recent Admin Actions Panel
**Layout:** Left column, 50% width

**Action Items (3 shown):**
1. **User created**
   - Icon: 🔵 (blue dot)
   - Title: "User created"
   - Details: "John Doe"
   - Time: "2 minutes ago"

2. **Schema updated**
   - Icon: 🟢 (green dot)
   - Title: "Schema updated"
   - Details: "Project schema"
   - Time: "15 minutes ago"

3. **Role modified**
   - Icon: 🟡 (yellow dot)
   - Title: "Role modified"
   - Details: "Manager role"
   - Time: "1 hour ago"

**Footer:** [View All Actions] link

**Specifications:**
- Item height: 64px
- Icon size: 12x12px
- Font size: 14px (title), 12px (details)
- Border-bottom: 1px solid gray-200

### 7. System Alerts Panel
**Layout:** Right column, 50% width

**Alert Items (3 shown):**
1. **High CPU usage**
   - Icon: ⚠️ (warning)
   - Title: "High CPU usage (85%)"
   - Details: "Server 1 - 2 min ago"
   - Action: [View Details] button

2. **Failed backup**
   - Icon: 🔴 (error)
   - Title: "Failed backup"
   - Details: "Database backup failed"
   - Actions: [Retry] [View Log] buttons

3. **License expiring**
   - Icon: 🟡 (warning)
   - Title: "License expiring"
   - Details: "30 days remaining"
   - Action: [Renew License] button

**Footer:** [View All Alerts] link

**Specifications:**
- Item height: 80px
- Icon size: 20x20px
- Font size: 14px (title), 12px (details)
- Action buttons: Small (32px height)

### 8. Quick Actions Panel
**Layout:** Full width, bottom of page

**Buttons (6 shown):**
- [➕ Create User]
- [📊 Create Schema]
- [⚙️ System Settings]
- [🔐 Manage Roles]
- [📋 View Audit Log]
- [💾 Backup Now]

**Specifications:**
- Button size: Medium (40px height)
- Style: Outlined (blue border)
- Icon + text
- Spacing: 16px gap

---

## INTERACTIONS

### System Health Cards
- **Hover:** Show tooltip with detailed metrics
- **Click:** Navigate to detailed monitoring page

### User Activity Chart
- **Hover:** Show exact value at time point
- **Click data point:** Show users active at that time

### Recent Admin Actions
- **Click item:** Navigate to action details
- **Click "View All Actions":** Navigate to full audit log

### System Alerts
- **Click alert:** Expand to show full details
- **Click action button:** Execute action (View Details, Retry, etc.)
- **Dismiss:** X icon to dismiss alert

### Quick Actions
- **Click button:** Navigate to respective page or open modal

---

## STATES

### Normal State
- All systems healthy (green checkmarks)
- CPU/Memory < 80%
- No critical alerts

### Warning State
- CPU/Memory 80-90% (yellow)
- Non-critical alerts present
- Show warning icon in top bar

### Critical State
- CPU/Memory > 90% (red)
- Critical alerts present (failed backup, system down)
- Show red badge in top bar
- Auto-refresh every 30 seconds

---

## RESPONSIVE BEHAVIOR

### Large Desktop (1920px)
- Full layout as shown
- 4-column health cards
- 2-column actions/alerts

### Standard Desktop (1366px)
- Maintain layout
- Reduce padding slightly
- Health cards remain 4 columns

### Minimum Desktop (1024px)
- Health cards: 2x2 grid
- Actions/Alerts: Stack vertically
- Chart height: 200px

---

## ACCESSIBILITY

- **Keyboard Navigation:** Tab through all interactive elements
- **Screen Reader:** Announce metrics and alerts
- **Focus Indicators:** Blue outline on focused elements
- **Color Contrast:** WCAG AA compliant

---

## PERFORMANCE

- **Auto-refresh:** Every 60 seconds
- **Lazy load:** Charts load after initial render
- **Caching:** Cache metrics for 30 seconds
- **Real-time:** WebSocket for critical alerts

---

**Status:** ✅ Complete  
**Complexity:** High  
**Components:** 8 major components  
**Interactions:** 12 interaction points
