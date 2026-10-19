# Adding or editing a page

One page = one file `src/content/pages/<id>.ts`, exported with `definePage` (types in `src/lib/guide-types.ts`). The file name is the id. The page is built at `/en/<slug>/` and listed on the home page, in the menu, the footer, the sitemap and `llms.txt` automatically.

## Page types

- **Tool page** (`tool` set): the calculator on the first screen, citable block + body of 480 words or more. `tool: { kind: 'mini:<spec>' }` uses a spec of `src/lib/mini-specs.ts`; `tool: { kind: 'isa', props: { income, balance, rate } }` uses the full ISA against taxable account calculator with that page's defaults (groups `amounts`).
- **Guide** (`mini` set, no `tool`): a mini calculator right after the citable block, citable block + body of 1,200 words or more.
- Groups: `tax`, `isa`, `lifetime`, `junior`, `premium`, `amounts` (labels in `src/i18n/nav.ts`).

## Rules checked by `npx vitest run tests/pages.test.ts`

- `title` 50 to 60 characters, key term first, never starting with the country or a tool or question word (UK, Scotland, Calculator, How, Is...). `description` 150 to 160 characters.
- `resume`: one paragraph of 120 words or more that answers the page's question with figures.
- `faqs`: 3 to 8 questions, answers of 40 to 90 words, each question used once on the whole site.
- No em dash anywhere. British English. No personal advice, no provider named or ranked.
- Internal links only through `h.a('<page id>', text)`; unknown ids fail the test and the build.
- Every figure comes from the engine (`h.tax`, `h.S.compare`, `h.I.lisaCharge`, `h.PB.simulate`...) or from `h.P` / `h.y(year)`: never type an amount, a rate or a date that exists in `src/data/params-2026.json`.
- At least two `sources` keys of the parameter file; cite them in the text with `h.src(key, text)`.
- A 2027/28 rule is presented with its date of effect (6 April 2027). A rule that is not law (2027/28 main rates, Scottish 2027/28 rates, First Time Buyer ISA) is never presented as settled.
- A page shares no paragraph with another page: write each one for its own question.

## Data

All rules: `src/data/params-2026.json`, each with its official source in `sources` and the date read in `retrieved_at`. Engines: `src/lib/engine/savings.ts` (income tax and the tax caused by interest), `isa.ts` (allowances, cash limit, Lifetime and Junior ISA), `premium.ts` (Premium Bonds odds and simulated spread). Tests: `tests/engine.test.ts`, built on HMRC's and GOV.UK's worked examples.

Next tax year: add a `years` entry, update the Premium Bonds prize table each month from NS&I's prize allocation, run `npm test`, then `npm run build`.
