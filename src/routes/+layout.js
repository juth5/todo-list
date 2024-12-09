import { awaitAuthReady } from "../lib/scripts/authStore"
import { browser } from '$app/environment';

export async function load() {
  console.log('layout.js')
  let promises = [];

  if (browser) {
    promises.push(awaitAuthReady());
  }
  await Promise.all(promises);
}