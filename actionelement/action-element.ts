/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ActionController, ActionControllerHost, PressBeginDetail, PressBeginEvent, PressEndDetail, PressEndEvent} from '@material/web/controller/action-controller';
import {LitElement} from 'lit';

export {PressBeginEvent, PressEndEvent};

/**
 * @soyCompatible
 *
 * ActionElement is a base class that provides a handy starting point for using
 * ActionController. Subclasses should add the event handlers on the interactive
 * node in the template, and override `beginPress` and `endPress` to handle
 * pressed state, ripple interaction, and any other "press" interaction.
 */
export abstract class ActionElement extends LitElement implements
    ActionControllerHost {
  /**
   * ActionController needs to know if the component is disabled, so subclasses
   * must implement a `disabled` property.
   */
  abstract disabled: boolean;

  protected actionController = new ActionController(this);

  /**
   * Hook method called when we've confirmed that the gesture is intended to be
   * a press. Subclasses should change the visual state of the control to
   * 'active' at this point, and possibly fire an event. Subclasses should
   * override this method if more needs to be done.
   *
   * @param detail `positionEvent` is the Event that is considered the
   * beginning of the press. Null if this was a keyboard interaction.
   */
  beginPress(detail: PressBeginDetail) {
    // CustomEvent needs to be called directly with a string in order to be
    // converted later.
    this.dispatchEvent(new CustomEvent('pressbegin', {detail}));
  }

  /**
   * Hook method called when the control goes from a pressed to unpressed
   * state.
   *
   * @param detail If `cancelled` is true, means the user canceled the action.
   *    Subclasses which trigger events on endPress() should check the value
   *    of this flag, and modify their behavior accordingly.
   */
  endPress(detail: PressEndDetail) {
    this.dispatchEvent(new CustomEvent('pressend', {detail}));
  }

  /**
   * Hook method for the ActionController.
   * Subclasses should add this method as an event handler on the interactive
   * template element with `@pointerdown="${this.handlePointerDown}"`
   */
  handlePointerDown(e: PointerEvent) {
    this.actionController.pointerDown(e);
  }

  /**
   * Hook method for the ActionController.
   * Subclasses should add this method as an event handler on the interactive
   * template element with `@pointerup="${this.handlePointerUp}"`
   */
  handlePointerUp(e: PointerEvent) {
    this.actionController.pointerUp(e);
  }

  /**
   * Hook method for the ActionController.
   * Subclasses should add this method as an event handler on the interactive
   * template element with `@pointercancel="${this.handlePointerCancel}"`
   */
  handlePointerCancel(e: PointerEvent) {
    this.actionController.pointerCancel(e);
  }

  /**
   * Hook method for the ActionController.
   * Subclasses should add this method as an event handler on the interactive
   * template element with `@pointerleave="${this.handlePointerleave}"`
   */
  handlePointerLeave(e: PointerEvent) {
    this.actionController.pointerLeave(e);
  }

  /**
   * Hook method for the ActionController.
   * Subclasses should add this method as an event handler on the interactive
   * template element with `@click="${this.handleClick}"`
   */
  handleClick(e: MouseEvent) {
    this.actionController.click(e);
  }

  /**
   * Hook method for the ActionController.
   * Subclasses should add this method as an event handler on the interactive
   * template element with `@contextmenu="${this.handleContextMenu}"`
   */
  handleContextMenu() {
    this.actionController.contextMenu();
  }
}
