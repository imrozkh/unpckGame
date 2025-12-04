import { useMemo, useState } from 'react';
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

  const score = useMemo(
    () => decisions.filter((entry) => entry.correct).length,
    [decisions],
  );

  const accuracy = useMemo(() => {
    if (!decisions.length) return 0;
    return Math.round((score / decisions.length) * 100);
  }, [decisions.length, score]);

  const currentItem = items[cursor];

  const startTrip = (selected: Trip) => {
    setTrip(selected);
    const roundItems = getRoundItems(selected);
    setItems(roundItems);
    setCursor(0);
    setDecisions([]);
    setScreen('play');
  };

  const recordDecision = (decision: Decision) => {
    if (!currentItem) return;
    const correct = decisionIsCorrect(currentItem, decision);

    setDecisions((prev) => [...prev, { item: currentItem, decision, correct }]);

    if (cursor + 1 >= items.length) {
      setScreen('results');
      return;
    }

    setCursor((prev) => prev + 1);
  };

  const reset = () => {
    setScreen('select');
    setTrip(null);
    setItems([]);
    setCursor(0);
    setDecisions([]);
  };

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

            <div className="card item-card">
              <p className="eyebrow">{tagCopy[currentItem.tag]}</p>
              <h3>{currentItem.name}</h3>
              <p className="muted">
                Pack = essential/useful · Reject = not required/trap
              </p>
            </div>

            <div className="action-row">
              <button className="ghost" onClick={() => recordDecision('reject')}>
                Reject
              </button>
              <button className="primary" onClick={() => recordDecision('pack')}>
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
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
