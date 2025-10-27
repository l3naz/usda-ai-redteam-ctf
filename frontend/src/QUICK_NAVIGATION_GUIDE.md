# Quick Navigation Guide - USDA AI Red Team Training Game

## Navigation Flow Reference

### 🗺️ Page Structure
```
Landing Page (unauthenticated)
    ↓ (after login)
Dashboard Page
    ├── Learn Page
    │   └── Module Page (LLM01-LLM10)
    ├── Play Page
    │   └── Challenge Environment
    ├── Leaderboard Page
    └── Profile Page
```

---

## 🔄 How to Navigate Between Pages

### From Any Component
```typescript
// Import the onNavigate prop
interface YourComponentProps {
  onNavigate: (page: string, data?: any) => void;
}

// Navigate to a simple page
onNavigate("learn");        // Go to Learn Page
onNavigate("play");         // Go to Play Page
onNavigate("leaderboard");  // Go to Leaderboard
onNavigate("profile");      // Go to Profile

// Navigate with data
onNavigate("modules", { vulnerabilityId: 1 });  // Go to LLM01 module
```

### Page Names Reference
| Page Name | Description | Requires Auth | Data Needed |
|-----------|-------------|---------------|-------------|
| `"home"` | Landing/Dashboard | No/Yes | None |
| `"learn"` | Learning Modules List | Yes | None |
| `"modules"` | Individual Module Detail | Yes | `{ vulnerabilityId: number }` |
| `"play"` | Challenge Simulations | Yes | None |
| `"leaderboard"` | Scoreboard | Yes | None |
| `"profile"` | User Profile | Yes | None |

---

## 📦 Data Structures

### Module Navigation Data
```typescript
// When navigating to a module
onNavigate("modules", { 
  vulnerabilityId: 1  // 1-10 for LLM01-LLM10
});
```

### Module Progress Structure
```typescript
interface ModuleProgress {
  moduleId: number;
  progress: number; // 0-100
  sectionsCompleted: {
    overview: boolean;
    quickExplainer: boolean;
    mitigation: boolean;
    interactiveLab: boolean;
    quiz: boolean;
  };
  quizScore: number | null;
  completed: boolean;
  lastAccessedDate: string;
}
```

---

## 🎯 Common Patterns

### 1. Navigate to a Specific Module
```typescript
const navigateToModule = (moduleId: number) => {
  onNavigate("modules", { vulnerabilityId: moduleId });
};

// Example: Go to Prompt Injection module
navigateToModule(1);
```

### 2. Return to Learn Page
```typescript
<Button onClick={() => onNavigate("learn")}>
  <ChevronLeft className="h-4 w-4 mr-1" />
  Back to Learning Modules
</Button>
```

### 3. Resume Last Viewed Module
```typescript
import { getLastViewedModule } from "../lib/moduleUtils";

const handleResume = () => {
  const lastViewed = getLastViewedModule();
  if (lastViewed) {
    onNavigate("modules", { vulnerabilityId: lastViewed.id });
  }
};
```

---

## 🛠️ Adding a New Page

### Step 1: Create the Page Component
```typescript
// /pages/NewPage.tsx
interface NewPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function NewPage({ onNavigate }: NewPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1>New Page</h1>
      <Button onClick={() => onNavigate("home")}>
        Go Home
      </Button>
    </div>
  );
}
```

### Step 2: Add to App.tsx Type
```typescript
// In App.tsx
type Page = "home" | "learn" | "modules" | "play" | "leaderboard" | "profile" | "newpage";
```

### Step 3: Add to Protected Pages (if needed)
```typescript
const protectedPages: Page[] = [
  "learn", 
  "modules", 
  "play", 
  "leaderboard", 
  "profile",
  "newpage" // Add here if authentication required
];
```

### Step 4: Add Render Logic
```typescript
{isAuthenticated && currentPage === "newpage" && (
  <NewPage onNavigate={handleNavigate} />
)}
```

---

## 🧭 Breadcrumb Navigation

### Standard Breadcrumb Pattern
```typescript
<Button
  variant="ghost"
  className="pl-0 text-primary hover:text-primary/80 hover:bg-transparent mb-6"
  onClick={() => onNavigate("parentPage")}
>
  <ChevronLeft className="h-4 w-4 mr-1" />
  Back to Parent Page
</Button>
```

### Multi-level Breadcrumbs
```typescript
<div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
  <button onClick={() => onNavigate("home")}>Home</button>
  <ChevronRight className="h-4 w-4" />
  <button onClick={() => onNavigate("learn")}>Learn</button>
  <ChevronRight className="h-4 w-4" />
  <span className="text-foreground">Current Module</span>
</div>
```

---

## 📊 Progress Tracking

