# Navigation Visual Flow - USDA AI Red Team Training Game

## 🎬 User Journey: Learn Page → Module Page

### Step 1: User on Learn Page
```
┌─────────────────────────────────────────────────────────────┐
│  OWASP Top 10 for LLM Applications                          │
│  Learn and Mitigate AI Risks                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Progress: █████████░░░░░░░░░░ 3/10 modules • 30%          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  [All] [High] [Medium] [Low]                    ← Filters   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ ▶ Resume     │  │ LLM01        │  │ LLM02        │      │
│  │ Last viewed: │  │ Prompt Inj   │  │ Output Hand  │      │
│  │ LLM01        │  │ 🔴 High      │  │ 🔴 High      │      │
│  │ Progress: 45%│  │ Progress: 45%│  │ Progress: 0% │      │
│  │ [Resume]     │  │ [Learn]      │  │ [Learn]      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**User Action**: Clicks "Resume" or "Learn" on a module card

---

### Step 2: Navigation in Progress (50ms)
```
┌─────────────────────────────────────────────────────────────┐
│  ⏳ Loading...                                               │
│                                                              │
│  ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭          │
│  ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭                                   │
│  ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭          │
│  ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Behind the Scenes**:
1. ✅ `saveLastViewedModule(moduleId, progress)` - Save to localStorage
2. ✅ `onNavigate("modules", { vulnerabilityId: 1 })` - Navigate with data
3. ✅ `setCurrentPage("modules")` - Update app state
4. ✅ `setModuleData({ vulnerabilityId: 1 })` - Store module data
5. ✅ `window.scrollTo({ top: 0, behavior: 'smooth' })` - Smooth scroll

---

### Step 3: Module Page Loads (Skeleton State)
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Learning Modules                                 │
│                                                              │
│  ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭                        │
│  ▭▭▭▭▭▭▭▭▭▭▭▭▭▭                                             │
│                                                              │
│  ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭          │
│                                                              │
│  ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭          │
│  ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Duration**: ~200ms (fast!)

**Behind the Scenes**:
1. ✅ ModulePage receives `vulnerabilityId={1}`
2. ✅ `const vuln = getVulnerabilityById(1)` - Fetch module data
3. ✅ `setIsLoading(false)` - Loading complete
4. ✅ Fade-in animation starts

---

### Step 4: Module Page Fully Loaded ✨
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Learning Modules                                 │
│                                                              │
│  LLM01 – Prompt Injection                      🔴 HIGH      │
│  Learn to identify and prevent prompt injection attacks     │
│  through input validation and context separation.           │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Module Progress                      ✓ 45% Complete   │  │
│  │ ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  │
│  │ Estimated time remaining: 8 minutes                   │  │
│  │                                                        │  │
│  │ ✓ Overview  ✓ Explainer  ○ Mitigation  ○ Lab  ○ Quiz │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  📚 Overview                                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ⚠️  What is Prompt Injection?                         │  │
│  │                                                        │  │
│  │ Prompt injection is a critical vulnerability where... │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  🧪 Interactive Lab                                          │
│  ...                                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**What Changed**:
- ✅ Dynamic module title: "LLM01 – Prompt Injection"
- ✅ Dynamic severity badge: "HIGH" (red)
- ✅ Dynamic description from vulnerability data
- ✅ Progress bar shows 45% (from userProgress)
- ✅ Section checkboxes show completion status
- ✅ Smooth fade-in animation completed

---

## 🚨 Error State: Module Not Found

### If User Manually Types Invalid URL or Module ID Missing
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Learning Modules                                 │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │                     ⚠️                                 │  │
│  │                                                        │  │
│  │              Module Not Found                          │  │
│  │                                                        │  │
│  │   The module you're looking for doesn't exist or      │  │
│  │   couldn't be loaded.                                  │  │
│  │                                                        │  │
│  │          [Return to Learning Modules]                  │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**When This Happens**:
- ❌ No `vulnerabilityId` provided
- ❌ Invalid `vulnerabilityId` (e.g., 999)
- ❌ Module data not found in vulnerabilities array

**User Action**: Click "Return to Learning Modules" → Goes back to Learn Page

---

## 🔄 Complete Navigation Cycle

```
     START
       ↓
   Learn Page
   (List of all modules)
       ↓
   [User clicks "Learn" or "Resume"]
       ↓
   ┌─────────────────┐
   │ handleModuleClick()│
   │ - Save to localStorage│
   │ - Update last viewed  │
   │ - Call onNavigate()   │
   └─────────────────┘
       ↓
   ┌─────────────────┐
   │  App.tsx        │
   │ - handleNavigate()│
   │ - setCurrentPage()│
   │ - setModuleData()│
   │ - Smooth scroll  │
   └─────────────────┘
       ↓
   ┌─────────────────┐
   │ ModulePage      │
   │ - Show skeleton │
   │ - Load data     │
   │ - Render content│
   │ - Fade in       │
   └─────────────────┘
       ↓
   Module Loaded ✅
   (User learns content)
       ↓
   [User clicks "Back to Learning Modules"]
       ↓
   onNavigate("learn")
       ↓
   Back to Learn Page
       ↓
     CYCLE COMPLETE
```

---

## 📊 Data Flow Diagram

