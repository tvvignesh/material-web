/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/focus/focus-ring';
import '@material/web/ripple/ripple';

import {ActionElement, PressBeginEvent, PressEndEvent} from '@material/web/actionelement/action-element';
import {pointerPress, shouldShowStrongFocus} from '@material/web/focus/strong-focus';
import {MdRipple} from '@material/web/ripple/ripple';
import {html, TemplateResult} from 'lit';
import {property, query, state} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';

/**
 * @soyCompatible
 */
export abstract class FabShared extends ActionElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  @property({type: Boolean}) disabled = false;

  @property() icon = '';

  @property() label = '';

  @property({type: Boolean}) lowered = false;

  @property({type: Boolean}) reducedTouchTarget = false;

  @query('md-ripple') ripple!: MdRipple;

  @state() protected showFocusRing = false;

  constructor() {
    super();
    this.addEventListener('pressbegin', this.handlePressBegin);
    this.addEventListener('pressend', this.handlePressEnd);
  }

  /**
   * @soyTemplate
   * @soyClasses fabClasses: .md3-fab
   */
  protected override render(): TemplateResult {
    const ariaLabel = this.label ? this.label : this.icon;

    return html`
      <button
        class="md3-fab md3-surface ${classMap(this.getRenderClasses())}"
        ?disabled="${this.disabled}"
        aria-label="${ariaLabel}"
        @focus="${this.handleFocus}"
        @blur="${this.handleBlur}"
        @pointerdown="${this.handlePointerDown}"
        @pointerup="${this.handlePointerUp}"
        @pointercancel="${this.handlePointerCancel}"
        @pointerleave="${this.handlePointerLeave}"
        @pointerenter="${this.handlePointerEnter}"
        @click="${this.handleClick}"
        @clickmod="${this.handleClick}"
        @contextmenu="${this.handleContextMenu}">
        ${this.renderElevationOverlay()}
        ${this.renderFocusRing()}
        ${this.renderRipple()}
        <span class="md3-fab__icon">
          <slot name="icon">${this.renderIcon(this.icon)}</slot>
        </span>
        ${this.renderLabel()}
        ${this.renderTouchTarget()}
      </button>`;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {'md3-fab--lowered': this.lowered};
  }

  /** @soyTemplate */
  protected abstract renderIcon(icon: string): TemplateResult|string;

  /** @soyTemplate */
  protected renderTouchTarget(): TemplateResult {
    return this.reducedTouchTarget ? html`` :
                                     html`<div class="md3-fab__touch"></div>`;
  }

  /** @soyTemplate */
  protected renderLabel(): TemplateResult|string {
    return '';
  }

  /** @soyTemplate */
  protected renderElevationOverlay(): TemplateResult {
    return html`<div class="md3-elevation-overlay"></div>`;
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult {
    return html`<md-ripple class="md3-fab__ripple" .disabled="${
        this.disabled}"></md-ripple>`;
  }

  /** @soyTemplate */
  protected renderFocusRing(): TemplateResult {
    return html`<md-focus-ring .visible="${
        this.showFocusRing}"></md-focus-ring>`;
  }

  // protected handlePressBegin(event: PressBeginEvent) {
  protected handlePressBegin(event: CustomEvent) {
    this.ripple.beginPress(event.detail.positionEvent);
  }

  // protected handlePressEnd(event: PressEndEvent) {
  protected handlePressEnd(event: CustomEvent) {
    this.ripple.endPress();
  }

  override handlePointerDown(e: PointerEvent) {
    super.handlePointerDown(e);
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handlePointerEnter(e: PointerEvent) {
    this.ripple.beginHover(e);
  }

  override handlePointerLeave(e: PointerEvent) {
    super.handlePointerLeave(e);
    this.ripple.endHover();
  }

  protected handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleBlur() {
    this.showFocusRing = false;
  }
}
