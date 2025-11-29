# Committing and pushing changes

1. Ensure your working tree is clean and tests pass.
   ```bash
   git status -sb
   npm test    # or npm run lint / npm run build if applicable
   ```

2. Stage your changes.
   ```bash
   git add <files>
   # or add everything
   git add .
   ```

3. Create a commit with a concise, descriptive message.
   ```bash
   git commit -m "<short description>"
   ```

4. Verify your remote points to GitHub (adjust if needed).
   ```bash
   git remote -v
   git remote set-url origin git@github.com:<owner>/<repo>.git
   ```

5. Push the branch to GitHub.
   ```bash
   git push origin <branch-name>
   ```

6. Open a pull request on GitHub for code review.
   - If the branch was created on GitHub, follow the PR link shown after pushing.
   - Include a summary of changes and test results.
