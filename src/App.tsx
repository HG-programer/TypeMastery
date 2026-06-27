import { useEffect, useMemo, useState, useRef } from 'react';

type Mode = 'Focus' | 'Speed' | 'Precision' | 'Programmer';

const PROGRAMMER_SNIPPETS = [
  { language: 'Python', icon: '🐍', text: 'def binary_search(arr, target):' },
  { language: 'Java', icon: '☕', text: 'for(int i=0; i<n; i++) {' },
  { language: 'JavaScript', icon: '⚡', text: 'const response = await fetch(url);' },
  { language: 'Java', icon: '☕', text: 'HashMap<String, Integer> map = new HashMap<>();' },
  { language: 'SQL', icon: '🗄️', text: 'SELECT * FROM users WHERE status = "active";' },
  { language: 'JavaScript', icon: '⚡', text: 'const total = items.reduce((a, b) => a + b, 0);' },
  { language: 'Java', icon: '☕', text: 'public static void main(String[] args) {' },
  { language: 'JavaScript', icon: '⚡', text: 'document.getElementById("btn").addEventListener("click", () => {' },
];

type PracticeSet = {
  label: string;
  title: string;
  description: string;
  text: string;
  language?: string;
  icon?: string;
};

type HistoryItem = {
  wpm: number;
  accuracy: number;
  mode: Mode;
  date: string;
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

const PRACTICE_SETS: PracticeSet[] = [
  {
    label: 'Warm-up',
    title: 'Rhythm ladder',
    description: 'Short words that build finger flow without extra noise.',
    text: 'time mile clear group winter shift create rhythm simple speed typing focus',
  },
  {
    label: 'Productive',
    title: 'Work sentences',
    description: 'Longer real-world phrases with punctuation and spacing.',
    text: 'The dashboard should feel fast, readable, and confident even when the user is moving quickly.',
  },
  {
    label: 'Challenge',
    title: 'Precision burst',
    description: 'A denser drill for accuracy under pressure.',
    text: 'precision matters when your hands already know the pattern but your mind wants to rush ahead',
  },
];

const MODE_DETAILS: Record<Mode, string> = {
  Focus: 'Balanced pace, error review, and daily consistency.',
  Speed: 'Higher target cadence with shorter reset windows.',
  Precision: 'Punishes misses and rewards clean streaks.',
  Programmer: 'Complex symbols, camelCase, and syntax muscle memory.',
};

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
];

const STORAGE_KEY = 'keyflow-history';
const SITE_URL = typeof import.meta.env.VITE_SITE_URL === 'string' && import.meta.env.VITE_SITE_URL
  ? import.meta.env.VITE_SITE_URL
  : '';

function loadHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(date);
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

function pickPracticeSet(mode: Mode, index: number) {
  if (mode === 'Speed') return PRACTICE_SETS[1];
  if (mode === 'Precision') return PRACTICE_SETS[2];
  if (mode === 'Programmer') {
    const snippet = PROGRAMMER_SNIPPETS[index % PROGRAMMER_SNIPPETS.length];
    return {
      label: 'Programmer',
      title: 'Typing practice for programmers',
      description: 'Practice real syntax from Python, JS, Java, and SQL.',
      text: snippet.text,
      language: snippet.language,
      icon: snippet.icon,
    };
  }
  return PRACTICE_SETS[index % PRACTICE_SETS.length];
}

