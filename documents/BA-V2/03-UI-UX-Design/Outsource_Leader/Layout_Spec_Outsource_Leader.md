# 📐 LAYOUT SPECIFICATION - Outsource Leader

**SIRA Service Management Platform**  
**Role:** Outsource Leader (Mobile-First)  
**Version:** 1.0  
**Date:** 2026-02-12  

---

## 1. DESIGN PHILOSOPHY

### 1.1 Mobile-First Approach

**Rationale:**
- Outsource Leader làm việc chủ yếu tại công trường
- Cần access nhanh từ smartphone
- Touch-friendly interface
- Offline capability

**Priority:**
1. **Mobile** (320px - 768px) - PRIMARY
2. **Tablet** (769px - 1024px) - SECONDARY
3. **Desktop** (1025px+) - LIMITED SUPPORT

### 1.2 Design Principles

- **Simplicity:** Minimal clicks to complete tasks
- **Clarity:** Large text, high contrast
- **Speed:** Fast load, optimistic UI
- **Touch-friendly:** Min 44x44px targets
- **Offline-first:** Work without network

---

## 2. RESPONSIVE BREAKPOINTS

### 2.1 Breakpoint System

```css
/* Mobile Small */
@media (min-width: 320px) { }

/* Mobile Medium */
@media (min-width: 375px) { }

/* Mobile Large */
@media (min-width: 425px) { }

/* Tablet */
@media (min-width: 768px) { }

/* Tablet Large */
@media (min-width: 1024px) { }

/* Desktop (limited support) */
@media (min-width: 1280px) { }
```

### 2.2 Layout Behavior

| Breakpoint | Grid Columns | Sidebar | Navigation |
|------------|--------------|---------|------------|
| 320-767px | 4 columns | Hidden | Bottom tabs |
| 768-1023px | 8 columns | Drawer | Bottom tabs + Top bar |
| 1024px+ | 12 columns | Fixed | Side menu |

---

## 3. GRID SYSTEM

### 3.1 Mobile Grid (320-767px)

**4-column grid:**
- Column width: Fluid
- Gutter: 16px
- Margin: 16px

```
┌─────────────────────────────────┐
│ [16px]                   [16px] │
│   [Col1] [Col2] [Col3] [Col4]   │
│   [────] [────] [────] [────]   │
│    16px   16px   16px            │
└─────────────────────────────────┘
```

### 3.2 Tablet Grid (768-1023px)

**8-column grid:**
- Column width: Fluid
- Gutter: 24px
- Margin: 24px

### 3.3 Desktop Grid (1024px+)

**12-column grid:**
- Max width: 1280px
- Gutter: 24px
- Margin: 32px

---

## 4. SPACING SYSTEM

### 4.1 Base Unit: 8px

```
4px   = 0.5 unit (tight spacing)
8px   = 1 unit (base)
16px  = 2 units (standard)
24px  = 3 units (comfortable)
32px  = 4 units (loose)
48px  = 6 units (section)
64px  = 8 units (large section)
```

### 4.2 Component Spacing

| Component | Padding | Margin |
|-----------|---------|--------|
| Button | 12px 24px | 8px |
| Card | 16px | 16px |
| Input field | 12px 16px | 8px |
| Section | 24px | 24px |
| Screen | 16px | 0 |

---

## 5. TYPOGRAPHY

### 5.1 Font Family

**Primary:** Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

**Fallback:** System fonts for performance

### 5.2 Type Scale (Mobile)

```css
/* Headings */
h1: 28px / 1.2 / Bold (700)
h2: 24px / 1.3 / Bold (700)
h3: 20px / 1.4 / SemiBold (600)
h4: 18px / 1.4 / SemiBold (600)

/* Body */
body: 16px / 1.5 / Regular (400)
body-small: 14px / 1.5 / Regular (400)
caption: 12px / 1.4 / Regular (400)

/* UI */
button: 16px / 1.2 / Medium (500)
label: 14px / 1.4 / Medium (500)
input: 16px / 1.5 / Regular (400)
```

