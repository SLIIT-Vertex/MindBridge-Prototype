import { SUPPORT_PROMPTS, SUPPORT_TYPE } from '../../data/learner-state/supportCopy';
import StateSupportCard from '../StateSupportCard';

/**
 * The only thing this component ever shows the child.
 *
 * It renders the shared StateSupportCard, so a support offer looks exactly like
 * every other MindBridge prompt. What it deliberately does NOT pass through is
 * the classification, the probabilities, the reliability, or any word describing
 * the child. `supportType` decides the copy; the state name never leaves the
 * research panel.
 */
export default function SupportPrompt({ supportType, onAction, visible = true }) {
  if (!supportType || supportType === SUPPORT_TYPE.NONE) return null;

  const prompt = SUPPORT_PROMPTS[supportType];
  if (!prompt) return null;

  return (
    <StateSupportCard
      content={{ tone: prompt.tone, title: prompt.title, body: prompt.body, actions: prompt.actions }}
      onAction={onAction}
      visible={visible}
    />
  );
}
