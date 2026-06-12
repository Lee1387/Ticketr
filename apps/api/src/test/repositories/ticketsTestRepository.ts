import type { TicketsRepositoryPort } from "../../modules/tickets/service/tickets.service.ports.js";
import { defaultTestTicket } from "../fixtures/tickets.fixture.js";

export const defaultTestTicketsRepository: TicketsRepositoryPort = {
  create: (input) =>
    Promise.resolve({
      ...defaultTestTicket,
      organizationId: input.organizationId,
      subject: input.subject,
      description: input.description,
      priority: input.priority,
    }),
  findByOrganizationIdAndId: ({ id, organizationId }) =>
    Promise.resolve({
      ...defaultTestTicket,
      id,
      organizationId,
    }),
  listByOrganizationId: ({ organizationId }) =>
    Promise.resolve([
      {
        ...defaultTestTicket,
        organizationId,
      },
    ]),
  updateStatusByOrganizationIdAndId: ({ id, organizationId, status }) =>
    Promise.resolve({
      ...defaultTestTicket,
      id,
      organizationId,
      status,
      updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    }),
};
