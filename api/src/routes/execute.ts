import type { FastifyInstance } from 'fastify'
import { prisma } from '../db.js'
import { runAutomation } from '../engine/automation.js'

export default async function executeRoutes(app: FastifyInstance) {
  // POST /workflows/:id/run — manual trigger
  app.post('/:id/run', async (req, reply) => {
    const workflow = await prisma.workflow.findFirst({
      where: { id: req.params.id },
    })

    if (!workflow) return reply.status(404).send({ error: 'Not found' })

    const run = await prisma.workflowRun.create({
      data: {
        workflowId: workflow.id,
        triggeredBy: 'MANUAL',
        status: 'RUNNING',
      },
    })

    // Run async, don't block the response
    runAutomation({
      workflowId: workflow.id,
      runId: run.id,
      definition: workflow.definition as { nodes: unknown[]; edges: unknown[] },
    })
      .then(async (results) => {
        await prisma.workflowRun.update({
          where: { id: run.id },
          data: { status: 'COMPLETED', completedAt: new Date() },
        })
        // Store node results
        for (const [nodeId, output] of Object.entries(results)) {
          await prisma.nodeExecution.create({
            data: {
              workflowRunId: run.id,
              nodeId,
              nodeType: 'unknown',
              output: output as object,
              completedAt: new Date(),
            },
          })
        }
      })
      .catch(async (err) => {
        await prisma.workflowRun.update({
          where: { id: run.id },
          data: { status: 'FAILED', error: err.message, completedAt: new Date() },
        })
      })

    return reply.status(202).send({ runId: run.id, status: 'RUNNING' })
  })

  // GET /workflows/:id/runs — list runs
  app.get('/:id/runs', async (req, reply) => {
    const runs = await prisma.workflowRun.findMany({
      where: { workflowId: req.params.id },
      orderBy: { startedAt: 'desc' },
      take: 20,
      include: { nodeRuns: true },
    })
    return reply.send(runs)
  })
}