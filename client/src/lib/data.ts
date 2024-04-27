import { createContext } from 'react';

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

export type FilterSet = UnsavedFilterSet & {
  filterSetId: number;
};

export type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai' | 'security';
};

const filterSets = createContext<FilterSet[]>([
  {
    filterSetId: 1,
    label: 'first',
    person: true,
    phoneNumber: true,
    emailAddress: true,
    dateTime: true,
    location: true,
    usSsn: true,
    usDriverLicense: true,
    crypto: true,
    usBankNumber: true,
    creditCard: true,
    ipAddress: true,
  },
  {
    filterSetId: 2,
    label: 'second',
    person: false,
    phoneNumber: true,
    emailAddress: false,
    dateTime: false,
    location: false,
    usSsn: false,
    usDriverLicense: false,
    crypto: false,
    usBankNumber: false,
    creditCard: false,
    ipAddress: false,
  },
]);

console.log('filterSets', filterSets);

/** Sends raw text and filter set applied request,
    receives redacted text string response, or error */
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
