import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('configures EmailJS with the Dream Keys service, template and public key', () => {
  assert.match(html, /emailjs\.init\("-sbxA18xf2zBsZIqrdlT2"\)/);
  assert.match(html, /emailjs\.send\("service_h8ef10m", "template_jynyuqc"/);
  assert.doesNotMatch(html, /YOUR_(?:PUBLIC_KEY|SERVICE_ID|TEMPLATE_ID)/);
});

test('includes the clicked card name and an ISO timestamp in the notification payload', () => {
  assert.match(html, /card_name:\s*card\.name/);
  assert.match(html, /clicked_at:\s*new Date\(\)\.toISOString\(\)/);
});

test('sends a notification only when a card is opened', () => {
  assert.match(html, /if \(!isOpen\) \{\s*emailjs\.send/s);
});
