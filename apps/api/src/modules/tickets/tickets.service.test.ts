import { describe, expect, it, vi } from "vitest";

import {
  type OrganizationLookup,
  ticketNotFoundMessage,
  ticketOrganizationNotFoundMessage,
  type TicketsRepositoryPort,
  TicketsService,
} from "./tickets.service.js";

describe("TicketsService", () => {
  const organizationId = "6b4df69e-0950-4209-b79a-a5b5d251540f";
  const input = {
    subject: "Cannot access account",
    description: "The customer cannot sign in after resetting their password.",
    priority: "normal" as const,
  };
  const createdTicket = {
    id: "55555555-5555-4555-8555-555555555555",
    organizationId,
    subject: input.subject,
    description: input.description,
    status: "open" as const,
    priority: input.priority,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };

  function createTicketsRepository(
    overrides: Partial<TicketsRepositoryPort> = {},
  ): TicketsRepositoryPort {
    return {
      create: vi.fn(() => Promise.resolve(createdTicket)),
      findByOrganizationIdAndId: vi.fn(() => Promise.resolve(null)),
      listByOrganizationId: vi.fn(() => Promise.resolve([])),
      ...overrides,
    };
  }

  it("creates a ticket for an existing organization", async () => {
    const organizationLookup: OrganizationLookup = {
      findById: (id) => Promise.resolve({ id }),
    };
    const ticketsRepository = createTicketsRepository();
    const service = new TicketsService(organizationLookup, ticketsRepository);

    const result = await service.createTicket({
      organizationId,
      input,
    });

    expect(result).toEqual({
      status: "created",
      ticket: createdTicket,
    });
    expect(ticketsRepository.create).toHaveBeenCalledWith({
      organizationId,
      subject: input.subject,
      description: input.description,
      priority: input.priority,
    });
  });

  it("reports a missing organization before attempting ticket creation", async () => {
    const organizationLookup: OrganizationLookup = {
      findById: () => Promise.resolve(null),
    };
    const ticketsRepository = createTicketsRepository();
    const service = new TicketsService(organizationLookup, ticketsRepository);

    const result = await service.createTicket({
      organizationId,
      input,
    });

    expect(result).toEqual({
      status: "not-found",
      message: ticketOrganizationNotFoundMessage,
    });
    expect(ticketsRepository.create).not.toHaveBeenCalled();
  });

  it("returns a ticket scoped to an organization", async () => {
    const organizationLookup: OrganizationLookup = {
      findById: (id) => Promise.resolve({ id }),
    };
    const ticketsRepository = createTicketsRepository({
      findByOrganizationIdAndId: vi.fn(() => Promise.resolve(createdTicket)),
    });
    const service = new TicketsService(organizationLookup, ticketsRepository);

    const result = await service.getTicket({
      organizationId,
      ticketId: createdTicket.id,
    });

    expect(result).toEqual({
      status: "found",
      ticket: createdTicket,
    });
    expect(ticketsRepository.findByOrganizationIdAndId).toHaveBeenCalledWith({
      id: createdTicket.id,
      organizationId,
    });
  });

  it("reports a missing ticket", async () => {
    const organizationLookup: OrganizationLookup = {
      findById: (id) => Promise.resolve({ id }),
    };
    const ticketsRepository = createTicketsRepository();
    const service = new TicketsService(organizationLookup, ticketsRepository);

    const result = await service.getTicket({
      organizationId,
      ticketId: createdTicket.id,
    });

    expect(result).toEqual({
      status: "not-found",
      message: ticketNotFoundMessage,
    });
  });

  it("lists tickets for an existing organization", async () => {
    const organizationLookup: OrganizationLookup = {
      findById: (id) => Promise.resolve({ id }),
    };
    const createdBefore = new Date("2026-01-02T00:00:00.000Z");
    const ticketsRepository = createTicketsRepository({
      listByOrganizationId: vi.fn(() => Promise.resolve([createdTicket])),
    });
    const service = new TicketsService(organizationLookup, ticketsRepository);

    const result = await service.listTickets({
      organizationId,
      query: {
        limit: 10,
        createdBefore,
      },
    });

    expect(result).toEqual({
      status: "found",
      tickets: [createdTicket],
    });
    expect(ticketsRepository.listByOrganizationId).toHaveBeenCalledWith({
      organizationId,
      limit: 10,
      createdBefore,
    });
  });

  it("reports a missing organization before listing tickets", async () => {
    const organizationLookup: OrganizationLookup = {
      findById: () => Promise.resolve(null),
    };
    const ticketsRepository = createTicketsRepository({
      listByOrganizationId: vi.fn(() => Promise.resolve([createdTicket])),
    });
    const service = new TicketsService(organizationLookup, ticketsRepository);

    const result = await service.listTickets({
      organizationId,
      query: {
        limit: 10,
      },
    });

    expect(result).toEqual({
      status: "not-found",
      message: ticketOrganizationNotFoundMessage,
    });
    expect(ticketsRepository.listByOrganizationId).not.toHaveBeenCalled();
  });
});
