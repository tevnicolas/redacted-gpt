//will use
export type UnsavedFilterSet = {
  label: string;
  person: boolean;
  phoneNumber: boolean;
  emailAddress: boolean;
  dateTime: boolean;
  location: boolean;
  usSsn: boolean;
  usDriverLicense: boolean;
  crypto: boolean;
  usBankNumber: boolean;
  creditCard: boolean;
  ipAddress: boolean;
};
//will use
export type FilterSet = UnsavedFilterSet & {
  filterSetId: number;
};

export type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai' | 'security';
};

/* Sends raw text and filter set applied request,
    receives redacted text string response, or error  */
export async function presidioRedaction(
  inputText: string,
  currentSet: string
): Promise<string> {
  const req = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: inputText, filterSet: currentSet }),
  };
  const res = await fetch('/api/presidio', req);
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  const redacted = await res.json();
  if (!redacted.presidio) throw new Error('Redaction Error!');
  return redacted.presidio;
}

export async function promptChatGPT(inputText: string): Promise<string> {
  const req = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: inputText }),
  };
  const res = await fetch('/api/open-ai', req);
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  const aiMessage = await res.json();
  if (!aiMessage.analysis) throw new Error('Analysis Error!');
  return aiMessage.analysis;
}