### 5.3 Type Scale (Tablet/Desktop)

```css
h1: 32px / 1.2 / Bold (700)
h2: 28px / 1.3 / Bold (700)
h3: 24px / 1.4 / SemiBold (600)
h4: 20px / 1.4 / SemiBold (600)
body: 16px / 1.5 / Regular (400)
```

---

## 6. COLOR SYSTEM

### 6.1 Brand Colors

```css
/* Primary (Blue - Outsource identity) */
--primary-50:  #E3F2FD
--primary-100: #BBDEFB
--primary-500: #2196F3  /* Main */
--primary-700: #1976D2
--primary-900: #0D47A1

/* Secondary (Orange - Actions) */
--secondary-500: #FF9800
--secondary-700: #F57C00

/* Accent (Green - Success) */
--accent-500: #4CAF50
```

### 6.2 Semantic Colors

```css
/* Success */
--success: #4CAF50
--success-bg: #E8F5E9

/* Warning */
--warning: #FF9800
--warning-bg: #FFF3E0

/* Error */
--error: #F44336
--error-bg: #FFEBEE

/* Info */
--info: #2196F3
--info-bg: #E3F2FD
```

### 6.3 Neutral Colors

```css
/* Grays */
--gray-50:  #FAFAFA
--gray-100: #F5F5F5
--gray-200: #EEEEEE
--gray-300: #E0E0E0
--gray-400: #BDBDBD
--gray-500: #9E9E9E
--gray-600: #757575
--gray-700: #616161
--gray-800: #424242
--gray-900: #212121

/* Text */
--text-primary: rgba(0,0,0,0.87)
--text-secondary: rgba(0,0,0,0.60)
--text-disabled: rgba(0,0,0,0.38)
```

### 6.4 Background Colors

```css
--bg-primary: #FFFFFF
--bg-secondary: #F5F5F5
--bg-tertiary: #EEEEEE
--bg-overlay: rgba(0,0,0,0.5)
```

---

## 7. NAVIGATION

### 7.1 Bottom Tab Bar (Mobile Primary)

**Layout:**
```
┌─────────────────────────────────┐
│                                 │
│         CONTENT AREA            │
│                                 │
├─────────────────────────────────┤
│ [Dự án] [Upload] [Chat] [Cá nhân] │
│   🏗️      📸       💬      👤   │
└─────────────────────────────────┘
```

**Specs:**
- Height: 56px
- Background: White
- Shadow: 0 -2px 4px rgba(0,0,0,0.1)
- Icon size: 24x24px
- Label: 12px
- Active color: Primary-500
- Inactive color: Gray-600

**Tabs:**
1. **Dự án** (Projects) - 🏗️
2. **Upload** (Evidence Upload) - 📸
3. **Chat** (Communication) - 💬
4. **Cá nhân** (Profile) - 👤

### 7.2 Top Bar (Mobile)

**Layout:**
```
┌─────────────────────────────────┐
│ [☰] SIRA      [🔔3] [👤]        │
└─────────────────────────────────┘
```

**Specs:**
- Height: 56px
- Background: Primary-500
- Text color: White
- Shadow: 0 2px 4px rgba(0,0,0,0.1)

**Elements:**
- Menu icon (left): 24x24px
- Logo/Title (center-left)
- Notification bell (right): Badge count
- Avatar (far right): 32x32px circle

### 7.3 Side Drawer (Tablet)

**Layout:**
```
┌──────────┬──────────────────────┐
│ [Logo]   │                      │
│          │                      │
│ Dự án    │     CONTENT          │
│ Upload   │                      │
│ Chat     │                      │
│ Profile  │                      │
│          │                      │
│ Settings │                      │
│ Logout   │                      │
└──────────┴──────────────────────┘
```

**Specs:**
- Width: 280px
- Background: White
- Shadow: 2px 0 4px rgba(0,0,0,0.1)
- Overlay: rgba(0,0,0,0.5) when open

---

## 8. COMPONENTS

### 8.1 Buttons

