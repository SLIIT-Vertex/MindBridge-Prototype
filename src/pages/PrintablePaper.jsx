import AppHeader from '../components/AppHeader';
import { PRACTICE_PAPER } from '../data/mockData';

const SAMPLE_QUESTIONS = [
  '1. What is 3/4 + 1/4?',
  '2. Complete the pattern: 2, 4, 8, 16, __',
  '3. A rectangle has a length of 8cm and width of 5cm. Find its area.',
  '4. Choose the correct synonym for "happy".',
  '5. Which planet is closest to the sun?',
];

export default function PrintablePaper() {
  return (
    <div className="pb-6">
      <AppHeader title="Printable Paper" />
      <div className="px-5 mt-2">
        <div className="bg-white rounded-2xl card-shadow-lg p-6 border border-cream-deep">
          <div className="text-center border-b-2 border-dashed border-cream-deep pb-4 mb-4">
            <p className="font-display font-extrabold text-lg text-ink">{PRACTICE_PAPER.title}</p>
            <p className="text-[11.5px] font-semibold text-ink-soft mt-1">
              {PRACTICE_PAPER.questions} Questions &middot; {PRACTICE_PAPER.minutes} Minutes &middot; {PRACTICE_PAPER.difficulty}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {SAMPLE_QUESTIONS.map((q) => (
              <div key={q}>
                <p className="text-[13px] font-semibold text-ink mb-2">{q}</p>
                <div className="h-8 border-b border-cream-deep" />
              </div>
            ))}
            <p className="text-[11px] font-semibold text-ink-faint text-center pt-2">&mdash; 20 more questions in the full paper &mdash;</p>
          </div>
        </div>
      </div>
    </div>
  );
}
