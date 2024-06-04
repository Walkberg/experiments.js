export interface SignatureRepository {
  findById(id: string): Promise<Signature | null>;

  save(signature: Signature): Promise<void>;
}

export class InMemorySignatureRepository implements SignatureRepository {
  signatures = new Map<string, Signature>();

  async findById(id: string): Promise<Signature | null> {
    return this.signatures.get(id) || null;
  }

  async save(signature: Signature): Promise<void> {
    this.signatures.set(signature.id, signature);
  }
}

export abstract class AgregateRoot {
  events: DomainEvent[] = [];

  addEvent(event: DomainEvent) {
    this.events.push(event);
  }

  clearEvents() {
    this.events = [];
  }

  getEvents(): DomainEvent[] {
    return this.events;
  }
}

export class DomainEvent {
  constructor(public readonly id: string) {}
}

export class Entity {
  constructor(public readonly id: string) {}
}

export class SignatureCreated extends DomainEvent {
  constructor(public readonly signature: Signature) {
    super(signature.id);
  }
}

export class SignatureCanceled extends DomainEvent {
  constructor(public readonly signature: Signature) {
    super(signature.id);
  }
}

export class SignatureActivated extends DomainEvent {
  constructor(public readonly signature: Signature) {
    super(signature.id);
  }
}

export type SignatureType = "electronic" | "paper" | "uncertified";

export interface SignatureNew {
  type: SignatureType;
}

export class SignatureNotFoundError extends Error {
  constructor(id: string) {
    super(`Signature with id ${id} not found`);
  }
}

export class SignatureNotReadyForActivation extends Error {
  constructor(id: string) {
    super(`Signature with id ${id} not found`);
  }
}

export class SignatureAlreadySigned extends Error {
  constructor(id: string) {
    super(`Signature with id ${id} not found`);
  }
}

export class OrganizationMissingCredit extends Error {
  constructor(organizationId: string) {
    super(`Organization id ${organizationId} has not enouth credit`);
  }
}

export interface SignatoryNew {
  name: string;
  email: string;
}

export class Signatory extends Entity {
  name: string;
  email: string;
  signatureTime: Date | null = null;

  constructor(signatoryNew: SignatoryNew) {
    super("");
    this.name = signatoryNew.name;
    this.email = signatoryNew.email;
  }

  hasSign() {
    if (this.signatureTime == null) {
      return false;
    }

    return true;
  }

  sign() {
    this.signatureTime = new Date();
  }
}

export interface SignatureFollowerNew {
  email: string;
}

export class SignatureFollower extends Entity {
  email: string;

  constructor(signatoryNew: SignatureFollowerNew) {
    super("");
    this.email = signatoryNew.email;
  }
}

type SignatureAssociation = ContractAssociation | OrganizationAssociation;

export class ContractAssociation extends Entity {
  type = "contract";
  contractId: string;

  constructor() {
    super("");
    this.contractId = "signatoryNew.email";
  }
}

export class OrganizationAssociation extends Entity {
  type = "organization";

  constructor() {
    super("");
  }
}

export class Signature extends AgregateRoot {
  id: string = "";
  type: SignatureType;
  signatories: Signatory[] = [];
  followers: SignatureFollower[] = [];

  organizationId: string;

  signatureTime: Date | null = null;
  activationTime: Date | null = null;
  cancelationTime: Date | null = null;

  creditConsumer;

  private constructor(signatureNew: SignatureNew) {
    super();
    this.type = signatureNew.type;
    this.signatories = [];
    this.organizationId = "organization_1";

    this.creditConsumer = new CreditConsumer(this);
  }

  static create(signatureNew: SignatureNew): Signature {
    return new Signature(signatureNew);
  }

  isReadyForActivation(): boolean {
    return this.signatories.length > 0;
  }

  canBeCancelled(): boolean {
    return false;
  }

  activate() {
    this.activationTime = new Date();
    this.addEvent(new SignatureActivated(this));
  }

  cancel() {
    this.cancelationTime = new Date();
    this.addEvent(new SignatureCanceled(this));
  }

  getSignatureCreditCost(): number {
    return this.creditConsumer.getCreditCost();
  }

  getRefundableCreditCount(): number {
    return this.creditConsumer.getRefundableCreditCount();
  }

  addSignatory(signatory: Signatory) {
    this.signatories.push(signatory);
  }

  isSignedBy(signatoryId: string): boolean {
    const signatory = this.getSignatory(signatoryId);

    if (signatory == null) {
      return false;
    }

    return signatory.hasSign();
  }

  getSignatory(signatoryId: string): Signatory | null {
    return (
      this.signatories.find((signatory) => signatory.id === signatoryId) ?? null
    );
  }

  removeSignatory(signatoryId: string) {
    this.signatories = this.signatories.filter(
      (signatory) => signatory.id !== signatoryId
    );
  }

  addFollower(follower: Signatory) {
    this.followers.push(follower);
  }

  removeFollower(followerId: string) {
    this.followers = this.followers.filter(
      (follower) => follower.id !== followerId
    );
  }
}

export class CreditConsumer {
  signature: Signature;

  constructor(signature: Signature) {
    this.signature = signature;
  }

  getCreditCost() {
    switch (this.signature.type) {
      case "electronic":
        return this.signature.signatories.length;
      case "paper":
        return 0;
      case "uncertified":
        return 0;
    }
  }

  getRefundableCreditCount(): number {
    switch (this.signature.type) {
      case "electronic":
        return this.signature.signatories.filter(
          (signatory) => signatory.signatureTime == null
        ).length;
      case "paper":
        return 0;
      case "uncertified":
        return 0;
    }
  }
}
