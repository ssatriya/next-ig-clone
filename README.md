# Instagram Clone App 🚀

Welcome to the Instagram Clone App repository! This project aims to replicate the core functionalities of Instagram, providing users with a platform to share their thoughts through pictures, follow others, and engage in meaningful conversations with comments.

This project is using Drizzle ORM and Neon PostgreSQL. Some feature from that version of project implemented in this one yet, but will gradually add.

## Features 🌟

- **Authentication:** Currently user can authenticate only using Gmail with [Lucia Auth](https://lucia-auth.com/getting-started/), my fav auth lib.
- **Posting:** Post your image with or without caption, user can upload multiple image at one and form carousel. Currently only support image and not video. I use [uploadthing](https://uploadthing.com/) service to make it easy and fast to implement, will try to use AWS S3 in the future.
- **Follow and Unfollow:** You can follow and un-follow other user, you only able to see followed user post in you feed.
- **Like and Comment:** You can like and comment to post you see in your feed. Sub-comment and mention not implemented yet.

## Tech Stack 🛠️

- **Frontend:** React with Nextjs, [Zustand](https://zustand-demo.pmnd.rs/) for state management, [Shadcn UI](https://ui.shadcn.com/) for styling with [Tailwind CSS](https://tailwindcss.com/).
- **Backend:** [Next.js](https://nextjs.org/) for all the process that require to display data in the frontend.
- **Database:** PostgreSQL for database storage, via [Neon](https://neon.tech/) service.
- **Real-Time Updates:** Using [Tanstack Query](https://tanstack.com/) package to give a real-time user experience.

## TODO 📝

- Implement responsive design.
- Implement profile edit.
- Implement mention and sub comment.
- Implement github and email sign-up for authentication.

## Knwon Bug 🐞

-

## Getting Started 🚀

1.  Clone the repository:

    ```bash
    git clone https://github.com/ssatriya/next-ig-clone

    ```

2.  Open the project:

    ```bash
    cd x
    npm install
    ```

3.  Create the .env file
4.  Start the project
    ```bash
    npm run dev
    ```
