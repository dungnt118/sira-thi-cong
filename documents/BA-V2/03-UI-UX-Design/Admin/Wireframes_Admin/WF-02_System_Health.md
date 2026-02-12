# WF-02: System Health Monitor

**Screen:** System Health Monitoring  
**Platform:** Desktop (1920x1080)  
**User Role:** Admin  
**Navigation:** Home > Monitoring > System Health  

---

## SCREEN OVERVIEW

Detailed system health monitoring dashboard showing real-time metrics for server, database, API, and application performance.

---

## LAYOUT STRUCTURE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Logo] SIRA Admin                    [🔍 Search]  [🔔]  [👤 Admin]         │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │  Home > Monitoring > System Health                               │
│  👥 Users│  ──────────────────────────────────────────────────────────────  │
│  🏢 Org  │                                                                  │
│  📊 Data │  ┌──────────────────────────────────────────────────────────┐   │
│  🔧 System│  │ SERVER METRICS                                           │   │
│  🔒 Security│ ├──────────────────────────────────────────────────────────┤   │
│  📈 Monitor│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  ⚙️ Settings│ │ │ CPU      │ │ Memory   │ │ Disk     │ │ Network  │   │   │
│          │  │ │ 45%      │ │ 62%      │ │ 35%      │ │ 12 MB/s  │   │   │
│          │  │ │ [Chart]  │ │ [Chart]  │ │ [Chart]  │ │ [Chart]  │   │   │
│          │  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│          │  └──────────────────────────────────────────────────────────┘   │
│          │                                                                  │
│          │  ┌──────────────────────────────────────────────────────────┐   │
│          │  │ DATABASE PERFORMANCE                                     │   │
│          │  ├──────────────────────────────────────────────────────────┤   │
│          │  │ Queries/sec: 245  |  Avg Query Time: 15ms  |  Slow: 3   │   │
│          │  │ [Line Chart: Query Performance Last Hour]                │   │
│          │  │                                                          │   │
│          │  │ Top Slow Queries:                                        │   │
│          │  │ 1. SELECT * FROM projects WHERE... (450ms) [Optimize]   │   │
│          │  │ 2. UPDATE evidence SET status... (320ms) [Optimize]     │   │
│          │  └──────────────────────────────────────────────────────────┘   │
│          │                                                                  │
│          │  ┌──────────────────────────────────────────────────────────┐   │
│          │  │ API PERFORMANCE                                          │   │
│          │  ├──────────────────────────────────────────────────────────┤   │
│          │  │ Requests/sec: 120  |  Avg Response: 120ms  |  Errors: 2 │   │
│          │  │ [Bar Chart: Endpoint Response Times]                     │   │
│          │  └──────────────────────────────────────────────────────────┘   │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

---

**Status:** ✅ Complete
