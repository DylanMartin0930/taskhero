# TaskHero

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

first, you need to init the project with your package manager of choice, for
example:

```bash
npm init
# or
yarn init
# or 
pnpm init

then you need to install the dependencies:
```bash
npm install axios bcryptjs nodemailer jsonwebtoken react-hot-toast mongoose
# or 
yarn add axios bcryptjs nodemailer jsonwebtoken react-hot-toast mongoose
#or 
pnpm add axios bcryptjs nodemailer jsonwebtoken react-hot-toast mongoose
```

After you need to create a MongoDB account & database

Following you need to create a `.env` file in the root of the project with the following content:

```bash
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
#for local hosting
DOMAIN=http://localhost:3000
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
