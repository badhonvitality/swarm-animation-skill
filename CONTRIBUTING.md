# Contributing to Swarm Animation Skill

Thank you for your interest in contributing! We welcome bug reports, feature proposals, documentation improvements, and pull requests.

---

## 1. Code of Conduct

All participants are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

---

## 2. Development Setup

### Prerequisites
- Node.js 18+ (Node 20 LTS recommended)
- npm or yarn

### Initializing the Workspace
```bash
# Clone repository
git clone https://github.com/badhonvitality/swarm-animation-skill.git
cd swarm-animation-skill

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 3. Repository Architecture

- `skills/swarm-animation/`: Canonical skill definition, references, and examples.
- `.agents/skills/swarm-animation/`: Discovery directory for AI agent runtimes (synchronized via `npm run sync-skills`).
- `src/`: Reconstructed React 18 production application.
- `docs/`: In-depth architectural, mathematical, and design documentation.
- `scripts/`: Synchronization and CI validation utilities.

---

## 4. Development Workflow

1. **Fork & Branch**: Create a feature branch from `main`:
   ```bash
   git checkout -b feat/my-new-feature
   ```
2. **Commit Conventions**: Use [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: add touch gesture trajectory prediction`
   - `fix: resolve coordinate offset on mobile resize`
   - `docs: update physics formulas in physics-engine.md`
   - `perf: optimize React.memo comparator for SVG paths`
3. **Synchronization**: If modifying the canonical skill in `skills/swarm-animation/`, synchronize:
   ```bash
   npm run sync-skills
   ```
4. **Validation**: Ensure all validation scripts and builds pass:
   ```bash
   npm run validate
   npm run build
   ```
5. **Submit a Pull Request**: Push your branch and open a PR against `main` using our [PR Template](.github/PULL_REQUEST_TEMPLATE.md).

---

## 5. Proposing Changes & Reporting Bugs

- **Bug Reports**: Open an issue using the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md). Include browser version, OS, reproduction steps, and screenshots if applicable.
- **Feature Requests**: Open an issue using the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md). Explain the motivation, proposed API, and alternative approaches.

