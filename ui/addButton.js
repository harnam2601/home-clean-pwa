import { html } from 'https://esm.sh/htm/preact/standalone';

export const AddButton = ({ onClick }) => {
  if (!onClick) return null;
  return html`<button id="add-button" class="fab" aria-label="Add" onClick=${onClick}>+</button>`;
};

