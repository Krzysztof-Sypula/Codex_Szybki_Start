# Project purpose

Create a short, practical tutorial explaining how to build Saper (Minesweeper,
known from Windows) with HTML, CSS, and JavaScript using Codex.

# Deliverables and workflow

- The user manages Git and decides when and how to commit. Do not run Git
  commands (including status/diff), stage files, commit, manage branches,
  or synchronize repositories unless explicitly requested by the user.

- Write the tutorial in Polish unless the user requests another language.
- Keep the tutorial source in Markdown and provide clear, reproducible steps.
- Keep any example game code consistent with the tutorial.
- When preparing the final document, export the Markdown to PDF; use ODT as an
  intermediate format only if needed or requested.
- Use available conversion tools. Python is optional, not a requirement for
  writing Markdown or converting documents.
- Verify commands and examples where possible; report any conversion or
  verification that could not be completed.

# Prompt history

- Place the execution-duration line immediately after the closing prompt fence,
  without an intervening blank line (valid Markdown).
- Record execution duration after each prompt block, in Polish. Measure wall
  time from task_started to task_complete in the local session JSONL when
  available; this is turn handling time, not proof of command success.
- For the active turn, record elapsed time up to saving the history and label
  it provisional. On the next turn, replace it with the completed duration
  from the session log if available. Include start/end times and timezone.
- If session timestamps are unavailable, measure from the first clock check
  and state that limitation. Never invent historical durations; mark missing
  data explicitly. Do not include waiting between user prompts.
- For every user prompt in this project, append its original text to
  `codex.prompts.ncae_saper.md` before completing the response, including requests
  that do not involve code changes.
- Preserve spelling, punctuation, line breaks, and repeated prompts. Exclude
  automatically injected environment context, AGENTS.md instructions, tool
  output, and assistant responses.
- Group entries under level-two date headings in Polish (for example,
  `## 22 listopada 2026`), using the session date and Europe/London timezone.
- Give each entry a level-three heading with a consecutive number and a short
  Polish title. Continue numbering across dates and sessions.
- Put the verbatim prompt in a fenced `text` block; use a fence longer than any
  backtick sequence inside the prompt.
- Read the existing history before appending. Do not log an already recorded
  message again on session resume; separately submitted repetitions are new
  entries. Preserve existing history.
- If writing is blocked, report it and prepare a proposed replacement in a
  writable project location for the user to apply.

# Tutorial generation

- Store tutorial Markdown sources and generated ODT/PDF documents in `Tutorial/`.
  This does not apply to repository instructions or the prompt history.
- Keep document-generation code in `source/`; prefer Python.
- Use `python3 source/build_tutorial.py` to regenerate the tutorial.
- Treat `Tutorial/quick-manual.md` as the editable content source; do not
  overwrite it with hard-coded content in the generator.
- Verify generated PDFs for page count, Polish text, and expected sections.
