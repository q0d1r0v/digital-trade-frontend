type Fn = (() => void) | null;

let showFn: Fn = null;
let hideFn: Fn = null;

let refCount = 0;

let desiredOpen = false;

function applyStateToRegistered() {
  if (showFn == null || hideFn == null) return;
  if (desiredOpen) {
    showFn();
  } else {
    hideFn();
  }
}

export const Loading = {
  show: () => {
    refCount = Math.max(0, refCount) + 1;
    desiredOpen = true;
    if (showFn) {
      showFn();
    }
  },

  hide: () => {
    refCount = Math.max(0, refCount - 1);
    if (refCount <= 0) {
      refCount = 0;
      desiredOpen = false;
      if (hideFn) {
        hideFn();
      }
    }
  },

  forceHide: () => {
    refCount = 0;
    desiredOpen = false;
    if (hideFn) hideFn();
  },

  _register: (show: () => void, hide: () => void) => {
    showFn = show;
    hideFn = hide;

    applyStateToRegistered();
  },

  _unregister: () => {
    showFn = null;
    hideFn = null;
  },

  _debug: () => ({ refCount, desiredOpen, registered: !!showFn && !!hideFn }),
};
