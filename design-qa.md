# Design QA — Owner Login / Option 2

## Evidence

- Source visual truth: `/Users/sumangaldey/Desktop/Clients/Salone/Salone-owner-mobile-app/design-reference-option-2.png`
- Normalized source: `/Users/sumangaldey/Desktop/Clients/Salone/Salone-owner-mobile-app/design-reference-option-2-normalized.png`
- Browser-rendered implementation: `/Users/sumangaldey/Desktop/Clients/Salone/Salone-owner-mobile-app/implementation-option-2.png`
- Combined comparison: `/Users/sumangaldey/Desktop/Clients/Salone/Salone-owner-mobile-app/design-qa-comparison.png`
- State: logged-out, closed keyboard, empty form for the visual comparison.
- CSS app width: 390 px. Captured app content: 390 × 830 px at 1x density.
- Source pixels: 853 × 1844 px, normalized to 390 × 830 px for comparison.
- Implementation source capture: 615 × 875 px browser capture; browser chrome was excluded and the centered 390 × 830 app region was compared.

## Full-view comparison

The implementation preserves the selected direction's forest-green hero, cream lower surface, centered cream logo lockup, Bengali welcome hierarchy, pale-sage inputs, green primary action, and compact security reassurance. The app remains native React Native rather than recreating a device frame.

## Focused-region comparison

A separate crop was not required because the normalized 390 × 830 combined comparison keeps the logo, Bengali copy, icons, input labels, placeholders, button, and security row readable at native app scale.

## Required fidelity surfaces

- Fonts and typography: Bengali hierarchy, weights, line heights, and readable input typography match the reference direction using the project's native Bengali font fallbacks.
- Spacing and layout rhythm: hero/form proportions, horizontal margins, input gaps, radii, button height, and security spacing are aligned with the target after the second pass.
- Colors and visual tokens: deep forest green, warm ivory, pale sage, charcoal, and white are consistent with both the reference and project theme; no purple or gold was introduced.
- Image quality and asset fidelity: option-5 logo is used directly; the botanical overlay is a dedicated transparent raster asset generated in the reference art direction. Standard controls use the existing icon library.
- Copy and content: all Bengali product copy from the selected reference is present and editable UI text, not baked into a screenshot.

## Interaction and diagnostics

- Username and password fields accepted input and kept their typed values visible in the browser render.
- Password submission and the login success state were exercised successfully.
- Keyboard avoidance uses Android window resize plus measured focused-input overlap, keyboard frame events, live native keyboard metrics when available, and resized-window fallback.
- Final reload produced no new console errors. TypeScript validation passed.
- Native soft-keyboard animation cannot be displayed by the desktop web preview; final physical-device confirmation remains a device test rather than a visual-QA blocker.

## Comparison history

1. Initial pass — P2: hero and logo hierarchy were visibly compressed compared with the reference.
   - Fix: increased hero height from 310 to 360, increased the logo render box from 88 to 150, and raised brand type scale from 36 to 40.
   - Post-fix evidence: `design-qa-comparison.png` shows the corrected hero proportion and brand prominence.
2. Final pass — no remaining P0, P1, or P2 findings.

## Follow-up polish

- P3: the reference uses an organic wave between hero and form; the implementation uses a simpler large native rounded transition to avoid a decorative custom vector and keep the screen lightweight.

## Implementation checklist

- [x] Selected option 2 layout implemented in the Expo React Native app.
- [x] Real logo and decorative assets placed.
- [x] Inputs, password visibility control, validation, loading, and success state retained.
- [x] Keyboard-aware scrolling strengthened for iOS and Android.
- [x] TypeScript and final browser diagnostics passed.

final result: passed
