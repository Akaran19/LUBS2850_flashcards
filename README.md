LUBS2850 Flashcards

Lightweight, no-framework flashcards for revising LUBS2850 Marketing. Runs entirely in the browser using vanilla HTML/CSS/JS, with a tiny Python helper to turn a CSV of terms into the terms.json used by the app. 
GitHub

Features

🔎 Simple, fast, offline—open a single HTML file and study.

🗂️ Data-driven cards from terms.json.

🔁 CSV → JSON conversion via csv_to_json.py for easy content updates. 
GitHub

Quick start
Option A — Just open it

Clone the repo.

Double-click index.html to open it in your browser. 
GitHub

Option B — Serve locally (recommended)

Some browsers restrict fetch() from local files. If cards don’t load, serve the folder:

Python 3

# From the project root
python -m http.server 8000
# then visit http://localhost:8000/


Node (if you have it)

npx http-server -p 8000

Add or edit flashcards
Edit the JSON directly

Open terms.json and add cards in the format your app expects (typically an array of { "term": "...", "definition": "..." }). 
GitHub

Convert a CSV to JSON (helper script)

If your source is a CSV (e.g., exported from Sheets):

# Ensure Python 3 is installed
python csv_to_json.py input.csv terms.json


Tip: Name your CSV headers to match the fields the app reads (e.g., term,definition). The script converts the CSV into the JSON file the app loads at runtime. 
GitHub

Project structure
LUBS2850_flashcards/
├── index.html        # App entry point
├── styles.css        # Basic styling
├── app.js            # Flashcard logic (loads terms.json, UI behavior)
├── terms.json        # Your flashcard data
└── csv_to_json.py    # CSV → JSON utility


GitHub

Suggested workflows

Make quick edits: change or add cards in terms.json, refresh the page.

Bulk updates: keep a master spreadsheet → export CSV → run csv_to_json.py.

Host online: enable GitHub Pages (serve the root or docs/ if you move files).

Customization ideas

Shuffle / score tracking in app.js.

Keyboard shortcuts (next/previous, flip).

Tagging & filtering (e.g., “STP”, “4Ps”, “Research”).

Dark mode toggle in styles.css.

Requirements

A modern browser.

Python 3 only if you plan to use the CSV → JSON script. 
GitHub

Contributing

Fork and create a feature branch.

Keep PRs small and focused (UI, data shaping, or script improvements).

If you change the terms.json schema, document it in this README.
