# SelectionFrame

A 1.5px `accent` outline with four square handles and a dimension tag: the canvas's way of saying “this is the thing you're working on”.

**Use it** for the one hero object on a page (the opening headline), and as the hover and focus state of cards (`CapabilityCard`, `PersonCard` show their handles on hover). One selected thing per view.

**Markup:** add `cv-selection` to a positioned element and put four `<span class="cv-handle cv-handle--tl|tr|bl|br">` inside it. Optional `<span class="cv-dims">1280 × 462</span>` under it shows the frame's real size (the site updates it with a ResizeObserver). Handles are `handle` (9px), `surface` fill, 1.5px `accent` border; mark them `aria-hidden="true"`.

- Do: show real dimensions in the tag when you show one.
- Don't: select more than one object at rest, or use the frame as a decorative border on every card.
- Don't: put the frame label inside the selection; it sits above it.
