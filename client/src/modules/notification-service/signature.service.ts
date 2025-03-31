import {
  createEmailService,
  EmailService,
  User,
  UserRepository,
} from "./notification.service";

export interface Signature {
  id: string;
  creatorId: string;
  status: "pending" | "signed";
  signatories: Signatory[];
  sharePeoples: SharePeople[];
}

export interface Signatory {
  name: string;
  email: string;
  phone: string;
}

export interface SharePeople {
  email: string;
}

interface SignatureRepository {
  getSignature: (signatureId: string) => Promise<Signature>;
  updateSignature: (signature: Signature) => Promise<Signature>;
}

interface ISignatureService {
  sendSignature: (signatureId: string) => Promise<void>;
}

export class SignatureService implements ISignatureService {
  private publisher: Publisher;

  constructor(
    private signatureRepository: SignatureRepository,
    private userRepository: UserRepository
  ) {
    this.publisher = new SignatureNotificationPublisher();

    this.publisher.subscribe(new EmailSubscriber());
    this.publisher.subscribe(new PushSubscriber());
  }

  async sendSignature(signatureId: string): Promise<void> {
    const signature = await this.signatureRepository.getSignature(signatureId);

    if (signature.status === "signed") {
      return;
    }

    const signatureSended = await this.signatureRepository.updateSignature(
      signature
    );

    await this.publisher.notifyAll({
      type: "signature-sended",
      payload: signatureSended,
    });
  }
}

function createSignatureSendedNotificationStrategy(
  userRepository: UserRepository
): NotificationStrategy | null {
  const strategies: NotificationStrategy[] = [];

  const emailService = createEmailService();

  const notifyReceiver = createNotifySignatoriesStrategy(emailService);
  strategies.push(notifyReceiver);

  const notifyCreator = createNotifyCreatorStrategy(userRepository);
  strategies.push(notifyCreator);

  const notifySharePeoples = createNotifySharePeopleStrategy(emailService);
  strategies.push(notifySharePeoples);

  return createMultipleStrategy(strategies);
}

function createMultipleStrategy(
  strategies: NotificationStrategy[]
): NotificationStrategy {
  async function notify(signature: Signature) {
    for (const strategy of strategies) {
      await strategy.notify(signature);
    }
  }
  return {
    notify,
  };
}

function createNotifySignatoriesStrategy(
  emailService: EmailService
): NotificationStrategy {
  async function notify(signature: Signature) {
    signature.signatories.forEach((signatory) => {
      const email = {
        subject: "test",
        body: "body",
        receiver: signatory.email,
      };
      emailService.sendEmail(email);
    });
  }

  return {
    notify,
  };
}

function createNotifySharePeopleStrategy(
  emailService: EmailService
): NotificationStrategy {
  async function notify(signature: Signature) {
    signature.sharePeoples.forEach((signatory) => {
      const email = {
        subject: "test",
        body: "body",
        receiver: signatory.email,
      };
      emailService.sendEmail(email);
    });
  }

  return {
    notify,
  };
}

function createNotifyCreatorStrategy(
  userRepository: UserRepository
): NotificationStrategy {
  async function notify(signature: Signature) {
    const user = await userRepository.getUser(signature.creatorId);

    const startegy = createSignatureStrategy(user);

    if (startegy === null) {
      return;
    }
    startegy.notify(signature);
  }

  return {
    notify,
  };
}

function createSignatureStrategy(user: User): NotificationStrategy | null {
  if (user.prefrences.email) {
    return createEmailStrategy();
  }

  if (user.prefrences.push) {
    return createPushStrategy();
  }

  return null;
}

function createEmailStrategy(): NotificationStrategy {
  return {
    notify: async (signature: Signature) => {
      console.log("Sending Email:", signature.signatories);
    },
  };
}

function createPushStrategy(): NotificationStrategy {
  return {
    notify: async (signature: Signature) => {
      console.log("Sending psuh:", signature.signatories);
    },
  };
}

export interface NotificationStrategy {
  notify: (signature: Signature) => Promise<void>;
}

export class SignatureNotificationPublisher implements Publisher {
  private subscribers: Subscriber[] = [];

  subscribe(subscriber: Subscriber): void {
    if (!this.subscribers.includes(subscriber)) {
      this.subscribers.push(subscriber);
    }
  }

  unsubscribe(subscriber: Subscriber): void {
    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }

  async notifyAll(event: NotificationEvent): Promise<void> {
    for (const subscriber of this.subscribers) {
      await subscriber.notify(event);
    }
  }
}

export class PushSubscriber implements Subscriber {
  async notify(event: NotificationEvent): Promise<void> {
    if (event.type === "signature-sended") {
      console.log(`Sending push notification to creator: ${event.payload}`);
    }
  }
}

export class EmailSubscriber implements Subscriber {
  async notify(event: NotificationEvent): Promise<void> {
    if (event.type === "signature-sended") {
      console.log(`Sending push notification to creator: ${event.payload}`);
    }
  }
}

export interface Publisher {
  subscribe(subscriber: Subscriber): void;

  unsubscribe(subscriber: Subscriber): void;

  notifyAll(event: NotificationEvent): Promise<void>;
}

export interface Subscriber {
  notify(event: NotificationEvent): Promise<void>;
}

export interface NotificationEvent {
  type: "signature-sended";
  payload: Signature;
}
