export function SupportPage() {
  return (
    <div className="max-w-[780px]">
      <div className="bw-768:p-8 bw-768:ml-12 bw-768:mr-12 pt-8 pb-8">
        <p className="text-left indent-10">
          RedactedGPT is a full-stack web application designed for
          security-conscious professionals. It enables the safe analysis of text
          data using AI by first incorporating redaction of sensitive
          information. This ensures that any sensitive data is filtered before
          being processed by OpenAI's ChatGPT API, maintaining privacy and
          security. For text redaction, RedactedGPT integrates Microsoft
          Presidio, a tool for machine learning-powered text redaction, allowing
          users to safely use OpenAI's API with filtered data. Importantly, all
          sensitive information submitted for redaction is never stored
          anywhere, ensuring user privacy and data security.
        </p>
      </div>
      <div className="bw-768:p-8 bw-768:ml-12 bw-768:mr-12 pt-8 pb-8">
        <img src="https://github.com/tevnicolas/redacted-gpt/assets/155599138/b535c08c-3617-43f1-a3f5-b5ac215b9f07" />
      </div>
      <div className="bw-768:p-8 bw-768:ml-12 bw-768:mr-12 pt-8 pb-8">
        <p>To use RedactedGPT, follow these steps:</p>
        <p className="text-left">
          <br />
          1. Log in - Enter your existing credentials, or create an account if
          you do not already have one. You can continue as a guest by skipping
          this step. Guests have full access, but their saved Filter Sets
          persist only for the session, whereas logged-in users' Filter Sets
          persist indefinitely.
          <br />
          <br />
          2. Create Filter Sets for redaction - Navigate to the Filter Sets page
          and select the filter types for the information you want to redact
          (e.g., names, email addresses, phone numbers, social security numbers,
          credit card numbers). Label the newly created Filter Set for future
          use. If you do not require multiple filters being applied
          simultaneously, skip this step.
          <br />
          <br />
          3. Type your text prompt.
          <br />
          <br />
          4. Redaction - Select the appropriate filter or created Filter Set to
          redact sensitive information. If redaction is not required, select
          'None' and proceed to the next step. Click the 'Redact' button and
          wait for the successful redaction message.
          <br />
          <br />
          5. AI Analysis - Review your text to verify all sensitive information
          has been redacted. Submit the prompt to the ChatGPT API by clicking
          the 'Prompt' button. Wait for successful generation, and then review
          the AI-generated response.
        </p>
      </div>
    </div>
  );
}
