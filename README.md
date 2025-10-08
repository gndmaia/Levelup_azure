# LevelUp Azure - AI-900 Practice PlatformThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



A comprehensive web application for practicing Azure AI-900 certification exam with interactive Practice and Exam modes.## Getting Started



## FeaturesFirst, run the development server:



### Practice Mode```bash

- Untimed practice with instant feedbacknpm run dev

- Choose specific topics or mixed questions# or

- Detailed explanations and reference linksyarn dev

- Bookmark questions for later review# or

pnpm dev

### Exam Mode# or

- Realistic exam simulation with 60-minute timerbun dev

- 45 questions balanced by topic and difficulty```

- Flag questions for review

- Comprehensive summary with score breakdownOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.



## Getting StartedYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.



```bashThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

# Install dependencies

npm install## Learn More



# Run development serverTo learn more about Next.js, take a look at the following resources:

npm run dev

```- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

Open [http://localhost:3000](http://localhost:3000)

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Demo Credentials

- Email: admin@levelup.azure## Deploy on Vercel

- Password: admin123

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

## Tech Stack

- Next.js 14 + TypeScriptCheck out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

- Tailwind CSS
- Headless UI
- In-memory data store (MVP)

## Project Structure
- `/app` - Pages and API routes
- `/components` - React components
- `/lib` - Core business logic
- `/types` - TypeScript definitions

## Adding More Exams
The platform supports multiple certifications. Add questions with new `examId` values.

## License
MIT
