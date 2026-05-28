import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '../db.js'
import type { WorkflowDefinition } from '../types/workflow.js'

const WorkflowSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  definition: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
  }),
})

export default async function workflowRoutes(app: FastifyInstance) {
  // GET /workflows — list all for user
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify()
    } catch {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const userId = (req.user as { userId: string }).userId
    const workflows = await prisma.workflow.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        webhookPath: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { runs: true } },
      },
    })
    return reply.send(workflows)
  })

  // POST /workflows — create
  app.post('/', async (req: FastifyRequest<{ Body: z.infer<typeof WorkflowSchema> }>, reply: FastifyReply) => {
    try {
      await req.jwtVerify()
    } catch {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const data = WorkflowSchema.parse(req.body)
    const userId = (req.user as { userId: string }).userId

    const workflow = await prisma.workflow.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        definition: data.definition as WorkflowDefinition,
      },
    })

    return reply.status(201).send(workflow)
  })

  // GET /workflows/:id — get one
  app.get('/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      await req.jwtVerify()
    } catch {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const userId = (req.user as { userId: string }).userId
    const workflow = await prisma.workflow.findFirst({
      where: { id: req.params.id, userId },
    })

    if (!workflow) return reply.status(404).send({ error: 'Not found' })
    return reply.send(workflow)
  })

  // PUT /workflows/:id — update
  app.put('/:id', async (req: FastifyRequest<{ Params: { id: string }; Body: z.infer<typeof WorkflowSchema> }>, reply: FastifyReply) => {
    try {
      await req.jwtVerify()
    } catch {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const data = WorkflowSchema.parse(req.body)
    const userId = (req.user as { userId: string }).userId

    const existing = await prisma.workflow.findFirst({ where: { id: req.params.id, userId } })
    if (!existing) return reply.status(404).send({ error: 'Not found' })

    const updated = await prisma.workflow.update({
      where: { id: req.params.id },
      data: {
        name: data.name,
        description: data.description,
        definition: data.definition as WorkflowDefinition,
      },
    })

    return reply.send(updated)
  })

  // DELETE /workflows/:id
  app.delete('/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      await req.jwtVerify()
    } catch {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const userId = (req.user as { userId: string }).userId
    const existing = await prisma.workflow.findFirst({ where: { id: req.params.id, userId } })
    if (!existing) return reply.status(404).send({ error: 'Not found' })

    await prisma.workflow.delete({ where: { id: req.params.id } })
    return reply.status(204).send()
  })
}