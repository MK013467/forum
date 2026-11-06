# CLAUDE.md

Forum app. npm workspaces monorepo: `backend/` (NestJS 11, Prisma 6 + MySQL, Redis sessions, passport-local) and `client/` (React 19 + Vite, React Query, Zustand, axios). Backend deploys to Railway, frontend to Vercel.

## Commands

```bash
npm install                      # from the repo root. Never create package-lock.json in subfolders
npm run dev                      # root: backend (3000) + client (5173). Needs MySQL and Redis

# in backend/
DATABASE_URL=mysql://u:p@localhost:3306/db npx prisma generate   # required before typecheck/tests. generate does not connect to the DB
npx tsc --noEmit                 # typecheck
npx jest path/to/file.spec.ts    # single test file (prefer over the full suite)
npx eslint path/to/file.ts       # changed files only. `npm run lint` has --fix and rewrites every file
```

## Current baseline (update this section when you fix something)

Know the state before your change so you can tell whether you broke something.

- backend `tsc --noEmit`: passes (after prisma generate)
- backend `jest`: 5 of 15 suites fail. Most are Nest CLI generated "should be defined" specs missing mocks for PrismaService and other dependencies. Only check that no new suite fails; fix existing failures in a separate commit.
- backend `eslint src`: 122 errors. Do not touch lint errors in files you did not change.
- client `npm run build`: fails on `tsc` unused-variable errors. `npx vite build` passes.

## Rules for this repo

- **Auth**: routes that need login get `@UseGuards(AuthenticatedGuard)`. Always take the author/owner id from `req.user.id`; never trust `authorId`/`userId` from the body or query.
- **Validation**: every `@Body()` is a DTO class with class-validator decorators. No `any` or inline types.
- **ValidationPipe whitelist ordering trap**: turning on `whitelist: true` in the ValidationPipe in `main.ts` silently strips DTO fields without decorators. Some DTOs currently lack decorators, so enabling it first breaks creating/editing posts and likes. Add all DTO decorators before enabling it.
- **Update DTOs**: never put fields the client must not change, such as `likes` or `authorId`, in a PATCH DTO.
- **Error handling**: services throw Nest `HttpException` subclasses (`NotFoundException`, `ForbiddenException`, etc.). If you catch in `try/catch`, rethrow HttpExceptions. Swallowing them and returning a normal value sends permission errors out as 200. `src/prisma/prisma-exception.ts` is an empty file; do not assume anything lives there.
- **Response shape**: `ResponseInterceptor` wraps every successful response as `{ success, statusCode, data }`, and the axios interceptor in `client/src/api.ts` unwraps `data`. Changing only one side breaks the whole frontend.
- **API calls from the frontend**: use only the `api` instance from `client/src/api.ts`. When adding a call or changing a path, confirm the route actually exists in a backend controller.
- **Throttling**: `ThrottlerModule` is registered but there is no `ThrottlerGuard`, so rate limiting does not run yet. Do not assume it does.

## DB migrations

- After changing `schema.prisma`, generate SQL with `npx prisma migrate dev --create-only --name <name>` and read the generated SQL for data loss (DROP, cascade, added unique constraints).
- Never edit committed files under `prisma/migrations/*`. Add a new migration instead.
- Migrations reach the production DB (Railway), so ship them in their own PR, never mixed with feature changes.
- Do not use `prisma db push` or `migrate reset`.

## Workflow

- Commit, push, or open a PR only after the user approves.
- One purpose per PR. If you spot other problems while fixing a bug, do not fix them; note them in the PR description.
- Add tests for behavior you change. Service tests mock `PrismaService` (see `post.service.spec.ts`).
