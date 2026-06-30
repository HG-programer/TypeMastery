import { useEffect, useMemo, useState, useRef } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

type Mode = 'Focus' | 'Speed' | 'Precision' | 'Python' | 'Web Dev' | 'Data' | 'Custom';

const PYTHON_SNIPPETS = [
  { language: 'Python', icon: '🐍', color: '#86efac', text: 'def binary_search(arr, target):' },
  { language: 'Python', icon: '🐍', color: '#86efac', text: 'return [x for x in data if x > 0]' },
  { language: 'Python', icon: '🐍', color: '#86efac', text: 'class User(db.Model):' },
  { language: 'Python', icon: '🐍', color: '#86efac', text: 'if __name__ == "__main__":' },
  { language: 'Python', icon: '🐍', color: '#86efac', text: 'for index, item in enumerate(items):' },
  { language: 'Python', icon: '🐍', color: '#86efac', text: 'def __init__(self, name, age):' },
  { language: 'Python', icon: '🐍', color: '#86efac', text: 'with open("data.txt", "r") as f:' },
  { language: 'Python', icon: '🐍', color: '#86efac', text: 'try: result = 10 / x' },
  { language: 'Python', icon: '🐍', color: '#86efac', text: 'except ZeroDivisionError as e:' },
  { language: 'Python', icon: '🐍', color: '#86efac', text: '@app.route("/api/users", methods=["GET"])' }
];

const WEB_DEV_SNIPPETS = [
  { language: 'React', icon: '⚛️', color: '#61dafb', text: 'const [state, setState] = useState(null);' },
  { language: 'React', icon: '⚛️', color: '#61dafb', text: 'useEffect(() => { fetchData(); }, []);' },
  { language: 'React', icon: '⚛️', color: '#61dafb', text: 'export default function App() {' },
  { language: 'JavaScript', icon: '⚡', color: '#fde047', text: 'const response = await fetch(url);' },
  { language: 'JavaScript', icon: '⚡', color: '#fde047', text: 'document.getElementById("btn").addEventListener("click", () => {' },
  { language: 'TypeScript', icon: '🔷', color: '#60a5fa', text: 'interface UserProps { name: string; }' },
  { language: 'HTML', icon: '🌐', color: '#fdba74', text: '<button type="submit" class="btn">' },
  { language: 'CSS', icon: '🎨', color: '#93c5fd', text: 'display: flex; justify-content: center;' },
  { language: 'CSS', icon: '🎨', color: '#93c5fd', text: '@media (max-width: 768px) {' }
];

const DATA_SNIPPETS = [
  { language: 'SQL', icon: '🗄️', color: '#9ca3af', text: 'SELECT * FROM users WHERE status = "active";' },
  { language: 'SQL', icon: '🗄️', color: '#9ca3af', text: 'LEFT JOIN orders ON users.id = orders.user_id' },
  { language: 'SQL', icon: '🗄️', color: '#9ca3af', text: 'GROUP BY category_id HAVING count > 10' },
  { language: 'SQL', icon: '🗄️', color: '#9ca3af', text: 'INSERT INTO logs (level, message) VALUES' },
  { language: 'Pandas', icon: '🐼', color: '#150458', text: 'import pandas as pd' },
  { language: 'Pandas', icon: '🐼', color: '#150458', text: 'df = pd.read_csv("dataset.csv")' },
  { language: 'Pandas', icon: '🐼', color: '#150458', text: 'df.groupby("category")["sales"].sum()' },
  { language: 'Pandas', icon: '🐼', color: '#150458', text: 'df.dropna(subset=["price"], inplace=True)' },
  { language: 'Pandas', icon: '🐼', color: '#150458', text: 'df["date"] = pd.to_datetime(df["date"])' }
];

type HistoryItem = {
  wpm: number;
  accuracy: number;
  mode: Mode;
  date: string;
  timestamp?: number;
};

type StreakData = {
  current: number;
  best: number;
  lastPracticeDate: string;
};

type XpData = {
  total: number;
  level: number;
};

type AchievementContext = {
  wpm: number;
  accuracy: number;
  mode: Mode;
  streak: number;
  level: number;
  modeCounts: Record<string, number>;
  totalRounds: number;
  prevBest: number;
};

type AchievementDef = {
  id: string;
  name: string;
  icon: string;
  description: string;
  check: (ctx: AchievementContext) => boolean;
};

type FaqItem = {
  question: string;
  answer: string;
};

type GuideArticle = {
  label: string;
  title: string;
  content: string[];
};

const FOCUS_SETS = [
  'time mile clear group winter shift create rhythm simple speed typing focus',
  'water world plant stand light under cross round story point north start',
  'where white sound place every large animal state great small night often',
  'leave paper space story never reach earth above carry watch miles young',
  'plant earth cover state begin never under while point might story often',
  'group always those carry right clear watch water plant story under white',
  'every north state never white reach small above leave where earth miles',
  'sound large stand light point those young right often never animal round',
  'cross where always group white rhythm water shift typing speed simple time',
  'focus typing clear simple rhythm time speed shift water group always clear'
];

const SPEED_SETS = [
  'The quick brown fox jumps over the lazy dog as it runs across the field.',
  'If you can keep your head when all about you are losing theirs and blaming it on you.',
  'Design is not just what it looks like and feels like. Design is how it works.',
  'The dashboard should feel fast, readable, and confident even when the user is moving quickly.',
  'Good writers borrow, great writers steal. But the best typists just practice every day.',
  'In the middle of difficulty lies opportunity, especially if you learn to type without looking.',
  'Simplicity is the ultimate sophistication when it comes to user interfaces and fast web apps.',
  'Typing quickly is less about rushing your fingers and more about trusting your muscle memory.',
  'The only way to do great work is to love what you do, and type it out at light speed.',
  'Success is not final, failure is not fatal: it is the courage to continue that counts.'
];

