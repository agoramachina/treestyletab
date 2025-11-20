/*
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

const TOOLTIP = 'tab_trash_tooltip';

export const kTAB_TRASH_ELEMENT_NAME = 'tab-trash';

const kTAB_TRASH_CLASS_NAME = 'trash';

export class TabTrashElement extends HTMLElement {
  static define() {
    window.customElements.define(kTAB_TRASH_ELEMENT_NAME, TabTrashElement);
  }

  constructor() {
    super();

    // We should initialize private properties with blank value for better performance with a fixed shape.
    this._reservedUpdate = null;

    this.initialized = false;
  }

  connectedCallback() {
    if (this.initialized) {
      this.invalidate();
      return;
    }

    // We preserve this class for backward compatibility with other addons.
    this.classList.add(kTAB_TRASH_CLASS_NAME);

    this.setAttribute('role', 'button');
    this.setAttribute('title', browser.i18n.getMessage(TOOLTIP) || 'Remove from list');

    this.invalidate();
    this.setAttribute('draggable', true); // this is required to cancel click by dragging

    this.initialized = true;
  }

  disconnectedCallback() {
    if (this._reservedUpdate) {
      this.removeEventListener('mouseover', this._reservedUpdate);
      this._reservedUpdate = null;
    }
  }

  invalidate() {
    if (this._reservedUpdate)
      return;

    this._reservedUpdate = () => {
      this._reservedUpdate = null;
      this._updateTooltip();
    };
    this.addEventListener('mouseover', this._reservedUpdate, { once: true });
  }

  _updateTooltip() {
    const tab = this.owner;
    if (!tab || !tab.$TST)
      return;

    const tooltip = browser.i18n.getMessage(TOOLTIP) || 'Remove from list';
    this.setAttribute('title', tooltip);
  }

  makeAccessible() {
    this.setAttribute('aria-label', browser.i18n.getMessage('tab_trash_aria_label', [this.owner.id]) || `Remove tab ${this.owner.id} from list`);
  }
}
