// @ts-ignore
import { useEffect } from 'react';
// @ts-ignore
import { BackHandler, NativeEventSubscription } from 'react-native';

type IParams = {
  enabled?: boolean;
  callback: () => any;
};

let keyboardDismissHandlers: Array<() => any> = [];

export const keyboardDismissHandlerManager = {
  push: (handler: () => any) => {
    keyboardDismissHandlers.push(handler);
    return () => {
      keyboardDismissHandlers = keyboardDismissHandlers.filter(
        (h) => h !== handler
      );
    };
  },
  length: () => keyboardDismissHandlers.length,
  pop: () => {
    return keyboardDismissHandlers.pop();
  },
};

/**
 * Handles attaching callback for Escape key listener on web and Back button listener on Android
 */
export const useKeyboardDismissable = ({ enabled = true, callback }: IParams) => {
  useEffect(() => {
    let cleanupFn: () => void = () => {};
    if (enabled) {
      cleanupFn = keyboardDismissHandlerManager.push(callback);
    } else {
      cleanupFn();
    }
    return () => {
      cleanupFn();
    };
  }, [enabled, callback]);

  useBackHandler({ enabled, callback });
};

export function useBackHandler({ enabled = true, callback }: IParams) {
  useEffect(() => {
    let handlerRef: NativeEventSubscription | null = null;
    const backHandler = () => {
      callback();
      return true;
    };
    if (enabled) {
      handlerRef = BackHandler.addEventListener('hardwareBackPress', backHandler);
    }
    return () => {
      if (handlerRef) {
        handlerRef.remove();
      }
    };
  }, [enabled, callback]);
}