**Primary Button:**
```css
Background: Primary-500
Text: White, 16px, Medium
Padding: 12px 24px
Border-radius: 8px
Min-height: 44px
Shadow: 0 2px 4px rgba(0,0,0,0.2)
```

**Secondary Button:**
```css
Background: Transparent
Border: 1px solid Primary-500
Text: Primary-500, 16px, Medium
Padding: 12px 24px
Border-radius: 8px
Min-height: 44px
```

**Icon Button:**
```css
Size: 44x44px (touch target)
Icon: 24x24px
Background: Transparent
Border-radius: 50%
Ripple effect on tap
```

**Floating Action Button (FAB):**
```css
Size: 56x56px
Icon: 24x24px
Background: Secondary-500
Position: Fixed, bottom-right
Offset: 16px from bottom, 16px from right
Shadow: 0 4px 8px rgba(0,0,0,0.3)
Border-radius: 50%
```

### 8.2 Cards

**Project Card:**
```
┌─────────────────────────────────┐
│ PRJ-2026-001        [⏳ Đang làm]│
│ Dự án ABC Corp                  │
│ Quận 1, TP HCM                  │
│                                 │
│ ████████░░ 80%                  │
│                                 │
│ PM: John Doe    15/02 - 28/02   │
└─────────────────────────────────┘
```

**Specs:**
- Padding: 16px
- Border-radius: 12px
- Background: White
- Shadow: 0 2px 8px rgba(0,0,0,0.1)
- Margin: 16px 0

**Evidence Card:**
```
┌─────────────────┐
│                 │
│     [IMAGE]     │
│                 │
├─────────────────┤
│ BEFORE          │
│ 12/02 10:30     │
└─────────────────┘
```

**Specs:**
- Width: 100% (mobile), 50% (tablet), 33% (desktop)
- Aspect ratio: 4:3
- Border-radius: 8px
- Shadow: 0 2px 4px rgba(0,0,0,0.1)

### 8.3 Input Fields

**Text Input:**
```css
Height: 44px
Padding: 12px 16px
Border: 1px solid Gray-300
Border-radius: 8px
Font-size: 16px (prevent zoom on iOS)
Background: White
```

**Focus state:**
```css
Border: 2px solid Primary-500
Shadow: 0 0 0 3px rgba(33,150,243,0.1)
```

**Error state:**
```css
Border: 2px solid Error
Helper text: Error color, 12px
```

**Textarea:**
```css
Min-height: 88px (2 lines)
Resize: vertical
```

### 8.4 Badges

**Status Badge:**
```css
Padding: 4px 12px
Border-radius: 12px
Font-size: 12px
Font-weight: 500
```

**Colors:**
- Draft: Gray-500 bg, White text
- Scheduled: Info bg, White text
- In Progress: Warning bg, White text
- Completed: Success bg, White text

**Notification Badge:**
```css
Size: 20x20px
Border-radius: 10px
Background: Error
Text: White, 12px, Bold
Position: Absolute, top-right
```

### 8.5 Lists

**List Item:**
```
┌─────────────────────────────────┐
│ [Icon] Title              [>]   │
│        Subtitle                 │
└─────────────────────────────────┘
```

**Specs:**
- Min-height: 56px
- Padding: 12px 16px
- Border-bottom: 1px solid Gray-200
- Ripple effect on tap

**Swipeable List Item:**
```
← Swipe left to delete
→ Swipe right for actions
```

### 8.6 Modals

