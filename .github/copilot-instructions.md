# Copilot Instructions for AI Coding Agents

## Context7 Usage

- Whenever documentation, code examples, code editing or library usage guidance is needed, prefer using Context7-powered tools and documentation sources for the most accurate and up-to-date information.

## Commit message

- Use the format `fix(<component>): <description>` for bug fixes.
- Use the format `feat(<component>): <description>` for new features.
- If not provided, use the folder name as component name.
- No need to go into too much detail in the commit message, just a brief description of the change is sufficient.
- If there are multiple changes in multiple files, use a single commit with a summary of the changes.

## Project Overview

- This is a Next.js (App Router) monorepo using TypeScript, pnpm, and React.
- Main app code is in `src/app/` and `src/components/`.
- State management uses Redux Toolkit (`src/redux/`).
- API communication is handled via custom axios clients (`src/axios/`).
- UI components are organized by domain (e.g., `components/dau_gia/`, `components/cong_chung/`, `components/luat_su/`).
- Constants and types are grouped by domain in `src/constants/` and `src/types/`.
- Forms use `react-hook-form` and custom UI wrappers.
- Data fetching uses `@tanstack/react-query`.

## Build & Deploy

- Build with `pnpm build` (preferred) or `yarn build`.
- After build, copy `.next/static` into `.next/standalone/.next`.
- Deploy `.next/standalone` to the server.
- Start with: `pm2 start "PORT=3456 node server.js" --name bttp`.

## Key Patterns & Conventions

- Use domain-driven folder structure for components, constants, and types.
- Prefer `AutoCompleteSearch` for select/search UI, and custom `DatePickerInput` for dates.
- Use `useFormContext` and `useWatch` for form state and conditional logic.
- All API endpoints and queries are abstracted in `src/service/`.
- Use `@tanstack/react-query` for all async data fetching and caching.
- UI state and business logic are separated: keep UI in components, logic in hooks/services.
- Use `FormField`, `FormItem`, `FormLabel`, `FormControl`, and `FormMessage` for form fields.
- Use `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, and `SelectItem` for dropdowns.
- Use `Collapsible` for sectioned forms and dashboards.

## Integration & External Dependencies

- Uses `pm2` for process management in production.
- Uses `@tanstack/react-query` for data fetching.
- Uses `react-hook-form` for forms.
- Uses custom axios clients for API calls.

## Examples

- See `src/components/dau_gia/to_chuc/infoSection.tsx` for a full-featured form with conditional fields, react-query, and custom UI.
- See `src/redux/Store.ts` for Redux setup.
- See `src/service/` for API abstraction patterns.

## Tips for AI Agents

- Always follow the domain-driven structure when adding new features.
- Reuse existing UI primitives and hooks where possible.
- When in doubt, check for similar patterns in the same domain folder.
- Keep business logic out of UI components; use hooks/services.
- Use the build and deploy steps above for local and production workflows.