function AdSlot({ label }: { label: string }) {
  return (
    <aside className="ad-slot" aria-label={label}>
      <span className="ad-kicker">Ad-ready slot</span>
      <strong>{label}</strong>
      <p>Reserved for future display or affiliate ads without changing the app architecture.</p>
    </aside>
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

function ShareCard({ score }: { score: number }) {
  const [message, setMessage] = useState('');

  const shareScore = async () => {
    const shareUrl = SITE_URL || window.location.href;
    const shareText = `I scored ${score} WPM on TypeMastery!\nTry it here: ${shareUrl}`;

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

  return (
    <section className="share-card">
      <div>
        <p className="eyebrow">Social proof</p>
        <h2>Share your typing score</h2>
        <p>
          Challenge your friends to beat your high score or prove you are the fastest coder in your group!
        </p>
      </div>
      <button type="button" className="primary-button" onClick={shareScore}>
        Share score
      </button>
      <span className="status-text" aria-live="polite">
        {message || 'Encourage users to post their best run.'}
      </span>
    </section>
  );
}

export default function App() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<Mode>('Focus');
  const [setIndex, setSetIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => loadHistory());

  const currentSet = useMemo(() => pickPracticeSet(mode, setIndex), [mode, setIndex]);
  const targetText = currentSet.text;
  const isComplete = typed.length === targetText.length;
  const liveStats = calculateStats(targetText, typed, startedAt, finishedAt);
  const bestScore = history.reduce(
    (best, item) => Math.max(best, item.wpm),
    0,
  );

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
      setFinishedAt(Date.now());
      setHistory((prev) => [
        {
          wpm: liveStats.adjustedWpm,
          accuracy: liveStats.accuracy,
          mode,
          date: formatDate(new Date()),
        },
        ...prev,
      ].slice(0, 6));
    }
  }, [finishedAt, isComplete, liveStats.adjustedWpm, liveStats.accuracy, mode, startedAt]);

  const progress = Math.min((typed.length / targetText.length) * 100, 100);
  const mistakes = useMemo(() => {
    let errorCount = 0;
    for (let index = 0; index < typed.length; index += 1) {
      if (typed[index] !== targetText[index]) errorCount += 1;
    }
    return errorCount;
  }, [targetText, typed]);

  const startRound = () => {
    const nextIndex = (setIndex + 1) % PRACTICE_SETS.length;
    setSetIndex(nextIndex);
    setTyped('');
    setStartedAt(null);
    setFinishedAt(null);
  };

  const startProgrammerPractice = () => {
    setMode('Programmer');
    setSetIndex(0);
    setTyped('');
    setStartedAt(null);
    setFinishedAt(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const onType = (value: string) => {
    if (typed.length === targetText.length) return;
    if (!startedAt) setStartedAt(Date.now());
    setTyped(value.slice(0, targetText.length));
    if (finishedAt) setFinishedAt(null);
  };

  return (
    <main className="shell">
      <SeoSchema />
      <section className="hero">
        <div>
          <p className="eyebrow">Typing speed test, touch typing, and beginner practice</p>
          <h1>Master typing with adaptive drills, real-time analytics, and zero distractions.</h1>
        </div>

        <div className="hero-card">
          <div>
            <span className="stat-label">Best score</span>
            <strong>{bestScore}</strong>
          </div>
          <div>
            <span className="stat-label">Mode</span>
            <strong>{mode}</strong>
          </div>
          <div>
            <span className="stat-label">Sessions saved</span>
            <strong>{history.length}</strong>
          </div>
        </div>
      </section>

      <section className="workspace-grid" id="typing-speed-test">
        <div className="practice-panel">
          <div className="mode-switcher" role="tablist" aria-label="Practice modes">
            {(Object.keys(MODE_DETAILS) as Mode[]).map((item) => (
              <button
                key={item}
                type="button"
                className={item === mode ? 'mode-button active' : 'mode-button'}
                onClick={() => setMode(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="typing-card fade-in" key={mode}>
            <div className="progress-row">
              <span>{Math.round(progress)}% complete</span>
              <span>{mistakes} errors</span>
            </div>
            <div className="progress-bar" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
            {currentSet.language && (
              <div className="language-badge fade-in" key={currentSet.text}>
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
              <span className="status-text">{isComplete ? 'Round complete' : 'Keep typing'}</span>
            </div>
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

      <ShareCard score={bestScore} />

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
            Practice Like a Programmer →
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