const PRECISION_SETS = [
  'User_ID: 9812-X (active); status="confirmed", balance=$4,291.50!',
  '[{ "name": "Admin", "id": 42 }, { "name": "Guest", "id": 7 }]',
  'const URL = "https://api.example.com/v1/users?limit=50&sort=desc";',
  'SELECT id, email, created_at FROM users WHERE id IN (10, 20, 30);',
  'If x = 10 and y = -5.5, then (x + y) * 2 = 9.0 (approx.)',
  'Date format: YYYY-MM-DD (e.g., 2026-10-31), Time: 14:30:00 UTC.',
  '<button class="btn-primary" onClick={handleEvent}>Submit</button>',
  'Email support at: help@domain.com or call 1-800-555-0199.',
  'The regex /^[a-zA-Z0-9]+$/ matches alphanumeric characters only.',
  '#Header 1 \\n ##Header 2 \\n [Link Text](https://link.com/)'
];

const MODE_DETAILS: Record<Mode, string> = {
  Focus: 'Balanced pace, error review, and daily consistency.',
  Speed: 'Higher target cadence with shorter reset windows.',
  Precision: 'Punishes misses and rewards clean streaks.',
  Python: 'Practice pure Python syntax, loops, and logic.',
  'Web Dev': 'React hooks, HTML, CSS, and JavaScript basics.',
  Data: 'SQL queries, Pandas, and data processing syntax.',
  Custom: 'Paste your own code or text to practice on.',
};

const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first-steps', name: 'First Steps', icon: '🏁', description: 'Complete your first round', check: (c) => c.totalRounds >= 1 },
  { id: 'speed-demon', name: 'Speed Demon', icon: '⚡', description: 'Hit 60+ WPM', check: (c) => c.wpm >= 60 },
  { id: 'rocket-fingers', name: 'Rocket Fingers', icon: '🚀', description: 'Hit 80+ WPM', check: (c) => c.wpm >= 80 },
  { id: 'perfectionist', name: 'Perfectionist', icon: '💯', description: '100% accuracy on any round', check: (c) => c.accuracy === 100 },
  { id: 'on-fire', name: 'On Fire', icon: '🔥', description: '3-day streak', check: (c) => c.streak >= 3 },
  { id: 'unstoppable', name: 'Unstoppable', icon: '🏆', description: '7-day streak', check: (c) => c.streak >= 7 },
  { id: 'pythonista', name: 'Pythonista', icon: '🐍', description: 'Complete 10 Python rounds', check: (c) => (c.modeCounts['Python'] || 0) >= 10 },
  { id: 'react-native', name: 'React Pro', icon: '⚛️', description: 'Complete 10 Web Dev rounds', check: (c) => (c.modeCounts['Web Dev'] || 0) >= 10 },
  { id: 'data-wizard', name: 'Data Wizard', icon: '🗄️', description: 'Complete 10 Data rounds', check: (c) => (c.modeCounts['Data'] || 0) >= 10 },
  { id: 'custom-crafter', name: 'Custom Crafter', icon: '✏️', description: 'Complete 5 Custom rounds', check: (c) => (c.modeCounts['Custom'] || 0) >= 5 },
  { id: 'improver', name: 'Improver', icon: '📈', description: 'Beat your previous best WPM', check: (c) => c.wpm > c.prevBest && c.prevBest > 0 },
  { id: 'level-5', name: 'Level 5', icon: '⭐', description: 'Reach Level 5', check: (c) => c.level >= 5 },
];


const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Is this typing speed test free?',
    answer:
      'Yes. Keyflow is a static client-only app, so it can be hosted free without server costs or backend infrastructure. That matters if you want a typing practice website that can scale with traffic instead of with server bills. A static host such as GitHub Pages, Cloudflare Pages, or Netlify can serve the page quickly, and the browser handles the typing test locally. That keeps the site simple to maintain, improves crawlability, and makes it easier to focus on search intent: users land on the page and start typing immediately instead of waiting for an app shell or login flow.',
  },
  {
    question: 'How is this different from Keybr?',
    answer:
      'It focuses on a cleaner ad-ready interface, local history, and a content hub that supports both beginners and advanced practice. The goal is to make the page feel more like a useful resource hub and less like a single-purpose test page. That means visible navigation, useful guides, and room for monetization later without burying the typing speed test. It also gives you a path to topical authority because the site can grow from one experience into a cluster of related pages about typing practice for beginners, touch typing drills, and speed improvement tips.',
  },
  {
    question: 'Can I add ads later?',
    answer:
      'Yes. The layout already includes reserved ad slots and clear content boundaries so monetization can be added later without a redesign. That is important because ads work best when they do not interrupt the user’s primary task. If the site keeps its structure clean, you can introduce display ads, affiliate placements, or sponsorship blocks once traffic grows, while still protecting mobile performance and the page’s usefulness. That balance helps the site stay trustworthy while creating a future revenue path.',
  },
];

const SEO_KEYWORDS = [
  'typing speed test',
  'typing practice for beginners',
  'learn touch typing',
  'improve typing speed',
];

