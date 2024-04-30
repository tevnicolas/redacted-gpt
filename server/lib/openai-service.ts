export async function startAnalysisThread(prompt: string): Promise<string> {
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
      `HTTP error inside startAnalysisThread during threadResponse fetch. Status: ${threadResponse.status}`
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
      `HTTP error inside startAnalysisThread during inputResponse fetch. Status: ${inputResponse.status}`
    );
  }
  return threadId;
}

export async function createAnalysisRun(threadId: string): Promise<string> {
  const runResponse = await fetch(
    `https://api.openai.com/v1/threads/${threadId}/runs`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({ assistant_id: 'asst_zugUooF8ONOkoEqoD2Hc0wWz' }),
    }
  );
  if (!runResponse.ok) {
    throw new Error(
      `HTTP error inside createAnalysisRun during runResponse fetch. Status: ${runResponse.status}`
    );
  }
  const runData = await runResponse.json();
  await waitForRunCompletion(threadId, runData.id);
  return runData.thread_id;
}

/* This function executes inside of startAnalysisThread before it returns */
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
            'OpenAI-Beta': 'assistants=v2',
          },
        }
      );
      if (!runStatusResponse.ok) {
        throw new Error(
          `HTTP error inside waitForRunCompletion during runStatusResponse fetch. Status: ${runStatusResponse.status}`
        );
      }
      const runStatusData = await runStatusResponse.json();
      if (runStatusData.status === 'completed') {
        return; // Exit the loop if the run is completed
      }
    } catch (error) {
      console.error(
        `Error fetching run status (Attempt ${retries + 1}):`,
        error
      );
    }
    /* so whether the run is completed or not, wait 2 sec before trying again; finally block is not applicable here as we need to exit the try block and while loop, if completed, without retrying. */
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay *= 2; // Double the delay for the next retry
    retries++;
  }
  throw new Error(
    "Maximum retries reached inside waitForRunCompletion (which is executed inside createAnalysisRun) while fetching runStatusResponse, it's status never became 'completed'."
  );
}

export async function getAnalysisResponse(
  runThreadId: string
): Promise<string> {
  const messagesResponse = await fetch(
    `https://api.openai.com/v1/threads/${runThreadId}/messages`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2',
      },
    }
  );
  if (!messagesResponse.ok) {
    throw new Error(
      `HTTP error inside getAnalysisResponse during messagesResponse fetch. Status: ${messagesResponse.status}`
    );
  }
  const messagesData = await messagesResponse.json();
  const analysisResponse = messagesData.data[0].content[0].text.value;
  return analysisResponse;
}
