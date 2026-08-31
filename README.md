# MindBridge Prototype

## Adaptive Learning Demo

The **Learn** tab holds the Adaptive Gamified Learning component: one Grade 5 Scholarship reasoning
skill (`GI-PS-01`, Pattern & Sequence Reasoning) taken through a complete adaptive research loop.

```bash
npm install
npm run dev
```

Open the app, tap **Learn** in the bottom navigation, then follow:

1. **Learn home** → General Intelligence & Aptitude → Pattern & Sequence Reasoning
2. **Start Mission** → the Temple Entry Challenge, an unsupported baseline (three items, no hints)
3. **Pattern Temple** → Gate 1 and Gate 2, where repeated related errors trigger adaptive support
4. **Show me** → support is selected, delivered, practised with, and then visibly withdrawn
5. **Gate 3, The Final Gate** → three parallel-form problems with no support available
6. **Result** → Independence Gain, and the support-effectiveness estimate being revised
7. **Research summary** → the full eleven-step loop on one screen

The whole run takes about five to eight minutes.

**Research View** is the floating dark pill in the bottom-right of every Learn screen. It opens a
drawer showing the evidence, the difficulty detection, the misconception probabilities, the support
comparison and the policy update as they happen. A supervisor can leave it open for the whole demo.

**Presenter controls** live at the bottom of that drawer, under `PROTOTYPE DEMO ONLY`: reset the
session, switch between the scripted struggle and natural interaction, jump to any stage of the loop
with the session pre-seeded, preview each of the three support types, or replay the whole demo.

Session state is in memory only, so refreshing the page always gives a clean run.

Run `npm run verify:adaptive` to assert every research figure the demo quotes — the belief posterior,
the detector confidence, the Independence Gain and a full replay of the scripted session through the
real reducer.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
