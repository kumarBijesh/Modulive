# Antigravity Setup

Antigravity supports workspace Rules under `.agents/rules`, Skills under `.agents/skills`, and Workflows that can be invoked with slash commands.

## Copy this package into your project

The package already contains:

```text
.agents/
├── rules/
├── skills/
└── workflows/
```

Open the MyStore project as the Antigravity workspace.

## First prompt

Paste:

> Read @MASTER_BUILD_PROMPT.md, @PRD.md and all files under .agents/rules, .agents/skills and .agents/workflows. Do not code yet. Inspect the current workspace, identify what already exists, produce an implementation plan, list missing dependencies/configuration, and identify security risks. Wait for my approval before making code changes.

## Then

Use:

```text
/foundation
```

If your Antigravity installation does not automatically discover these workflow files, create/import them through the Workflows customization UI or place them in the workspace workflow location supported by your version.

## Important

Antigravity workspace rules should remain under `.agents/rules`. Keep project-specific instructions there rather than relying only on a giant chat prompt.

Do not give the agent unrestricted permissions for destructive commands. Review command/browser permission prompts carefully.
