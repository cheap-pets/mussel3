.mu-button {
  --mu-button_height: 32px;
  --mu-button_padding: 0 10px;

  --mu-button_font-size: var(--mu-common-font-size);

  --mu-button_small-height: 24px;
  --mu-button_small-padding: 0 8px;

  --mu-button_border-width: 1px;
  --mu-button_border-radius: 4px;
  --mu-button_round-border-radius: calc(var(--mu-button_height) / 2);

  --mu-button_color: var(--mu-gray-7);
  --mu-button_bg: var(--mu-background-normal);
  --mu-button_border-color: var(--mu-border-color);

  --mu-button_focus-box-shadow-color: var(--mu-primary-color);
  --mu-button_focus-box-shadow: 0 0 0 2px var(--mu-button_focus-box-shadow-color);

  --mu-button_hover-color: var(--mu-gray-6);
  --mu-button_hover-bg: var(--mu-background-normal);
  --mu-button_hover-border-color: var(--mu-border-color);
  
  --mu-button_active-color: var(--mu-gray-7);
  --mu-button_active-bg: var(--mu-background-normal);
  --mu-button_active-border-color: var(--mu-border-color);
}

.mu-button {
  cursor: pointer;
  user-select: none;

  overflow: hidden;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;

  min-width: var(--mu-button_height);
  height: var(--mu-button_height);
  padding: var(--mu-button_padding);

  font-family: inherit;
  font-size: var(--mu-button_font-size);
  line-height: var(--mu-common-line-height);
  color: var(--mu-button_color);
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;

  background: var(--mu-button_bg);
  border: var(--mu-button_border-width) solid var(--mu-button_border-color);
  border-radius: var(--mu-button_border-radius);
  outline: none;
}

.mu-button-group {
  position: relative;
  
  display: flex;
  align-items: center;
  justify-content: center;

  background: var(--mu-button_bg);
  border-radius: var(--mu-button_border-radius);

  & > .mu-button {
    flex: 1 1 0;
    margin-left: -1px;

    &:first-child {
      margin-left: 0;
    }

    &:not(:first-of-type) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    &:not(:last-of-type) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  &[round] {
    border-radius: var(--mu-button_round-border-radius);

    & > .mu-button:first-of-type {
      border-top-left-radius: var(--mu-button_round-border-radius);
      border-bottom-left-radius: var(--mu-button_round-border-radius);
    }

    & > .mu-button:last-of-type {
      border-top-right-radius: var(--mu-button_round-border-radius);
      border-bottom-right-radius: var(--mu-button_round-border-radius);
    }
  }
}

.mu-button {
  &[button-style="text"] {
    border-color: transparent;
  }

  &[button-style="text"],
  &[button-style="outline"] {
    &, &:hover {
      background: transparent;
    }
  }

  &[active] {
    z-index: 1;
    color: var(--mu-button_active-color);
    border-color: var(--mu-button_active-border-color);
  }
}

.mu-button {
  &:hover {
    z-index: 2;
    color: var(--mu-button_hover-color);
    border-color: var(--mu-button_hover-border-color);
  }

  &:focus {
    z-index: 3;
    box-shadow: var(--mu-button_focus-box-shadow);
  }

  &[round] {
    border-radius: var(--mu-button_round-border-radius);
  }
}

.mu-button-group > .mu-button {
  &[active] {
    z-index: 1;
    color: var(--mu-text-color-reversed);
    background: var(--mu-primary-color-dark);
    border-color: var(--mu-primary-color-dark);

    &:hover {
      background: var(--mu-primary-color-light);
      border-color: var(--mu-primary-color-light);
    }
  }
}

.mu-button-group[disabled] > .mu-button,
.mu-button[disabled] {
  pointer-events: none;
  cursor: default;

  z-index: 1;

  color: var(--mu-text-color-weak) !important;

  background: var(--mu-background-disabled) !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

.mu-button[button-style="link"] {
  padding-right: 0;
  padding-left: 0;

  background: transparent !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

.mu-button-group[small] > .mu-button,
.mu-button[small] {
  min-width: var(--mu-button_small-height);
  height: var(--mu-button_small-height);
  padding: var(--mu-button_small-padding);
}

.mu-button.mu-icon-button {
  flex: none !important;
  padding: 0 !important;
}
