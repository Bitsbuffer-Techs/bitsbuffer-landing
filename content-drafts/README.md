# content-drafts/

Drop a BlogPost-shaped JSON file here (generated via the blog-writing
skill in Cowork chat) and it gets imported into MongoDB as a draft
automatically within a couple of seconds, while `npm run dev` is running.

Imported files move to `imported/`. Files that fail validation move to
`rejected/` with a `.error.txt` explaining why.

Open /admin to review, edit, and publish.