const GUIDE_ARTICLES: GuideArticle[] = [
  {
    label: 'Typing tips',
    title: 'How to improve typing speed without sacrificing accuracy',
    content: [
      'If your goal is to improve typing speed, the fastest path is not to rush the clock. It is to build a repeatable rhythm that makes every keypress cheaper for your brain to process. Start with a typing speed test so you can see your baseline, then practice with short sessions that keep your focus high. Ten minutes of accurate work every day will usually beat one long session where you drift, correct, and lose concentration. The best typing practice for beginners is simple enough that your hands can learn the pattern while your eyes stay on the text.',
      'Use the first minute of every session to warm up with easy sequences, then move into longer phrases that include spaces and punctuation. That mixture matters because real search traffic often comes from people looking for a typing speed test, touch typing practice, or a way to learn typing for work and school. If the page gives them the test instantly and then offers a clear path to practice, it satisfies search intent and keeps them engaged. Track accuracy first, because clean typing on a free static site is a better sign of progress than a noisy score that jumps around.',
    ],
  },
  {
    label: 'Touch typing',
    title: 'Learn touch typing with structured finger patterns',
    content: [
      'To learn touch typing, start by understanding that speed is a byproduct of consistent finger placement. A good typing practice website should not overwhelm the user with too much text or too many controls. Instead, it should present a clear prompt, a visible progress bar, and feedback that tells the user whether the pattern is correct. This is the core of a usable typing speed test: the user starts immediately, sees the target text, and gets a score that feels trustworthy.',
      'This page is designed to support that behavior with several layers of topical authority. It includes beginner-friendly drills, content that explains how to improve typing speed, and local storage so returning users can see their history without creating a server bill. That makes it easier to keep the site fast on mobile and to host it for free on static infrastructure. Over time, you can add blog posts, lesson pages, and downloadable practice sheets that link back to the typing test. Those internal links help crawlers understand the relationship between the pages and build authority around the topic of typing practice.',
    ],
  },
  {
    label: 'Routine',
    title: 'Ergonomics, shortcuts, and practice routines that stick',
    content: [
      'Typing speed is not only about finger speed. It also depends on posture, keyboard position, and how long you can stay comfortable without tension. Keep your wrists neutral, place the keyboard close enough that your elbows can relax, and raise the screen so you are not looking down for long sessions. Those ergonomics details matter because a typing practice website should help users build sustainable habits, not just chase one score spike. If you are writing content for search, terms like ergonomic typing setup, comfortable typing practice, and typing speed test for beginners are natural additions that match real user intent.',
      'Shortcuts can also improve productivity once your base typing rhythm is stable. Learn browser shortcuts, tab navigation, copy and paste, and the shortcuts you use most in your own work. Then combine that with a practice routine: one warm-up drill, one accuracy drill, and one timed run. That structure is easy to repeat, easy to measure, and easy to explain in a blog post or FAQ. If you want topical authority, build content around routines, not only scores, so the site becomes a resource people return to when they want to improve typing speed week after week.',
    ],
  },
  {
    label: 'Python typing',
    title: 'How to type faster in Python: syntax drills for developers',
    content: [
      'Python relies heavily on colons, underscores (snake_case), and strict indentation. If your hands hesitate when reaching for the colon or the underscore key, your programming speed will suffer even if your English prose typing is fast. The best way to type faster in Python is to practice on actual code snippets. A Python typing test forces you to build muscle memory for common patterns like "def __init__(self):" and list comprehensions without looking at the keyboard.',
      'To build this skill, switch to the Python mode on our typing speed test. Practice hitting the underscore with your right pinky (using shift) and the colon with your right pinky. Spend five minutes a day specifically drilling these programming symbols. Over time, your raw WPM will translate into real coding speed because you won\'t need to break your mental flow to hunt for syntax characters.',
    ],
  },
  {
    label: 'React typing',
    title: 'Best typing practice for React and JavaScript developers',
    content: [
      'JavaScript and React development involve a massive amount of camelCase typing, curly braces, parentheses, and arrow functions (=>). If you are slow at typing these symbols, your component creation process will feel sluggish. Typing practice for React developers should focus on the exact hooks and JSX structures you write every day: "useState", "useEffect", and HTML-like tags.',
      'Our Web Dev typing test mode is designed specifically for this. It mixes JavaScript logic with HTML and CSS syntax. By practicing these snippets, you train your hands to navigate brackets and camelCase seamlessly. Combine this with editor snippets and autocomplete, and you will see a massive improvement in your daily development velocity.',
    ],
  },
  {
    label: 'SQL typing',
    title: 'Typing practice for data engineers: SQL and Pandas drills',
    content: [
      'Data engineering and data science require typing long SQL queries in ALL CAPS, mixed with string manipulation and Pandas dataframe operations. Typing "SELECT * FROM" or "df.groupby" repeatedly without typos requires specific muscle memory. If you want to improve your typing speed for data work, you need drills that mix uppercase keywords with snake_case table names.',
      'The Data mode provides targeted typing practice for SQL and Python Pandas. By drilling these specific data pipelines, you learn to keep your hands on the home row while reaching for the shift key and bracket keys. This reduces typos in your queries and helps you stay focused on the data analysis rather than the mechanics of typing.',
    ],
  },
  {
    label: 'Daily practice',
    title: 'Why five minutes of daily typing practice beats one weekly marathon',
    content: [
      'When learning touch typing or trying to improve your typing speed, consistency is far more important than duration. Practicing for an hour once a week usually leads to fatigue, bad posture, and reinforced mistakes. Instead, committing to just five minutes of typing practice every single day allows your brain to consolidate the motor patterns during sleep. This is the secret to breaking through a WPM plateau.',
      'To build this habit, use the streak tracker on this typing speed test. Log in daily, complete the Daily Challenge snippet, and watch your streak grow. This gamified approach ensures you get your targeted syntax practice without burning out. Over a month of daily five-minute sessions, most users see a 10 to 15 WPM increase in their baseline typing speed.',
    ],
  },
];

const STORAGE_KEY = 'keyflow-history';
const FULL_HISTORY_KEY = 'typemastery-full-history';
const STREAK_KEY = 'typemastery-streak';
const XP_KEY = 'typemastery-xp';
const ACHIEVEMENTS_KEY = 'typemastery-achievements';
const MODE_COUNTS_KEY = 'typemastery-mode-counts';

function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

const rawUrl = import.meta.env.VITE_SITE_URL;
const SITE_URL = typeof rawUrl === 'string' && isSafeUrl(rawUrl) ? rawUrl : '';

function loadHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

function loadFullHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(FULL_HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch { return []; }
}

