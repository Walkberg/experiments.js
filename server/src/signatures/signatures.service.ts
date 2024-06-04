import { Domain } from "domain";
import {
  DomainEvent,
  OrganizationMissingCredit,
  Signature,
  SignatureAlreadySigned,
  SignatureNew,
  SignatureNotFoundError,
  SignatureNotReadyForActivation,
  SignatureRepository,
} from "./signatures";

export class SignaturesService {
  constructor(
    private signatureRepository: SignatureRepository,
    private creditService: CreditService
  ) {}

  async createSignature(signatureNew: SignatureNew): Promise<Signature> {
    const newSignature = Signature.create(signatureNew);

    this.signatureRepository.save(newSignature);

    return newSignature;
  }

  async signatorySigns(
    providerId: string,
    signatoryId: string
  ): Promise<Signature> {
    const signature = await this.signatureRepository.findById(providerId);

    if (signature === null) {
      throw new SignatureNotFoundError(providerId);
    }

    const signatory = signature.getSignatory(signatoryId);

    if (signatory === null) {
      throw new Error();
    }

    if (signatory?.hasSign()) {
      throw new Error();
    }

    signatory.sign();

    this.save(signature);

    return signature;
  }

  async activateSignature(signatureId: string): Promise<Signature> {
    const signature = await this.signatureRepository.findById(signatureId);

    if (signature === null) {
      throw new SignatureNotFoundError(signatureId);
    }

    if (!signature.isReadyForActivation()) {
      throw new SignatureNotReadyForActivation(signatureId);
    }

    const credit = await this.creditService.getOrganizationCredit(
      signature.organizationId
    );

    if (signature.getSignatureCreditCost() > credit.count) {
      throw new OrganizationMissingCredit("Not enough credit");
    }

    signature.activate();

    if (signature.getSignatureCreditCost() > 0) {
      await this.creditService.spendOrganizationCredit(
        signature.organizationId,
        signature.getSignatureCreditCost()
      );
    }

    await this.save(signature);

    return signature;
  }

  async cancelSignature(signatureId: string): Promise<Signature> {
    const signature = await this.signatureRepository.findById(signatureId);

    if (signature === null) {
      throw new SignatureNotFoundError(signatureId);
    }

    if (!signature.canBeCancelled()) {
      throw new SignatureAlreadySigned(signatureId);
    }

    signature.cancel();

    if (signature.getRefundableCreditCount() > 0) {
      await this.creditService.refundOrganizationCredit(
        signature.organizationId,
        signature.getRefundableCreditCount()
      );
    }

    await this.save(signature);

    return signature;
  }

  private async save(signature: Signature) {
    await this.signatureRepository.save(signature);
    await this.publishEvents(signature);
  }

  private async publishEvents(signature: Signature) {
    const events = signature.getEvents();

    Promise.all(
      events.map(async (event) => {
        await this.publishEvent(event);
      })
    );
  }

  private async publishEvent(domainEvent: DomainEvent) {
    /// todo: do something later
  }
}

export class CreditService {
  constructor(private creditsRepository: CreditRepository) {}

  async getOrganizationCredit(organizationId: string): Promise<Credit> {
    return this.creditsRepository.findOrganizationCredit(organizationId);
  }

  async refundOrganizationCredit(
    organizationId: string,
    count: number
  ): Promise<void> {
    const credit = await this.creditsRepository.findOrganizationCredit(
      organizationId
    );

    // do domething
  }

  async spendOrganizationCredit(
    organizationId: string,
    count: number
  ): Promise<void> {
    const credit = await this.creditsRepository.findOrganizationCredit(
      organizationId
    );

    // do domething
  }
}

interface CreditRepository {
  findOrganizationCredit(organizationId: string): Promise<Credit>;
}

interface Credit {
  organizationId: string;
  count: number;
}
