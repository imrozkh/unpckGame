import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { trips } from './data/gameData';
import type { DecisionRecord, Trip, TripItem } from './types';
import { shuffle } from './utils/shuffle';

const tagCopy: Record<TripItem['tag'], string> = {
  essential: 'Essential',
  useful: 'Useful',
  not_required: 'Not required',
  trap: 'Trap',
};

type Screen = 'welcome' | 'select' | 'play' | 'results';

type Decision = 'pack' | 'reject';

const decisionIsCorrect = (item: TripItem, decision: Decision): boolean => {
  const shouldPack = item.tag === 'essential' || item.tag === 'useful';
  return (shouldPack && decision === 'pack') || (!shouldPack && decision === 'reject');
};

const getRoundItems = (trip: Trip): TripItem[] => {
  const count = Math.min(trip.roundItemCount.max, Math.max(trip.roundItemCount.min, trip.items.length));
  return shuffle(trip.items).slice(0, count);
};

function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [trip, setTrip] = useState<Trip | null>(null);
  const [items, setItems] = useState<TripItem[]>([]);
  const [cursor, setCursor] = useState(0);
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'good' | 'bad' | 'timeout'>('idle');
  const [shareMessage, setShareMessage] = useState('');
  const touchStartX = useRef<number | null>(null);
  const autoAdvanceRef = useRef(false);

  const score = useMemo(
    () => decisions.filter((entry) => entry.correct).length,
    [decisions],
  );

  const accuracy = useMemo(() => {
    if (!decisions.length) return 0;
    return Math.round((score / decisions.length) * 100);
  }, [decisions.length, score]);

  const currentItem = items[cursor];
  const durationMs = trip ? trip.difficultyDefaults.medium * 1000 : 0;

  const startTrip = (selected: Trip) => {
    setTrip(selected);
    const roundItems = getRoundItems(selected);
    setItems(roundItems);
    setCursor(0);
    setDecisions([]);
    setFeedback('idle');
    setShareMessage('');
    setScreen('play');
    autoAdvanceRef.current = false;
  };

  const recordDecision = useCallback(
    (decision: Decision, source: 'tap' | 'swipe' | 'timeout') => {
      if (!currentItem) return;
      const correct = decisionIsCorrect(currentItem, decision);

      setDecisions((prev) => [...prev, { item: currentItem, decision, correct }]);
      setFeedback(source === 'timeout' ? 'timeout' : correct ? 'good' : 'bad');
      autoAdvanceRef.current = true;

      if (cursor + 1 >= items.length) {
        setScreen('results');
        return;
      }

      setCursor((prev) => prev + 1);
    },
    [currentItem, cursor, items.length],
  );

  const reset = () => {
    setScreen('select');
    setTrip(null);
    setItems([]);
    setCursor(0);
    setDecisions([]);
    setTimeLeftMs(0);
    setFeedback('idle');
    setShareMessage('');
  };

  useEffect(() => {
    if (!trip || !currentItem || screen !== 'play') return undefined;
    const startedAt = performance.now();
    autoAdvanceRef.current = false;
    setFeedback('idle');
    setTimeLeftMs(durationMs);

    const interval = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(durationMs - elapsed, 0);
      setTimeLeftMs(remaining);

      if (remaining <= 0 && !autoAdvanceRef.current) {
        recordDecision('reject', 'timeout');
      }
    }, 50);

    return () => {
      window.clearInterval(interval);
    };
  }, [currentItem, durationMs, recordDecision, screen, trip]);

  const progressPercent = durationMs ? Math.max(0, Math.min(100, (timeLeftMs / durationMs) * 100)) : 0;

  const onTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
  };

  const onTouchEnd = (clientX: number) => {
    if (touchStartX.current === null || !currentItem || screen !== 'play') return;
    const deltaX = clientX - touchStartX.current;
    const threshold = 50;
    if (deltaX > threshold) {
      recordDecision('pack', 'swipe');
    } else if (deltaX < -threshold) {
      recordDecision('reject', 'swipe');
    }
    touchStartX.current = null;
  };

  const shareResults = async () => {
    if (!trip) return;
    const shareText = `UNPCK | ${trip.name} — Score ${score}/${items.length} | Accuracy ${accuracy}%`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'UNPCK: Pack It Right', text: shareText });
        setShareMessage('Shared via native sheet.');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setShareMessage('Copied results to clipboard.');
      } else {
        setShareMessage('Share unsupported on this device.');
      }
    } catch {
      setShareMessage('Share canceled or failed.');
    }
  };

  useEffect(() => {
    if (screen === 'results' && trip) {
      // Analytics stub for Phase 1 validation.
      console.log('analytics:event', {
        event: 'round_complete',
        trip: trip.id,
        score,
        accuracy,
        totalItems: items.length,
      });
    }
  }, [accuracy, items.length, score, screen, trip]);

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand">UNPCK</div>
        <div className="mode">Pack It Right — Speed Mode</div>
      </header>

      <main className="content">
        {screen === 'welcome' && (
          <section className="panel hero">
            <p className="eyebrow">Phase 1 build</p>
            <h1>Swipe fast. Pack smart.</h1>
            <p className="lede">
              Mobile-ready React + Vite scaffold with the UNPCK trip library baked in. Choose a trip
              to spin up a round and validate early UX.
            </p>
            <button className="primary" onClick={() => setScreen('select')}>
              Choose a trip
            </button>
          </section>
        )}

        {screen === 'select' && (
          <section className="panel">
            <header className="section-header">
              <div>
                <p className="eyebrow">Trip type</p>
                <h2>Pick a loadout to test</h2>
              </div>
            </header>
            <div className="grid">
              {trips.map((tripOption) => (
                <button
                  key={tripOption.id}
                  className="card"
                  onClick={() => startTrip(tripOption)}
                >
                  <span className="card-title">{tripOption.name}</span>
                  <span className="card-meta">
                    {tripOption.roundItemCount.min}-{tripOption.roundItemCount.max} items · Default
                    pace {tripOption.difficultyDefaults.medium}s
                  </span>
                  <div className="pill-row">
                    {tripOption.recommendedLoadout.map((item) => (
                      <span key={item} className="pill">
                        {item}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {screen === 'play' && trip && currentItem && (
          <section className="panel">
            <header className="section-header">
              <div>
                <p className="eyebrow">Round in progress</p>
                <h2>{trip.name}</h2>
                <p className="muted">Item {cursor + 1} of {items.length}</p>
              </div>
              <div className="score-box">
                <span className="label">Score</span>
                <span className="value">{score}</span>
              </div>
            </header>

            <div className="progress">
              <div className="progress-bar" style={{ width: `${progressPercent}%` }} aria-hidden />
            </div>

            <div
              className={`card item-card ${feedback === 'good' ? 'success' : ''} ${feedback === 'bad' ? 'danger' : ''} ${feedback === 'timeout' ? 'timeout' : ''}`}
              onTouchStart={(event) => onTouchStart(event.changedTouches[0].clientX)}
              onTouchEnd={(event) => onTouchEnd(event.changedTouches[0].clientX)}
              onMouseDown={(event) => onTouchStart(event.clientX)}
              onMouseUp={(event) => onTouchEnd(event.clientX)}
            >
              <p className="eyebrow">{tagCopy[currentItem.tag]}</p>
              <h3>{currentItem.name}</h3>
              <p className="muted">
                Swipe → pack / reject or tap the buttons
              </p>
              {feedback !== 'idle' && (
                <div className="inline-feedback">
                  {feedback === 'good' && '✓ Packed right'}
                  {feedback === 'bad' && '✗ Wrong move'}
                  {feedback === 'timeout' && '⏱ Missed window'}
                </div>
              )}
            </div>

            <div className="action-row">
              <button className="ghost" onClick={() => recordDecision('reject', 'tap')}>
                Reject
              </button>
              <button className="primary" onClick={() => recordDecision('pack', 'tap')}>
                Pack
              </button>
            </div>
          </section>
        )}

        {screen === 'results' && trip && (
          <section className="panel">
            <header className="section-header">
              <div>
                <p className="eyebrow">Round complete</p>
                <h2>{trip.name}</h2>
                <p className="muted">{items.length} items reviewed</p>
              </div>
              <div className="score-box">
                <span className="label">Score</span>
                <span className="value">{score}</span>
              </div>
            </header>

            <div className="results-grid">
              <div className="metric">
                <p className="label">Accuracy</p>
                <p className="metric-value">{accuracy}%</p>
              </div>
              <div className="metric">
                <p className="label">Correct picks</p>
                <p className="metric-value">{score} / {items.length}</p>
              </div>
            </div>

            <div className="card">
              <p className="eyebrow">Suggested loadout</p>
              <div className="pill-row">
                {trip.recommendedLoadout.map((item) => (
                  <span key={item} className="pill">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="decision-list">
              {decisions.map((entry, index) => (
                <div key={`${entry.item.name}-${index}`} className="decision-row">
                  <div>
                    <p className="decision-name">{entry.item.name}</p>
                    <p className="muted">{tagCopy[entry.item.tag]}</p>
                  </div>
                  <span className={`chip ${entry.correct ? 'chip-good' : 'chip-bad'}`}>
                    {entry.correct ? '✓ correct' : '✗ missed'}
                  </span>
                </div>
              ))}
            </div>

            <div className="action-row">
              <button className="ghost" onClick={reset}>
                Try another trip
              </button>
              <button className="primary" onClick={() => startTrip(trip)}>
                Replay trip
              </button>
            </div>

            <div className="action-row">
              <button className="primary" onClick={() => { void shareResults(); }}>
                Share score
              </button>
              {shareMessage && <div className="share-note">{shareMessage}</div>}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
