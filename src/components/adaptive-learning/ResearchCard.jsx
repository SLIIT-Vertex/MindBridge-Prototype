/**
 * Re-export of the shared research card shell, which moved up to
 * `src/components/ResearchCard.jsx` when a second component started using it.
 * Kept so existing adaptive-learning imports resolve unchanged.
 */
// eslint-disable-next-line react/only-export-components -- re-export shim; the components themselves live in the shared module.
export { default, ResearchRow, ResearchChip } from '../ResearchCard';