function loadStreak(): StreakData {
  const empty: StreakData = { current: 0, best: 0, lastPracticeDate: '' };
  if (typeof window === 'undefined') return empty;
  try {
    const raw = window.localStorage.getItem(STREAK_KEY);
    return raw ? (JSON.parse(raw) as StreakData) : empty;
  } catch { return empty; }
}

function loadXp(): XpData {
  const empty: XpData = { total: 0, level: 0 };
  if (typeof window === 'undefined') return empty;
  try {
    const raw = window.localStorage.getItem(XP_KEY);
    return raw ? (JSON.parse(raw) as XpData) : empty;
  } catch { return empty; }
}

function loadUnlockedAchievements(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(ACHIEVEMENTS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
}

function loadModeCounts(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(MODE_COUNTS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch { return {}; }
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function calculateLevel(totalXp: number): number {
  return Math.floor(Math.sqrt(totalXp / 50));
}

function xpForLevel(level: number): number {
  return level * level * 50;
}


function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

let audioCtx: AudioContext | null = null;
function playKeystroke() {
  if (typeof window === 'undefined') return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.02);
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.02);
}

function calculateStats(source: string, typed: string, startedAt: number | null, finishedAt: number | null) {
  const effectiveLength = typed.length || 1;
  let matches = 0;
  for (let index = 0; index < Math.min(source.length, typed.length); index += 1) {
    if (source[index] === typed[index]) matches += 1;
  }

  const end = finishedAt || (startedAt ? Date.now() : null);
  const totalSeconds = startedAt && end ? Math.max((end - startedAt) / 1000, 0.001) : 0;
  const elapsedMinutes = totalSeconds > 0 ? totalSeconds / 60 : 0;
  const grossWpm = elapsedMinutes > 0 ? Math.round((typed.length / 5) / elapsedMinutes) : 0;
  const accuracy = Math.round((matches / effectiveLength) * 100);
  const adjustedWpm = Math.max(0, Math.round(grossWpm * (accuracy / 100)));

  return { grossWpm, accuracy, adjustedWpm };
}

function pickPracticeSet(mode: Mode, index: number, customText?: string) {
  if (mode === 'Custom') {
    return {
      label: 'Custom',
      title: 'Type Your Own Code',
      description: 'Practice on your own snippet or code block.',
      text: customText || 'Please paste your code below to begin.',
    };
  }

  if (mode === 'Python') {
    const snippet = PYTHON_SNIPPETS[index % PYTHON_SNIPPETS.length];
    return {
      label: 'Python',
      title: 'Python Master',
      description: 'Practice pure Python syntax, loops, and logic.',
      text: snippet.text,
      language: snippet.language,
      icon: snippet.icon,
      color: snippet.color,
    };
  }

  if (mode === 'Web Dev') {
    const snippet = WEB_DEV_SNIPPETS[index % WEB_DEV_SNIPPETS.length];
    return {
      label: 'Web Dev',
      title: 'React / Web Dev',
      description: 'React hooks, HTML, CSS, and JavaScript basics.',
      text: snippet.text,
      language: snippet.language,
      icon: snippet.icon,
      color: snippet.color,
    };
  }

  if (mode === 'Data') {
    const snippet = DATA_SNIPPETS[index % DATA_SNIPPETS.length];
    return {
      label: 'Data',
      title: 'Data Engineer',
      description: 'SQL queries, Pandas, and data processing syntax.',
      text: snippet.text,
      language: snippet.language,
      icon: snippet.icon,
      color: snippet.color,
    };
  }
  
  if (mode === 'Speed') {
    return {
      label: 'Speed',
      title: 'Conversational Flow',
      description: 'Longer real-world phrases to push your maximum WPM.',
      text: SPEED_SETS[index % SPEED_SETS.length],
    };
  }

  if (mode === 'Precision') {
    return {
      label: 'Precision',
      title: 'Complex Text',
      description: 'A denser drill for accuracy with punctuation and numbers.',
      text: PRECISION_SETS[index % PRECISION_SETS.length],
    };
  }

  // Focus
  return {
    label: 'Focus',
    title: 'Rhythm ladder',
    description: 'Short words that build finger flow without extra noise.',
    text: FOCUS_SETS[index % FOCUS_SETS.length],
  };
}

function StreakBadge({ streak }: { streak: number }) {
  if (streak < 2) return null;
  return (
    <div className="streak-badge" title={`${streak} day streak!`}>
      🔥 {streak}
    </div>
  );
}

function XpBar({ xpData }: { xpData: XpData }) {
  const currentLevelXp = xpForLevel(xpData.level);
  const nextLevelXp = xpForLevel(xpData.level + 1);
  const progressToNext = Math.min(100, Math.max(0, ((xpData.total - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));

  return (
    <div className="xp-bar-container">
      <div className="xp-bar-header">
        <span className="level-text">Level {xpData.level || 1}</span>
        <span className="xp-text">{xpData.total} / {nextLevelXp} XP</span>
      </div>
      <div className="xp-bar" aria-hidden="true">
        <div className="xp-fill" style={{ width: `${progressToNext}%` }} />
      </div>
    </div>
  );
}

function ProgressChart({ history }: { history: HistoryItem[] }) {
  if (history.length < 2) return null;

  // We want chronological order for the chart (left to right)
  const chartData = [...history].reverse();
  const maxWpm = Math.max(...chartData.map(d => d.wpm), 10);
  const minWpm = Math.max(0, Math.min(...chartData.map(d => d.wpm)) - 10);
  
  const wX = (index: number) => (index / (chartData.length - 1)) * 100;
  const wY = (wpm: number) => 100 - (((wpm - minWpm) / (maxWpm - minWpm)) * 100);

  const points = chartData.map((d, i) => `${wX(i)},${wY(d.wpm)}`).join(' ');
  const areaPoints = `0,100 ${points} 100,100`;

  const firstWpm = chartData[0].wpm;
  const lastWpm = chartData[chartData.length - 1].wpm;
  const diff = lastWpm - firstWpm;
  const isUp = diff >= 0;

  return (
    <section className="progress-chart-section">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Analytics</p>
          <h2>WPM Progress</h2>
        </div>
        <div className={`trend-badge ${isUp ? 'trend-up' : 'trend-down'}`}>
          {isUp ? '↑' : '↓'} {Math.abs(diff)} WPM
        </div>
      </div>
      <svg className="progress-chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height: '120px', overflow: 'visible' }}>
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#chartFill)" />
        <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {chartData.map((d, i) => (
          <circle key={i} cx={wX(i)} cy={wY(d.wpm)} r="2" fill="var(--panel)" stroke="var(--accent)" strokeWidth="1.5">
            <title>{d.wpm} WPM on {d.date}</title>
          </circle>
        ))}
      </svg>
    </section>
  );
}

function AchievementsPanel({ unlockedIds }: { unlockedIds: string[] }) {
  return (
    <section className="achievements-section" id="achievements">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Gamification</p>
          <h2>Achievements</h2>
        </div>
        <p>{unlockedIds.length} / {ACHIEVEMENTS.length} unlocked</p>
      </div>
      <div className="achievement-grid">
        {ACHIEVEMENTS.map(badge => {
          const isUnlocked = unlockedIds.includes(badge.id);
          return (
            <div key={badge.id} className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`} title={badge.description}>
              <span className="achievement-icon">{badge.icon}</span>
              <strong>{isUnlocked ? badge.name : '???'}</strong>
              <small>{badge.description}</small>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SeoSchema() {
  useEffect(() => {
    const existing = document.getElementById('keyflow-schema');
    const data = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'TypeMastery',
      applicationCategory: 'EducationalApplication',
      description:
        'A static typing speed test and typing practice website with beginner drills, local stats, and a distraction-free interface.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      keyword: SEO_KEYWORDS.join(', '),
      featureList: [
        'Typing speed test',
        'Typing practice for beginners',
        'Touch typing practice',
        'Local session history',
      ],
      faq: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };

    if (existing) {
      existing.textContent = JSON.stringify(data);
      return;
    }

    const script = document.createElement('script');
    script.id = 'keyflow-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }, []);

  return null;
}

function ShareCard({ score, mode, language, accentColor }: { score: number; mode: Mode; language?: string; accentColor?: string }) {
  const [message, setMessage] = useState('');

  const shareScore = async () => {
    const shareUrl = SITE_URL || window.location.href;
    const subtitle = language ? `${mode} Mode - ${language}` : `${mode} Mode`;
    const shareText = `I scored ${score} WPM on TypeMastery (${subtitle})!\nTry it here: ${shareUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'TypeMastery typing score',
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setMessage('Score copied to clipboard.');
        return;
      }

      setMessage('Score shared successfully.');
    } catch {
      setMessage('Sharing was cancelled or unavailable.');
    }
  };

  const downloadScoreImage = () => {
    const subtitle = language ? `${mode} Mode - ${language}` : `${mode} Mode`;
    const cardAccent = accentColor || '#4f9cf9';
    const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0f"/>
      <stop offset="50%" stop-color="#0d1117"/>
      <stop offset="100%" stop-color="#06080d"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${cardAccent}"/>
      <stop offset="100%" stop-color="#66AFFF"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${cardAccent}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${cardAccent}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${cardAccent}" stop-opacity="0"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="orb1" cx="0.2" cy="0.3" r="0.5">
      <stop offset="0%" stop-color="${cardAccent}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${cardAccent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orb2" cx="0.85" cy="0.75" r="0.4">
      <stop offset="0%" stop-color="#66AFFF" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#66AFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bg)"/>

  <!-- Ambient orbs -->
  <rect width="100%" height="100%" fill="url(#orb1)"/>
  <rect width="100%" height="100%" fill="url(#orb2)"/>

  <!-- Grid dots -->
  ${Array.from({ length: 12 }, (_, r) => Array.from({ length: 24 }, (_, c) => `<circle cx="${60 + c * 48}" cy="${35 + r * 52}" r="1" fill="white" opacity="0.04"/>`).join('')).join('')}

  <!-- Top accent line -->
  <rect x="0" y="0" width="1200" height="3" fill="url(#accent)"/>

  <!-- Decorative corner brackets -->
  <path d="M40 50 L40 30 L60 30" stroke="${cardAccent}" stroke-width="2" fill="none" opacity="0.3"/>
  <path d="M1160 50 L1160 30 L1140 30" stroke="${cardAccent}" stroke-width="2" fill="none" opacity="0.3"/>
  <path d="M40 580 L40 600 L60 600" stroke="${cardAccent}" stroke-width="2" fill="none" opacity="0.3"/>
  <path d="M1160 580 L1160 600 L1140 600" stroke="${cardAccent}" stroke-width="2" fill="none" opacity="0.3"/>

  <!-- Divider line -->
  <rect x="100" y="420" width="1000" height="1" fill="url(#bar)"/>

  <!-- Logo / Brand -->
  <text x="600" y="140" font-family="sans-serif" font-size="18" fill="#52525b" text-anchor="middle" letter-spacing="6" font-weight="600">
    TYPEMASTERY.ME
  </text>

  <!-- Score (with glow) -->
  <text x="600" y="310" font-family="monospace" font-size="140" fill="url(#accent)" text-anchor="middle" font-weight="bold" filter="url(#glow)">
    ${score}
  </text>
  <text x="600" y="370" font-family="sans-serif" font-size="32" fill="#71717a" text-anchor="middle" letter-spacing="8" font-weight="600">
    WORDS PER MINUTE
  </text>

  <!-- Mode subtitle -->
  <text x="600" y="480" font-family="sans-serif" font-size="28" fill="#a1a1aa" text-anchor="middle">
    ${subtitle}
  </text>

  <!-- Bottom tagline -->
  <text x="600" y="560" font-family="sans-serif" font-size="16" fill="#3f3f46" text-anchor="middle" letter-spacing="2">
    typemastery.me — typing practice for programmers
  </text>

  <!-- Small decorative hexagons -->
  <polygon points="90,520 100,515 110,520 110,530 100,535 90,530" fill="none" stroke="${cardAccent}" stroke-width="1" opacity="0.15"/>
  <polygon points="1090,100 1100,95 1110,100 1110,110 1100,115 1090,110" fill="none" stroke="${cardAccent}" stroke-width="1" opacity="0.15"/>
</svg>
    `.trim();

    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        try {
          const pngUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.download = 'typemastery-score.png';
          a.href = pngUrl;
          a.click();
          setMessage('Image generated and downloaded!');
        } catch (e) {
          console.error(e);
          setMessage('Failed to generate image (Canvas error).');
        }
      }
    };
    img.onerror = () => {
      setMessage('Failed to load score image template.');
    };
    img.src = url;
  };

  return (
    <section className="share-card">
      <div>
        <p className="eyebrow">Social proof</p>
        <h2>Share your typing score</h2>
        <p>
          Challenge your friends to beat your high score or prove you are the fastest coder in your group!
        </p>
      </div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button type="button" className="primary-button" onClick={shareScore}>
          Copy link
        </button>
        <button type="button" className="ghost-button" onClick={downloadScoreImage} style={{ border: '1px solid var(--panel-border)' }}>
          Download Image 🖼️
        </button>
      </div>
      <span className="status-text" aria-live="polite">
        {message || 'Encourage users to post their best run.'}
      </span>
    </section>
  );
}

export default function App() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === 'undefined') return 'Focus';
    return (window.localStorage.getItem('typemastery-mode') as Mode) || 'Focus';
  });
  const [setIndex, setSetIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => loadHistory());
  const [customText, setCustomText] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('typemastery-sound') === 'true';
  });

  const [fullHistory, setFullHistory] = useState<HistoryItem[]>(() => loadFullHistory());
  const [streakData, setStreakData] = useState<StreakData>(() => loadStreak());
  const [xpData, setXpData] = useState<XpData>(() => loadXp());
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => loadUnlockedAchievements());
  const [modeCounts, setModeCounts] = useState<Record<string, number>>(() => loadModeCounts());
  const [toastMsg, setToastMsg] = useState<{ id: number; msg: string; xp?: number } | null>(null);

  const currentSet = useMemo(() => pickPracticeSet(mode, setIndex, customText), [mode, setIndex, customText]);
  const targetText = currentSet.text;
  const isComplete = typed.length === targetText.length;
  const liveStats = calculateStats(targetText, typed, startedAt, finishedAt);
  const bestScore = useMemo(() => {
    const wpmList = [...fullHistory, ...history].map((item) => item.wpm);
    return wpmList.length > 0 ? Math.max(...wpmList) : 0;
  }, [fullHistory, history]);

  useEffect(() => {
    window.localStorage.setItem('typemastery-mode', mode);
  }, [mode]);

  useEffect(() => {
    window.localStorage.setItem('typemastery-sound', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    window.localStorage.setItem(FULL_HISTORY_KEY, JSON.stringify(fullHistory));
  }, [fullHistory]);

  useEffect(() => {
    window.localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
  }, [streakData]);

  useEffect(() => {
    window.localStorage.setItem(XP_KEY, JSON.stringify(xpData));
  }, [xpData]);

  useEffect(() => {
    window.localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  useEffect(() => {
    window.localStorage.setItem(MODE_COUNTS_KEY, JSON.stringify(modeCounts));
  }, [modeCounts]);

  useEffect(() => {
    document.title = 'Typing Speed Test | Keyflow';

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        'content',
        'Keyflow is a free typing speed test and typing practice website for beginners with touch typing drills, local stats, and ad-ready layouts.',
      );
    }

    const canonicalHref = SITE_URL ? `${SITE_URL.replace(/\/$/, '')}${window.location.pathname}` : `${window.location.origin}${window.location.pathname}`;
    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalHref;

    const upsertMeta = (attribute: 'name' | 'property', value: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${value}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, value);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    upsertMeta('property', 'og:title', 'Typing Speed Test | Keyflow');
    upsertMeta(
      'property',
      'og:description',
      'A fast, free typing practice website with beginner drills, local history, and ad-ready placements.',
    );
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', 'Typing Speed Test | Keyflow');
    upsertMeta(
      'name',
      'twitter:description',
      'Free typing speed test and practice website with local stats and beginner-friendly drills.',
    );
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (isComplete && startedAt && !finishedAt) {
      const now = Date.now();
      setFinishedAt(now);
      
      const newHistoryItem: HistoryItem = {
        wpm: liveStats.adjustedWpm,
        accuracy: liveStats.accuracy,
        mode,
        date: formatDate(new Date()),
        timestamp: now,
      };

      setHistory((prev) => [newHistoryItem, ...prev].slice(0, 6));
      setFullHistory((prev) => [...prev, newHistoryItem]);

      // Mode Counts
      const modeCountsSnapshot = { ...modeCounts, [mode]: (modeCounts[mode] || 0) + 1 };
      setModeCounts(modeCountsSnapshot);

      // Streak Logic
      const today = getToday();
      let newStreak = streakData.current;
      let newBestStreak = streakData.best;
      if (streakData.lastPracticeDate !== today) {
        if (streakData.lastPracticeDate === getYesterday()) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
        newBestStreak = Math.max(newBestStreak, newStreak);
        setStreakData({ current: newStreak, best: newBestStreak, lastPracticeDate: today });
      }

      // XP Calculation
      let gainedXp = Math.floor(liveStats.adjustedWpm * (liveStats.accuracy / 100));
      if (newStreak >= 3) {
        gainedXp = Math.floor(gainedXp * 1.5);
      }
      
      const nextTotal = xpData.total + gainedXp;
      const nextLevel = calculateLevel(nextTotal);
      setXpData({ total: nextTotal, level: nextLevel });
      
      setToastMsg({ id: now, msg: `+${gainedXp} XP earned!`, xp: gainedXp });

      // Achievements Check
      const prevBest = [...fullHistory, ...history].length > 0
        ? Math.max(...[...fullHistory, ...history].map((h) => h.wpm))
        : 0;

      const ctx: AchievementContext = {
        wpm: liveStats.adjustedWpm,
        accuracy: liveStats.accuracy,
        mode,
        streak: newStreak,
        level: nextLevel,
        modeCounts: modeCountsSnapshot,
        totalRounds: fullHistory.length + 1,
        prevBest,
      };

      const newlyUnlocked: string[] = [];
      ACHIEVEMENTS.forEach((badge) => {
        if (!unlockedAchievements.includes(badge.id) && badge.check(ctx)) {
          newlyUnlocked.push(badge.id);
        }
      });

      if (newlyUnlocked.length > 0) {
        setUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
        setTimeout(() => {
          setToastMsg({ id: Date.now(), msg: `Achievement Unlocked: ${ACHIEVEMENTS.find(a => a.id === newlyUnlocked[0])?.name}` });
        }, 1500);
      }

      // Tell Google Analytics this was an "engaged" session
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'round_complete', {
          event_category: 'typing',
          event_label: mode,
          value: liveStats.adjustedWpm
        });
      }
    }
  }, [finishedAt, isComplete, liveStats, mode, startedAt, streakData, xpData, modeCounts, fullHistory, history, unlockedAchievements]);

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const progress = Math.min((typed.length / targetText.length) * 100, 100);
  const mistakes = useMemo(() => {
    let errorCount = 0;
    for (let index = 0; index < typed.length; index += 1) {
      if (typed[index] !== targetText[index]) errorCount += 1;
    }
    return errorCount;
  }, [targetText, typed]);

  const startRound = () => {
    setSetIndex((prev) => prev + 1);
    setTyped('');
    setStartedAt(null);
    setFinishedAt(null);
    textareaRef.current?.focus();
  };

  const handleModeChange = (newMode: Mode) => {
    if (mode === newMode) return;
    setMode(newMode);
    setSetIndex(Math.floor(Math.random() * 1000));
    setTyped('');
    setStartedAt(null);
    setFinishedAt(null);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const startProgrammerPractice = () => {
    handleModeChange('Python');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onType = (value: string) => {
    if (soundEnabled && value !== typed) {
      playKeystroke();
    }
    if (typed.length === targetText.length) return;
    if (!startedAt) setStartedAt(Date.now());
    setTyped(value.slice(0, targetText.length));
    if (finishedAt) setFinishedAt(null);
  };

  return (
    <main className="shell">
      {toastMsg && (
        <div className="toast-container">
          <div className="toast fade-in" key={toastMsg.id}>
            {toastMsg.msg}
          </div>
        </div>
      )}
      {toastMsg?.xp && (
        <div className="xp-popup" key={`xp-${toastMsg.id}`}>
          +{toastMsg.xp} XP
        </div>
      )}
      <SeoSchema />
      <section className="hero">
        <div>
          <p className="eyebrow">Typing speed test, touch typing, and beginner practice</p>
          <h1>Master typing with adaptive drills, real-time analytics, and zero distractions.</h1>
        </div>

        <div className="hero-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gridColumn: '1 / -1' }}>
            <StreakBadge streak={streakData.current} />
            {streakData.current === 0 && <span style={{ color: 'var(--text-soft)', fontSize: '0.85rem' }}>No active streak</span>}
          </div>
          <XpBar xpData={xpData} />
          <div style={{ marginTop: '12px' }}>
            <span className="stat-label">Best score</span>
            <strong>{bestScore}</strong>
          </div>
          <div style={{ marginTop: '12px' }}>
            <span className="stat-label">Mode</span>
            <strong>{mode}</strong>
          </div>
          <div style={{ marginTop: '12px' }}>
            <span className="stat-label">Sessions</span>
            <strong>{fullHistory.length}</strong>
          </div>
        </div>
      </section>

      <section className="workspace-grid" id="typing-speed-test">
        <div className="practice-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div className="mode-switcher" role="tablist" aria-label="Practice modes" style={{ margin: 0 }}>
              {(Object.keys(MODE_DETAILS) as Mode[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={item === mode ? 'mode-button active' : 'mode-button'}
                  onClick={() => handleModeChange(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <button 
              className="mode-button" 
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Disable mechanical keyboard sound" : "Enable mechanical keyboard sound"}
              style={{ margin: 0, padding: '10px 14px', fontSize: '1.2rem', borderColor: soundEnabled ? 'var(--accent)' : 'transparent', background: soundEnabled ? 'rgba(79, 156, 249, 0.1)' : 'rgba(255, 255, 255, 0.04)' }}
            >
              {soundEnabled ? '🔊' : '🔈'}
            </button>
          </div>

          <div className="typing-card fade-in" key={mode}>
            {mode === 'Custom' && !customText ? (
              <div className="custom-input-area fade-in">
                <p style={{ margin: '0 0 12px 0', color: 'var(--text-soft)' }}>
                  Paste the code, text, or query you want to practice below.
                </p>
                <textarea 
                  className="custom-textarea"
                  placeholder="e.g. const URL = 'https://api.example.com';"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  autoFocus
                />
                <button 
                  className="primary-button" 
                  onClick={() => {
                    if (customInput.trim()) {
                      setCustomText(customInput.trim());
                      setSetIndex(0);
                      setTyped('');
                      setStartedAt(null);
                      setFinishedAt(null);
                      setTimeout(() => textareaRef.current?.focus(), 50);
                    }
                  }}
                  style={{ marginTop: '16px', width: '100%', display: 'block', textAlign: 'center' }}
                >
                  Start Custom Drill
                </button>
              </div>
            ) : (
              <>
                <div className="progress-row">
                  <span>{Math.round(progress)}% complete</span>
                  <span>{mistakes} errors</span>
                </div>
            <div className="progress-bar" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
            {currentSet.language && (
              <div 
                className="language-badge fade-in" 
                key={currentSet.text}
                style={{ color: currentSet.color, borderColor: currentSet.color + '40', background: currentSet.color + '10' }}
              >
                <span>{currentSet.icon}</span>
                {currentSet.language}
              </div>
            )}
            <p className="prompt-text">
              {targetText.split('').map((character, index) => {
                const typedCharacter = typed[index];
                let className = 'pending';
                if (typedCharacter !== undefined) {
                  className = typedCharacter === character ? 'correct' : 'wrong';
                }
                return (
                  <span key={`${character}-${index}`} className={className}>
                    {character}
                  </span>
                );
              })}
            </p>
            <textarea
              ref={textareaRef}
              value={typed}
              onChange={(event) => onType(event.target.value)}
              placeholder="Start typing here to begin the timer..."
              aria-label="Typing input"
              autoFocus
            />
            <div className="stat-grid">
              <article>
                <span>Adjusted WPM</span>
                <strong>{liveStats.adjustedWpm}</strong>
              </article>
              <article>
                <span>Accuracy</span>
                <strong>{liveStats.accuracy}%</strong>
              </article>
              <article>
                <span>Gross WPM</span>
                <strong>{liveStats.grossWpm}</strong>
              </article>
              <article>
                <span>Mode fit</span>
                <strong>{mode === 'Precision' ? 'Strict' : mode === 'Speed' ? 'Fast' : 'Balanced'}</strong>
              </article>
            </div>
            <div className="action-row">
              <button type="button" className="primary-button" onClick={startRound}>
                Reset round
              </button>
              {mode === 'Custom' && (
                <button 
                  type="button" 
                  className="ghost-button" 
                  onClick={() => {
                    setCustomText('');
                    setCustomInput('');
                  }}
                  style={{ marginLeft: '12px' }}
                >
                  Change snippet
                </button>
              )}
              <span className="status-text">{isComplete ? 'Round complete' : 'Keep typing'}</span>
            </div>
          </>
          )}
          </div>
        </div>

        <div className="side-column">
          <section className="feature-card">
            <p className="eyebrow">Why this is different</p>
            <ul>
              <li>100% private sessions stored locally on your device.</li>
              <li>Adaptive practice sets and mode-based drills instead of one static text stream.</li>
              <li>A dedicated Programmer Mode designed specifically for writing code.</li>
            </ul>
          </section>
          <section className="history-card">
            <p className="eyebrow">Recent runs</p>
            {history.length === 0 ? (
              <p className="empty-state">Complete a round to save your first result.</p>
            ) : (
              <div className="history-list">
                {history.map((entry, index) => (
                  <article key={`${entry.date}-${index}`}>
                    <strong>{entry.wpm} WPM</strong>
                    <span>{entry.accuracy}% accuracy</span>
                    <small>
                      {entry.mode} · {entry.date}
                    </small>
                  </article>
                ))}
              </div>
            )}
          </section>

          <ProgressChart history={fullHistory} />
          <AchievementsPanel unlockedIds={unlockedAchievements} />
        </div>
      </section>

      <section className="guide-grid" id="typing-tips">
        {GUIDE_ARTICLES.map((article, index) => (
          <article className="guide-card" key={article.title}>
            <p className="eyebrow">{article.label}</p>
            <h2>{article.title}</h2>
            {article.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {index === 0 ? (
              <p>
                Return to the <a href="#typing-speed-test">typing speed test</a> after reading, then compare your new score with the session history so the learning loop stays connected.
              </p>
            ) : index === 1 ? (
              <p>
                The <a href="#faq">FAQ</a> explains common questions, while the test above handles the interactive search intent immediately.
              </p>
            ) : (
              <p>
                Use these routines as a repeatable framework, then jump back to the <a href="#typing-speed-test">typing speed test</a> to measure whether your typing practice is actually improving.
              </p>
            )}
          </article>
        ))}
      </section>

      <ShareCard score={bestScore} mode={mode} language={currentSet.language} accentColor={currentSet.color} />

      <section className="guide-grid" id="programmer-seo" style={{ marginBottom: '60px' }}>
        <article className="guide-card" style={{ gridColumn: '1 / -1' }}>
          <p className="eyebrow">Typing Practice for Programmers 💻</p>
          <h2>Why programmers need typing practice</h2>
          <p>
            Programming requires much more than typing ordinary words. Practice typing real Python, Java, JavaScript, SQL and TypeScript syntax instead of random dictionary words. Developers constantly type:
          </p>
          <ul style={{ color: 'var(--text-soft)', paddingLeft: '20px', marginBottom: '20px' }}>
            <li>camelCase</li>
            <li>snake_case</li>
            <li>brackets {'{}'}</li>
            <li>semicolons ;</li>
            <li>parentheses ()</li>
            <li>HTML tags &lt;&gt;</li>
            <li>SQL queries</li>
          </ul>
          <button type="button" className="primary-button" onClick={startProgrammerPractice}>
            Practice Like a Python Dev →
          </button>
        </article>
      </section>

      <section className="faq-section" id="faq">
        <div className="panel-header faq-header">
          <div>
            <p className="eyebrow">FAQ schema</p>
            <h2>Common questions</h2>
          </div>
          <a href="#seo-summary">Back to keywords</a>
        </div>
        <div className="faq-list">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
              <p>
                For more context, move back to the <a href="#typing-tips">typing tips</a> section or jump to the <a href="#typing-speed-test">typing speed test</a> to practice immediately.
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
