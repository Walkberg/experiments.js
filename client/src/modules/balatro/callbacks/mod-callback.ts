export interface Subscriber {
  priority: number;
  callbackFunction: () => void;
}

export interface Notifier {
  addSubscriber: (priority: number, callbackFunction: () => void) => void;
  removeSubscriber: (callbackFunction: () => void) => void;
  notify: () => void;
}

export abstract class CustomCallback implements Notifier {
  private subscriptions: Subscriber[] = [];

  addSubscriber(priority: number, callbackFunction: () => void) {
    const subscriber: Subscriber = {
      priority: priority,
      callbackFunction: callbackFunction,
    };

    this.subscriptions.push(subscriber);

    this.subscriptions = sortByPriority(this.subscriptions);
  }

  removeSubscriber(callbackFunction: () => void) {
    const subscriptionIndexMatchingCallback = this.subscriptions.findIndex(
      (subscription) => {
        const subscriptionCallback = subscription.callbackFunction;
        return callbackFunction === subscriptionCallback;
      }
    );
    if (subscriptionIndexMatchingCallback !== -1) {
      this.subscriptions.splice(subscriptionIndexMatchingCallback, 1);
    }
  }

  notify() {
    for (const subscriber of this.subscriptions) {
      const { callbackFunction } = subscriber;
      if (this.shouldNotify()) {
        callbackFunction();
      }
    }
  }

  protected shouldNotify(): boolean {
    return true;
  }
}

function sortByPriority(subscriber: Subscriber[]) {
  return subscriber.sort((a, b) => a.priority - b.priority);
}
