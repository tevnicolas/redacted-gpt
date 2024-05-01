import { AccountFilterSet } from 'shared/types';
import { UnauthorizedError } from './errors-checks';

export const tokenKey = 'um.token';

export function saveToken(token: string | undefined): void {
  if (token) {
    sessionStorage.setItem(tokenKey, token);
  } else {
    sessionStorage.removeItem(tokenKey);
  }
}

export function readToken(): string | undefined {
  const token = sessionStorage.getItem(tokenKey);
  return token !== null ? token : undefined; // transform null to undefined
}

export async function readAccountSets(
  token: string
): Promise<AccountFilterSet[]> {
  const req = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch('/api/filter-sets', req);
  if (!res.ok) {
    const error =
      res.status === 401
        ? // Being explicit about expired token, parent catch will auto sign out
          new UnauthorizedError(
            'Your session has expired. Please log in again.'
          )
        : // Other error which does not call for sign out
          new Error(
            `Something went wrong while retrieving your Filter Sets. Status: ${res.status}.`
          );
    throw error;
  }
  const filterSets: AccountFilterSet[] = await res.json();
  // Will be caught as unexpected error
  if (!filterSets) throw 'Data retrieval services are possibly down.';
  return filterSets;
}

export async function addAccountSet(
  filterSet: AccountFilterSet,
  token: string
): Promise<AccountFilterSet> {
  const res = await fetch('/api/filter-sets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(filterSet),
  });
  if (!res.ok)
    throw new Error(`Failed to add Filter Set. Status: ${res.status}.`);
  const result = await res.json();
  return result;
}

/** Sends raw text and Filter Set applied request,
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
    throw new Error(`Redaction request failed with Status: ${res.status}`);
  }
  const redacted = await res.json();
  // will be logged as unexpected error
  if (!redacted.presidio) throw 'Redaction services are possibly down.';
  return redacted.presidio;
}

export async function promptChatGPT(inputText: string): Promise<string> {
  const req = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: inputText }),
  };
  const res = await fetch('/api/openai', req);
  if (!res.ok) {
    throw new Error(`Ai request failed with Status ${res.status}`);
  }
  const aiMessage = await res.json();
  // will be logged as unexpected error
  if (!aiMessage.analysis) throw 'Ai services are possibly down.';
  return aiMessage.analysis;
}
