import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('configures EmailJS with the Dream Keys service, template and public key', () => {
  assert.match(html, /emailjs\.init\("ruBacw2DjeOr8YwBH"\)/);
  assert.match(html, /emailjs\.send\("service_h8ef10m", "template_jynyuqc"/);
  assert.doesNotMatch(html, /YOUR_(?:PUBLIC_KEY|SERVICE_ID|TEMPLATE_ID)/);
});

test('does not carry the old, rejected public key', () => {
  assert.doesNotMatch(html, /sbxA18xf2zBsZIqrdlT2/);
});

test('includes the clicked card name and an ISO timestamp in the notification payload', () => {
  assert.match(html, /card_name:\s*card\.name/);
  assert.match(html, /clicked_at:\s*new Date\(\)\.toISOString\(\)/);
});

test('sends a notification only when a card is opened', () => {
  assert.match(html, /if \(!isOpen\) \{\s*emailjs\.send/s);
});

test('surfaces a failed notification in the page instead of only the console', () => {
  // The failure path must both log and make the error visible to the reader.
  assert.match(html, /console\.error\('EmailJS notification failed/);
  assert.match(html, /notice\.textContent = '\[ ! \] Notification not sent/);
  assert.match(html, /notice\.style\.display = 'block'/);
  assert.match(html, /\.card-notice \{/);
});

test('clears a stale failure notice on the next click', () => {
  assert.match(html, /indicator\.textContent = isOpen \? '\[ \+ \]' : '\[ − \]';\s*notice\.style\.display = 'none';/);
});