### Access User Progress
```typescript
import { useUser } from "../context/UserContext";

function YourComponent() {
  const { userProgress } = useUser();
  
  // Check if module is completed
  const isCompleted = userProgress.completedModules.includes(moduleId);
  
  // Get module progress percentage
  const progress = userProgress.moduleProgress?.[moduleId]?.progress || 0;
  
  // Get quiz score
  const quizScore = userProgress.quizScores?.[moduleId];
}
```

### Update Progress
```typescript
const { updateProgress, completeQuiz } = useUser();

// Mark a section as complete
updateProgress(moduleId, 'overview');
updateProgress(moduleId, 'mitigation');

// Complete a quiz
completeQuiz(moduleId, 85); // 85% score
```

---

## 🎨 Smooth Navigation Animations

### Page Transition
```typescript
<div 
  className="max-w-7xl mx-auto px-6 py-8"
  style={{
    animation: 'fadeIn 0.3s ease-out',
  }}
>
  {/* Content */}
  
  <style>{`
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}</style>
</div>
```

---

## 🔐 Authentication Flow

### Check Authentication
```typescript
import { useUser } from "../context/UserContext";

function YourComponent() {
  const { user, loading } = useUser();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <LoginPrompt />;
  }
  
  return <YourContent />;
}
```

---

## 🐛 Debugging Navigation

### Check Current Page
```typescript
// In App.tsx, add console log
const handleNavigate = (page: string, data?: any) => {
  console.log('Navigating to:', page, 'with data:', data);
  // ... rest of navigation logic
};
```

### Check Module Data
```typescript
// In ModulePage.tsx
useEffect(() => {
  console.log('Module ID:', vulnerabilityId);
  console.log('Vulnerability:', vulnerability);
}, [vulnerabilityId, vulnerability]);
```

### Check User Progress
```typescript
import { useUser } from "../context/UserContext";

const { userProgress } = useUser();
console.log('User Progress:', userProgress);
```

---

## 📝 Quick Commands

### Navigate to Module by ID
```typescript
onNavigate("modules", { vulnerabilityId: 1 });  // LLM01
onNavigate("modules", { vulnerabilityId: 5 });  // LLM05
```

### Go Back to Learn
```typescript
onNavigate("learn");
```

### Go to Dashboard
```typescript
onNavigate("home");
```

### Open Play/Challenges
```typescript
onNavigate("play");
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Wrong: Hardcoded module ID
```typescript
const vulnerabilityId = 1; // Always shows LLM01!
```

### ✅ Right: Dynamic module ID
```typescript
const vulnerabilityId = props.vulnerabilityId; // Dynamic
```

### ❌ Wrong: Incorrect data structure
```typescript
onNavigate("modules", { id: 1 }); // Wrong key!
```

### ✅ Right: Correct data structure
```typescript
onNavigate("modules", { vulnerabilityId: 1 }); // Correct
```

### ❌ Wrong: Wrong page name
```typescript
onNavigate("module"); // Typo! Should be "modules"
```

### ✅ Right: Correct page name
```typescript
onNavigate("modules", { vulnerabilityId: 1 });
```

---

## 🎯 Testing Navigation

### Test Checklist
- [ ] Navigate to Learn Page
- [ ] Click on each module (LLM01-LLM10)
- [ ] Verify module content loads
- [ ] Click "Back to Learning Modules"
- [ ] Verify progress is saved
- [ ] Test Resume functionality
- [ ] Verify smooth scroll to top
- [ ] Check loading states appear
- [ ] Test error states (invalid module ID)

---

## 📚 Related Files

| File | Purpose |
|------|---------|
| `/App.tsx` | Main navigation router |
| `/pages/LearnPage.tsx` | Module list page |
| `/pages/ModulePage.tsx` | Individual module detail |
| `/context/UserContext.tsx` | User state and progress |
| `/lib/moduleUtils.ts` | Module utilities (last viewed, etc.) |
| `/lib/userProgress.ts` | Progress tracking utilities |
| `/lib/vulnerabilities.ts` | Module data source |

---

## 🎓 Best Practices

1. **Always pass onNavigate** - Every page/component should accept it as a prop
2. **Use type-safe page names** - Reference the `Page` type in App.tsx
3. **Provide navigation data** - Always pass required data (e.g., vulnerabilityId)
4. **Add loading states** - Show skeletons while data loads
5. **Handle errors** - Show friendly error messages for invalid states
6. **Smooth animations** - Add fade-in effects for better UX
7. **Breadcrumb navigation** - Always provide a way back

---

## 🆘 Need Help?

Check these files for examples:
- **Simple Navigation**: `/pages/LearnPage.tsx` line 82
- **Navigation with Data**: `/pages/LearnPage.tsx` line 82
- **Breadcrumb Button**: `/pages/ModulePage.tsx` line 137
- **Progress Tracking**: `/pages/LearnPage.tsx` line 66-84
- **Error Handling**: `/pages/ModulePage.tsx` line 121-140

---

**Last Updated**: After Learn Page routing fix
**Status**: ✅ All navigation paths working correctly
