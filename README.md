# RedactedGPT

![License](https://img.shields.io/github/license/your-username/redactedgpt)
![Issues](https://img.shields.io/github/issues/your-username/redactedgpt)
![Stars](https://img.shields.io/github/stars/your-username/redactedgpt)
![Forks](https://img.shields.io/github/forks/your-username/redactedgpt)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Demo](#demo)
- [Usage](#usage)
- [License](#license)
- [Contact](#contact)

## Description

RedactedGPT is a full-stack web application designed for security-conscious professionals. It enables the safe analysis of text data using AI by incorporating redaction of sensitive information. This ensures that any sensitive data is filtered before being processed by OpenAI's API, maintaining privacy and security.

The application features a responsive front-end built with TypeScript, React, and Tailwind CSS. The back-end is robustly designed using Node.js, Express.js, and a PostgreSQL database, hosted on AWS. For text redaction, RedactedGPT integrates Microsoft Presidio, a tool for machine learning-powered text redaction, allowing users to safely use OpenAI's API with filtered data.

## Features

- **User Authentication**:
  - Create an account or proceed as a guest.
  - Guests have full access but their saved filter sets persist only for the session.

- **Redaction Filter Sets**:
  - Create redaction filter sets by selecting types of information to redact (e.g., names, addresses, phone numbers, emails, social security numbers, credit card numbers).
  - Label and manage multiple filter sets.
  - Edit and delete existing filter sets.

- **Prompt Management**:
  - Type in a prompt, select a filter set, and view/edit the redacted text.
  - Submit prompts to the ChatGPT API.
  - View and interact with the AI-generated responses.

- **User Experience**:
  - Designed with a user-friendly interface for easy navigation and use.
  - Efficiently manage data with JSON, storing account data in a database for logged-in users and guest data in session storage.

## Demo

![Uploading Kapture 2024-05-19 at 14.50.49.gif…]()

## Usage

To use RedactedGPT, follow these steps:

1. **Visit the Application**:
   Go to [RedactedGPT](https://your-live-demo-link.com).

2. **Authentication**:
   - Create an account or continue as a guest.

3. **Create Redaction Filter Sets**:
   - Select the types of information you want to redact (e.g., names, addresses).
   - Label the filter set for future use.

4. **Submit Prompts**:
   - Type your text prompt.
   - Select the appropriate filter set to redact sensitive information.
   - View and edit the redacted text if necessary.

5. **AI Analysis**:
   - Submit the redacted prompt to the ChatGPT API.
   - Review the AI-generated response.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please contact:

Your Name - [tevnicolas@protonmail.com](mailto:tevnicolas@protonmail.com)

Project Link: [https://github.com/your-username/redactedgpt](https://github.com/tevnicolas/redacted-gpt/)
