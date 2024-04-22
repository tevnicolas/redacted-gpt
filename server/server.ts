/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { promisify } from 'node:util';
import { exec as nodeExec } from 'node:child_process';
import {
  ClientError,
  defaultMiddleware,
  errorMiddleware,
} from './lib/index.js';
import { nextTick } from 'node:process';

const exec = promisify(nodeExec);

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;
const db = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.post('/api/presidio', async (req, res, next) => {
  try {
    const { prompt, filterSet } = req.body;
    if (!prompt) throw new ClientError(400, 'Prompt must be provided.');
    if (prompt.length > 4095)
      throw new ClientError(400, 'Prompt must be less than 4096 characters.');
    if (!filterSet) throw new ClientError(400, 'Filter Set must be selected.');
    const { stdout } = await exec(
      `python3 ./try.python "${prompt}" ${filterSet}`
    );
    res.status(201).json({ presidio: stdout });
  } catch (error) {
    next(error);
  }
});

async function startAnalysisThread(prompt: string): Promise<string> {
  try {
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v1',
      },
    });

    if (!threadResponse.ok) {
      throw new Error(
        `HTTP error when creating a thread! status: ${threadResponse.status}`
      );
    }

    const threadData = await threadResponse.json();
    const threadId = threadData.id;

    const data = {
      role: 'user',
      content: prompt,
    };

    const inputResponse = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v1',
        },
        body: JSON.stringify(data),
      }
    );

    if (!inputResponse.ok) {
      throw new Error(
        `HTTP error when adding input message! Status: ${inputResponse.status}`
      );
    }
    return threadId;
  } catch (error) {
    console.error('Error (analysis thread)', error);
    throw error;
  }
}

async function createAnalysisRun(threadId: string): Promise<string> {
  try {
    const runResponse = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/runs`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v1',
        },
        body: JSON.stringify({ assistant_id: 'asst_zugUooF8ONOkoEqoD2Hc0wWz' }),
      }
    );

    if (!runResponse.ok) {
      throw new Error(
        `HTTP error in creating a run Status ${runResponse.status}`
      );
    }

    const runData = await runResponse.json();
    await waitForRunCompletion(threadId, runData.id);

    return runData.thread_id;
  } catch (error) {
    console.error('Error (analysis run): ', error);
    throw error;
  }
}

async function waitForRunCompletion(
  threadId: string,
  runId: string
): Promise<void> {
  let retries = 0;
  const maxRetries = 10;
  let delay = 2000; // Initial delay in milliseconds

  while (retries < maxRetries) {
    try {
      const runStatusResponse = await fetch(
        `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v1',
          },
        }
      );

      if (!runStatusResponse.ok) {
        throw new Error(`HTTP error! Status: ${runStatusResponse.status}`);
      }

      const runStatusData = await runStatusResponse.json();
      if (runStatusData.status === 'completed') {
        return; // Exit the loop if the run is completed
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Double the delay for the next retry
      retries++;
    } catch (error) {
      console.error(
        `Error fetching run status (Attempt ${retries + 1}):`,
        error
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Double the delay for the next retry
      retries++;
    }
  }

  throw new Error('Maximum retries reached waiting for run completion');
}

async function getAnalysisResponse(runThreadId: string): Promise<string> {
  try {
    const messagesResponse = await fetch(
      `https://api.openai.com/v1/threads/${runThreadId}/messages`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v1',
        },
      }
    );

    if (!messagesResponse.ok) {
      throw new Error(
        `HTTP error when fetching messages! Status: ${messagesResponse.status}`
      );
    }

    const messagesData = await messagesResponse.json();
    const analysisResponse = messagesData.data[0].content[0].text.value;

    return analysisResponse;
  } catch (error) {
    console.error('Error (analysis response):', error);
    throw error;
  }
}

app.post('/api/open-ai', async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const threadId = await startAnalysisThread(prompt);
    const runThreadId = await createAnalysisRun(threadId);
    const analysis = (await getAnalysisResponse(runThreadId)).replace(
      /\n/g,
      '<br>'
    );
    res.status(200).json({ analysis });
  } catch (error) {
    console.error('Error in processing OpenAI API request:', error);
    next(error);
  }
});

/*
 * Middleware that handles paths that aren't handled by static middleware
 * or API route handlers.
 * This must be the _last_ non-error middleware installed, after all the
 * get/post/put/etc. route handlers and just before errorMiddleware.
 */
app.use(defaultMiddleware(reactStaticDir));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