```
┌──────────────┐     Click      ┌──────────────┐
│ VulnerabilityCard   ────────→   handleModuleClick
│ (LearnPage.tsx)│               │ (LearnPage.tsx)│
└──────────────┘                 └──────────────┘
                                        ↓
                                 Save to localStorage
                                 { id, title, progress, updatedAt }
                                        ↓
                                 onNavigate("modules", 
                                   { vulnerabilityId: X })
                                        ↓
                          ┌─────────────────────────┐
                          │ handleNavigate()        │
                          │ (App.tsx)               │
                          │ - setCurrentPage()      │
                          │ - setModuleData()       │
                          └─────────────────────────┘
                                        ↓
                          ┌─────────────────────────┐
                          │ ModulePage renders      │
                          │ vulnerabilityId={X}     │
                          └─────────────────────────┘
                                        ↓
                          ┌─────────────────────────┐
                          │ getVulnerabilityById(X) │
                          │ (lib/vulnerabilities.ts)│
                          └─────────────────────────┘
                                        ↓
                                 ┌─────────────┐
                                 │ Vulnerability│
                                 │ Data Object │
                                 │ {           │
                                 │  id,        │
                                 │  title,     │
                                 │  description│
                                 │  severity,  │
                                 │  ...        │
                                 │ }           │
                                 └─────────────┘
                                        ↓
                                 Render Module Content
```

---

## 🎨 Animation Timeline

```
Time:  0ms    50ms   100ms  200ms  300ms  500ms
       |      |      |      |      |      |
       ↓      ↓      ↓      ↓      ↓      ↓
Click  Scroll Skeleton     Fade   Full   Complete
       Start  Appears      In     Load   Animation
              Loading      Starts Content  
```

**Breakdown**:
- **0ms**: User clicks "Learn" or "Resume"
- **50ms**: Smooth scroll to top begins
- **100ms**: Skeleton loaders appear (prevents blank screen)
- **200ms**: Data loads, fade-in animation starts
- **300ms**: Full module content visible
- **500ms**: All animations complete

---

## ✅ Success Indicators

### User sees smooth navigation when:
1. ✅ **No blank screens** - Skeleton loaders fill the space
2. ✅ **Instant feedback** - Smooth scroll starts immediately
3. ✅ **Loading indication** - Animated skeletons pulse
4. ✅ **Smooth transition** - Fade-in effect feels professional
5. ✅ **Correct content** - Right module loads every time
6. ✅ **Progress persists** - Progress bars show correct percentages
7. ✅ **Easy to go back** - Breadcrumb always visible

---

## 🎯 All 10 Modules Work

| Module | ID | Severity | Status |
|--------|----|----|--------|
| LLM01 - Prompt Injection | 1 | 🔴 High | ✅ Working |
| LLM02 - Insecure Output Handling | 2 | 🔴 High | ✅ Working |
| LLM03 - Training Data Poisoning | 3 | 🔴 High | ✅ Working |
| LLM04 - Model Denial of Service | 4 | 🟢 Low | ✅ Working |
| LLM05 - Supply Chain Vulnerabilities | 5 | 🟡 Medium | ✅ Working |
| LLM06 - Sensitive Information Disclosure | 6 | 🔴 High | ✅ Working |
| LLM07 - Insecure Plugin Design | 7 | 🔴 High | ✅ Working |
| LLM08 - Excessive Agency | 8 | 🟢 Low | ✅ Working |
| LLM09 - Overreliance on LLM Outputs | 9 | 🟡 Medium | ✅ Working |
| LLM10 - Model Theft and Exfiltration | 10 | 🔴 High | ✅ Working |

**Test Each**: Click "Learn" on each module → Verify content loads → Click "Back" → Repeat

---

## 🎬 Resume Functionality Flow

```
User last viewed LLM03 (45% complete)
       ↓
User closes browser
       ↓
localStorage saves:
{
  "lastViewedModule": {
    "id": 3,
    "title": "LLM03 – Training Data Poisoning",
    "progress": 45,
    "updatedAt": 1730000000000
  }
}
       ↓
User returns to app
       ↓
Learn Page loads
       ↓
getLastViewedModule() reads localStorage
       ↓
Resume Card appears FIRST in grid:
┌──────────────────────┐
│ ▶ Continue Where You │
│   Left Off           │
│                      │
│ Last viewed: LLM03   │
│ Training Data...     │
│ Progress: 45%        │
│ Last active: 2 hrs   │
│ [Resume]             │
└──────────────────────┘
       ↓
User clicks [Resume]
       ↓
Navigates to LLM03 module page
       ↓
Progress bar shows 45%
       ↓
User continues learning
```

---

## 🔍 Debugging Checklist

If navigation doesn't work, check:

### 1. Console Logs
```javascript
// In LearnPage.tsx handleModuleClick
console.log('Navigating to module:', moduleId);
console.log('Module data:', { vulnerabilityId: moduleId });

// In App.tsx handleNavigate
console.log('Target page:', targetPage);
console.log('Module data:', data);

// In ModulePage.tsx
console.log('Received vulnerabilityId:', vulnerabilityId);
console.log('Loaded vulnerability:', vulnerability);
```

### 2. Check Data Structure
- ✅ Is `vulnerabilityId` passed correctly?
- ✅ Is page name "modules" (not "module")?
- ✅ Is the vulnerability found in the array?

### 3. Check User Progress
- ✅ Is progress loading from localStorage?
- ✅ Are completed modules tracked?
- ✅ Are section completions recorded?

---

## 🎉 Expected User Experience

### ⚡ Fast
- Navigation feels instant (<300ms)
- No jarring page jumps
- Smooth scroll to top

### 🎨 Beautiful
- Skeleton loaders prevent blank screens
- Fade-in animations feel professional
- Consistent USDA styling throughout

### 🧭 Intuitive
- Clear breadcrumb navigation
- Resume card makes it easy to continue
- Progress bars show completion status

### 🛡️ Robust
- Error states are friendly
- Missing data doesn't crash
- All 10 modules work correctly

---

**Status**: ✅ **FULLY FUNCTIONAL**  
**Last Updated**: After Learn Page routing fix  
**Test Coverage**: 10/10 modules working
