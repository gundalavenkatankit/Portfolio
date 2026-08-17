# Venkat Ankit Gundala Portfolio

A personal portfolio for Venkat Ankit Gundala, a full stack software engineer building reliable backend systems, AI products, and accessible interfaces.

## Live portfolio

[View the deployed portfolio](https://venkat-ankit-gundala-portfolio.vercel.app)

## Featured work

1. CivicConnect

   A fictional city services platform with accessible service discovery, permit applications, issue reporting, and request tracking.

2. Disaster Resource Coordinator

   A public safety experience that combines official weather alerts, disaster declarations, shelter records, and recovery center information.

3. Healthcare Cost Navigator

   An upcoming project currently in the research stage. The goal is to help patients understand procedure costs, compare providers, and find financial assistance.

## Technology

1. Next.js 16 with the App Router
2. React 19 and TypeScript
3. CSS with responsive layouts and accessible interaction states
4. Node test runner for automated tests
5. Official public data from the National Weather Service and FEMA
6. Vercel for hosting and continuous deployment

## Local development

Install Node.js 20 or newer and pnpm, then run:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

Run the automated checks before publishing changes:

```bash
pnpm test
pnpm lint
pnpm build
```

The live shelter verification script calls the locally running application. Start the development server first, then use a second terminal:

```bash
pnpm test:shelters:live
```

## Project structure

```text
src/app                         Portfolio pages and application routes
src/app/civicconnect            CivicConnect product experience
src/app/disaster-resource-coordinator
                                Disaster Resource Coordinator experience
src/app/work                    Detailed case studies
src/app/api                     Server routes for official public data
tests                           Automated behavior tests
scripts                         Live data verification scripts
docs                            Research and project documentation
public                          Résumé and public assets
```

## Data and product notes

CivicConnect is a fictional demonstration and does not process real city requests or payments.

Disaster Resource Coordinator displays information from official public sources. Emergency conditions, operating status, and capacity can change quickly. Users should verify details with local authorities before traveling.

## Deployment

The main branch deploys automatically to Vercel after changes are pushed to GitHub.

## Contact

[Email Venkat Ankit Gundala](mailto:gundalavenkatankit@gmail.com)

[LinkedIn](https://www.linkedin.com/in/gundalankit)

[GitHub](https://github.com/gundalavenkatankit)
