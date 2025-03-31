export interface Order {
  id: string;
  creatorId: string;
  completionTime: Date | null;
  concernedPeople: ConcernedPeople[];
}

export interface ConcernedPeople {
  email: string;
}

export type UserPreference = {
  email: boolean;
  slack: boolean;
  sms: boolean;
  push: boolean;
};

export interface User {
  id: string;
  prefrences: UserPreference;
}

export interface OrderNew {
  userId: string;
  productId: string;
}

export interface NotificationStrategy {
  notify: (order: Order) => Promise<void>;
}

export type Sms = { message: string };

export interface SmsService {
  send: (sms: Sms) => void;
}

export type Slack = { chanel: string; message: string };

export interface SlackService {
  send: (slack: Slack) => void;
}

export type Email = { receiver: string; body: string; subject: string };

export interface EmailService {
  sendEmail: (email: Email) => void;
}

export interface OrderRepository {
  createOrder(orderNew: OrderNew): Promise<Order>;
  getOrder(orderId: string): Promise<Order>;
  updateOrder(order: Order): Promise<Order>;
}

export interface UserRepository {
  getUser(userId: string): Promise<User>;
}

function createNotificationStrategy(user: User): NotificationStrategy | null {
  const emailService = createEmailService();
  const smsService = createSmsService();
  const slackService = createSlackService();

  if (user.prefrences.email === true) {
    return createEmailStrategy(emailService);
  }

  if (user.prefrences.slack === true) {
    return createSlackStrategy(slackService);
  }

  if (user.prefrences.sms === true) {
    return createSlackStrategy(smsService);
  }

  return null;
}

export function createSmsService(): SmsService {
  return {
    send: (sms: Sms) => {
      console.log("Sending SMS:", sms.message);
    },
  };
}

export function createSlackService(): SlackService {
  return {
    send: (slack: Slack) => {
      console.log("Sending SMS:", slack.message);
    },
  };
}

export function createEmailService(): EmailService {
  return {
    sendEmail: (email: Email) => {
      console.log("Sending Email:", email.body);
    },
  };
}

function createSlackStrategy(slackService: SlackService): NotificationStrategy {
  async function sendSlack(order: Order) {
    const slackMessage = {
      chanel: "test",
      message: "test",
    };
    slackService.send(slackMessage);
  }

  return {
    notify: sendSlack,
  };
}

function createEmailStrategy(emailService: EmailService): NotificationStrategy {
  async function notify(order: Order) {
    const email = {
      subject: "test",
      body: "body",
      receiver: "receiver@email.fr",
    };
    emailService.sendEmail(email);
  }

  return {
    notify,
  };
}

function createSmsStrategy(smsService: SmsService): NotificationStrategy {
  async function notify(order: Order) {
    const sms = {
      message: "test",
    };

    smsService.send(sms);
  }

  return {
    notify,
  };
}

function createMultipleStrategy(strategies: NotificationStrategy[]) {
  async function notify(order: Order) {
    for (const startegy of strategies) {
      await startegy.notify(order);
    }
  }

  return {
    notify,
  };
}

export class OrderService {
  constructor(
    private orderRespository: OrderRepository,
    private userRepository: UserRepository
  ) {}

  async createOrder(orderNew: OrderNew) {
    const order = await this.orderRespository.createOrder(orderNew);

    this.notifyOrderCreated(order);
  }

  async completeOrder(orderId: string) {
    const order = await this.orderRespository.getOrder(orderId);

    const updatedOrder = await this.orderRespository.updateOrder({
      id: orderId,
      completionTime: new Date(),
      creatorId: order.creatorId,
      concernedPeople: order.concernedPeople,
    });

    this.notifyOrderCompleted(order);
  }

  async notifyOrderCompleted(order: Order) {
    const user = await this.userRepository.getUser(order.creatorId);

    const notificationStrategy = createNotificationStrategy(user);

    if (notificationStrategy === null) {
      return;
    }

    await notificationStrategy.notify(order);
  }

  async notifyOrderCreated(order: Order) {
    const user = await this.userRepository.getUser(order.creatorId);

    const notificationStrategy = createNotificationStrategy(user);

    if (notificationStrategy === null) {
      return;
    }

    await notificationStrategy.notify(order);
  }
}
