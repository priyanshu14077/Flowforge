import type { FastifyInstance } from 'fastify'
import { prisma } from '../db.js'
import { runAutomation } from '../engine/automation.js'

export default async function webhookRoutes(app: FastifyInstance) {
  // POST /webhook/:workflowPath — trigger workflow via webhook
  app.post('/:workflowPath', async (req, reply) => {
    const workflow = await prisma.workflow.findUnique({
      where: { webhookPath: req.params.workflowPath },
    })

    if (!workflow || !workflow.isActive) {
      return reply.status(404).send({ error: 'Workflow not found or inactive' })
    }

    const run = await prisma.workflowRun.create({
      data: {
        workflowId: workflow.id,
        triggeredBy: 'WEBHOOK',
        status: 'RUNNING',
      },
    })

    runAutomation({
      workflowId: workflow.id,
      runId: run.id,
      definition: workflow.definition as { nodes: unknown[]; edges: unknown[] },
    })
      .then(async () => {
        await prisma.workflowRun.update({
          where: { id: run.id },
          data: { status: 'COMPLETED', completedAt: new Date() },
        })
      })
      .catch(async (err) => {
        await prisma.workflowRun.update({
          where: { id: run.id },
          data: { status: 'FAILED', error: err.message, completedAt: new Date() },
        })
      })

    return reply.status(202).send({ runId: run.id, status: 'ACCEPTED' })
  })
}