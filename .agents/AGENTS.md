# Agent Rules for Motovra

## Git Commit Format
Always output git commits in the following template:

```bash
git add .

git commit -m "<type>(<scope>): <short description>

Reviewed, verified, and refined the AI-generated implementation to ensure
it integrates correctly with the project and passes all tests.

Co-authored-by: Google Antigravity <antigravity@users.noreply.github.com>"
```

## Execution Rules
After every successful RED, GREEN, or meaningful REFACTOR phase:
- Automatically execute `git add .` and `git commit`
- The commit message MUST follow the template above.
- Mention the user's actual contribution and AI contribution.
- Continue automatically after a successful commit.
- Only stop if tests fail unexpectedly, build fails, manual config is required, or a major decision is needed.