**Bottom Sheet (Mobile):**
```
┌─────────────────────────────────┐
│                                 │
│         CONTENT AREA            │
│                                 │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ ═══ (handle)                │ │
│ │                             │ │
│ │ Modal Title                 │ │
│ │                             │ │
│ │ Content...                  │ │
│ │                             │ │
│ │ [Cancel]    [Confirm]       │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Specs:**
- Max-height: 90vh
- Border-radius: 16px 16px 0 0
- Background: White
- Overlay: rgba(0,0,0,0.5)
- Swipe down to dismiss

**Dialog (Tablet/Desktop):**
```css
Max-width: 560px
Border-radius: 12px
Padding: 24px
Shadow: 0 8px 16px rgba(0,0,0,0.2)
```

---

## 9. SCREEN LAYOUTS

### 9.1 Dashboard (Mobile)

```
┌─────────────────────────────────┐
│ [☰] SIRA      [🔔3] [👤]        │ ← Top bar (56px)
├─────────────────────────────────┤
│ Xin chào, Nguyễn Văn A          │ ← Greeting (48px)
├─────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐       │
│ │    5     │ │    12    │       │ ← Stats (2x2 grid)
│ │ Dự án    │ │ Evidence │       │
│ └──────────┘ └──────────┘       │
│ ┌──────────┐ ┌──────────┐       │
│ │    3     │ │  2.5M    │       │
│ │ Vật tư   │ │ Thanh toán│      │
│ └──────────┘ └──────────┘       │
├─────────────────────────────────┤
│ Dự án gần đây                   │ ← Section title
│                                 │
│ [Project Card 1]                │ ← Scrollable list
│ [Project Card 2]                │
│ [Project Card 3]                │
│                                 │
├─────────────────────────────────┤
│ [Dự án] [Upload] [Chat] [Cá nhân] │ ← Bottom tabs (56px)
└─────────────────────────────────┘
```

### 9.2 Project Detail (Mobile)

```
┌─────────────────────────────────┐
│ [←] Dự án ABC      [⋮]          │ ← Top bar
├─────────────────────────────────┤
│ [Tổng quan][Evidence][Vật tư]..│ ← Horizontal tabs
├─────────────────────────────────┤
│                                 │
│ PRJ-2026-001                    │
│ Dự án ABC Corp                  │
│ Quận 1, TP HCM                  │
│                                 │
│ ████████░░ 80%                  │
│                                 │
│ 15/02/2026 - 28/02/2026         │
│                                 │
│ ┌─ Team ─────────────────────┐  │
│ │ PM: John Doe               │  │
│ │ Supervisor: Jane Smith     │  │
│ │ Workers: 5 người           │  │
│ └────────────────────────────┘  │
│                                 │
│ [Upload Evidence] [Chat]        │ ← Quick actions
│                                 │
├─────────────────────────────────┤
│ [Dự án] [Upload] [Chat] [Cá nhân] │
└─────────────────────────────────┘
```

### 9.3 Evidence Upload (Mobile)

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│                                 │
│         CAMERA PREVIEW          │
│          (Full screen)          │
│                                 │
│                                 │
│                                 │
├─────────────────────────────────┤
│ [📷] [BEFORE ▼] [⚡]            │ ← Controls
│                                 │
│     [Gallery]  (○)  [Capture]   │ ← Capture button
└─────────────────────────────────┘
```

**After capture:**
```
┌─────────────────────────────────┐
│ [×] Preview          [✓]        │
├─────────────────────────────────┤
│                                 │
│         [IMAGE PREVIEW]         │
│                                 │
├─────────────────────────────────┤
│ Stage: [BEFORE ▼]               │
│                                 │
│ Ghi chú (optional)              │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ 📍 Quận 1, TP HCM               │
│ 🕐 12/02/2026 10:30             │
│                                 │
│         [Upload]                │
└─────────────────────────────────┘
```

### 9.4 Material Confirmation (Mobile)

```
┌─────────────────────────────────┐
│ [←] Vật tư                      │
├─────────────────────────────────┤
│ Dự án: ABC Corp                 │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Xi măng                     │ │
│ │ Dự kiến: 50 bao             │ │
│ │ Thực tế: [55] bao           │ │
│ │ ⚠️ Chênh lệch: +10%         │ │
│ │ Ghi chú: [Cần thêm...]      │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Cát                         │ │
│ │ Dự kiến: 10 m³              │ │
│ │ Thực tế: [10] m³            │ │
│ │ ✓ Đúng kế hoạch             │ │
│ └─────────────────────────────┘ │
│                                 │
│         [Confirm tất cả]        │
└─────────────────────────────────┘
```

---

## 10. TOUCH INTERACTIONS

### 10.1 Touch Targets

