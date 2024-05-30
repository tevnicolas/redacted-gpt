# RedactedGPT

![License](https://img.shields.io/github/license/tevnicolas/redacted-gpt)
![Issues](https://img.shields.io/github/issues/tevnicolas/redacted-gpt)
![Stars](https://img.shields.io/github/stars/tevnicolas/redacted-gpt)
![Forks](https://img.shields.io/github/forks/tevnicolas/redacted-gpt)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Demo](#demo)
- [Usage](#usage)
- [License](#license)
- [Contact](#contact)

## Description

RedactedGPT is a full-stack web application designed for security-conscious professionals. It enables the safe analysis of text data using AI by first incorporating redaction of sensitive information. This ensures that any sensitive data is filtered before being processed by OpenAI's ChatGPT API, maintaining privacy and security. For text redaction, RedactedGPT integrates Microsoft Presidio, a tool for machine learning-powered text redaction, allowing users to safely use OpenAI's API with filtered data. Importantly, all sensitive information submitted for redaction is never stored anywhere, ensuring user privacy and data security.

The application features a responsive front-end built with TypeScript, React, and Tailwind CSS. The back-end is designed using Node.js, Express.js, and a PostgreSQL database, hosted on AWS.

## Features

- **Using Filters and Filter Sets for Redaction with Microsoft Presidio**:

  - Use default single filters or create redaction filter sets by selecting multiple types of information to redact (e.g., names, addresses, phone numbers, emails, social security numbers, credit card numbers).
  - Label and manage multiple filter sets.
  - Edit and delete existing filter sets.
  - Redaction is made possible by the Presidio anonymizer and the Presidio analyzer, which are Python based services for detecting and anonymizing PII entities in text.

- **Prompting with OpenAi's ChatGPT**:

  - Prompt redacted text (or bypass redaction) to be processed by the most advanced model of OpenAi's ChatGPT service, and wait for a response.
  - Chat GPT is an artificial intelligence program that generates dialogue. This highly capable chatbot uses a large language model to process and analyze large amounts of data to generate responses to user inquiries.

- **Security and Account Management**:
  - Sensitive information submitted for redaction is processed through HTTPS encryption, and is never stored anywhere or seen by ChatGPT. Only by clicking 'Prompt' is data sent to ChatGPT.
  - This application efficiently manage Filter Set data with JSON. This data is stored in a database for logged-in users, while guest data is stored in session storage.

## Demo

![Kapture 2024-05-19 at 14 50 49](https://github.com/tevnicolas/redacted-gpt/assets/155599138/b535c08c-3617-43f1-a3f5-b5ac215b9f07)

## Usage

To use RedactedGPT, follow these steps:

1. **Visit the Application**:

   - Go to [RedactedGPT](https://your-live-demo-link.com).

2. **Authentication**:

   - Enter your existing credentials, or create an account if you do not already have one. You can continue as a guest by skipping this step.
   - Guests have full access, but their saved Filter Sets persist only for the session, whereas logged-in users' Filter Sets persist indefinitely.

3. **Create Redaction Filter Sets**:

   - Navigate to the Filter Sets page and select the filter types for the information you want to redact (e.g., names, email addresses, phone numbers, social security numbers, credit card numbers).
   - Label the newly created Filter Set for future use.
   - If you do not require multiple filters being applied simultaneously, skip this step.

4. **Enter Prompt**:

   - Type your text prompt.

5. **Redaction**:

   - Select the appropriate filter or created Filter Set to redact sensitive information.
   - If redaction is not required, select 'None' and proceed to the next step.
   - Click the 'Redact' button and wait for the successful redaction message.

6. **AI Analysis**:

   - Review your text to verify all sensitive information has been redacted.
   - Submit the prompt to the ChatGPT API by clicking the 'Prompt' button.
   - Wait for successful generation, and then review the AI-generated response.

## Prerequisites (for Development)

Ensure you have the following installed:

- **React**
- **Vite**
- **Node.js**
- **npm**
- **TypeScript**: Ensure TypeScript is installed globally or it will be installed as part of the project dependencies.
- **Tailwind CSS**
- **PostgreSQL**: Install and set up PostgreSQL. Ensure you have a database ready for the application.
- **AWS Account**: Necessary for hosting the back-end.
- **Code Editor**: Visual Studio Code (recommended)
- **Browser**: Google Chrome (recommended for development)

## Installation (for Development)

Follow these steps to set up and run the project:

1. **Clone the repository**

2. **Install root dependencies**:

   ```sh
   npm install
   ```

3. **Install client and server dependencies**:

   ```sh
   npm run install:client
   npm run install:server
   ```

4. **Set up environment variables**:

   - Create a `.env` file in the `server` directory by copying the example file:
     ```sh
     cp server/.env.example server/.env
     ```
   - Update the `.env` file with necessary environment variables:
     PORT=8080
     DATABASE_URL=postgres://USERNAME:PASSWORD@HOST/DATABASE
     TOKEN_SECRET=YOUR_SECRET_TOKEN
     OPEN_AI_API_KEY=YOUR_OPENAI_API_KEY

5. **Run the development servers**:

   - To run both client and server concurrently:
     ```sh
     npm run dev
     ```
   - To run only the client or server:
     ```sh
     npm run dev:client
     npm run dev:server
     ```

6. **Available Scripts**

- `npm run dev`: Runs both the client and server development servers concurrently.
- `npm run dev:client`: Runs the client development server using Vite.
- `npm run dev:server`: Runs the server development server using TSX.
- `npm run build`: Builds the client project using TypeScript and Vite.
- `npm run start`: Starts the server in production mode.
- `npm run lint`: Lints both client and server files.
- `npm run lint:client`: Lints the client files using ESLint.
- `npm run lint:server`: Lints the server files using ESLint.
- `npm run db:import`: Imports database schema and data (assuming you have a `database/import.sh` script).
- `npm run deploy`: To deploy the application.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please contact:

Your Name - [tevnicolas@protonmail.com](mailto:tevnicolas@protonmail.com)

Project Link: [https://github.com/tevnicolas/redacted-gpt](https://github.com/tevnicolas/redacted-gpt)