**Minimum size:** 44x44px (Apple HIG, Material Design)

**Spacing:** 8px minimum between targets

**Examples:**
- Buttons: 44px height minimum
- List items: 56px height minimum
- Icons: 44x44px touch area (24x24px visual)
- Tabs: 48px height minimum

### 10.2 Gestures

**Supported gestures:**
- **Tap:** Primary action
- **Long press:** Context menu, secondary actions
- **Swipe left/right:** Navigate, delete
- **Swipe down:** Refresh (pull-to-refresh)
- **Pinch:** Zoom images
- **Drag:** Reorder lists

**Feedback:**
- Ripple effect on tap (Material Design)
- Haptic feedback on long press (iOS)
- Visual feedback on drag

---

## 11. LOADING STATES

### 11.1 Skeleton Screens

**Project Card Skeleton:**
```
┌─────────────────────────────────┐
│ ████████░░░░░░░░  ░░░░░░░░░░░░ │
│ ████████████░░░░░░░░░░░░░░░░░░ │
│ ████████░░░░░░░░░░░░░░░░░░░░░░ │
│                                 │
│ ████████████████░░░░░░░░░░░░░░ │
│                                 │
│ ████░░░░░░░░    ████░░░░░░░░░░ │
└─────────────────────────────────┘
```

**Benefits:**
- Better perceived performance
- Reduce layout shift
- User knows content is loading

### 11.2 Progress Indicators

**Spinner:**
```css
Size: 32x32px (small), 48x48px (medium)
Color: Primary-500
Animation: Rotate 360deg, 1s linear infinite
```

**Progress Bar:**
```css
Height: 4px
Background: Gray-200
Fill: Primary-500
Animation: Indeterminate or determinate
```

**Upload Progress:**
```
Uploading... 45%
████████░░░░░░░░░░
```

---

## 12. EMPTY STATES

### 12.1 No Projects

```
┌─────────────────────────────────┐
│                                 │
│          🏗️                     │
│                                 │
│   Chưa có dự án nào             │
│                                 │
│   Bạn sẽ nhận được thông báo    │
│   khi PM assign dự án mới       │
│                                 │
└─────────────────────────────────┘
```

### 12.2 No Evidence

```
┌─────────────────────────────────┐
│                                 │
│          📸                     │
│                                 │
│   Chưa có hình ảnh thi công     │
│                                 │
│   [Upload Evidence]             │
│                                 │
└─────────────────────────────────┘
```

---

## 13. OFFLINE MODE

### 13.1 Offline Indicator

```
┌─────────────────────────────────┐
│ ⚠️ Offline - Dữ liệu sẽ sync khi có mạng │
└─────────────────────────────────┘
```

**Position:** Top of screen, sticky

**Color:** Warning-bg, Warning text

### 13.2 Sync Status

```
🔄 Đang sync... (3 items)
✓ Đã sync
⚠️ Sync failed - Retry
```

---

## 14. ACCESSIBILITY

### 14.1 Color Contrast

**WCAG AA compliance:**
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

### 14.2 Font Sizes

**Minimum readable sizes:**
- Body text: 16px (prevent zoom on iOS)
- Labels: 14px minimum
- Captions: 12px minimum

### 14.3 Touch Targets

**Minimum:** 44x44px (Apple HIG)

**Recommended:** 48x48px (Material Design)

---

## 15. PERFORMANCE

### 15.1 Image Optimization

- **Thumbnails:** 200x150px, WebP format
- **Full images:** Max 1920px width, WebP/JPEG
- **Lazy loading:** Load images as user scrolls
- **Placeholder:** Low-quality image placeholder (LQIP)

### 15.2 Code Splitting

- Route-based code splitting
- Lazy load non-critical components
- Preload critical resources

### 15.3 Caching Strategy

- **Static assets:** Cache-first
- **API responses:** Network-first with cache fallback
- **Images:** Cache-first with background sync

---

**Version:** 1.0  
**Date:** 2026-02-12  
**Status:** Draft  
**Author:** SIRA Tech Team
