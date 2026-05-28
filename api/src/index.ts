import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { prisma } from './db.js'
import authRoutes from './routes/auth.js'
import executeRoutes from './routes/execute.js'
import webhookRoutes from './routes/webhook.js'

async function buildApp() {
  const app = Fastify({
    logger: true,
  })

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })

  await app.register(jwt, {
    secret: process.env.JWT_SECRET!,
  })

  app.decorate('prisma', prisma)

  // Health check
  app.get('/health', async () => ({ status: 'ok' }))

  // Auth routes
  await app.register(authRoutes, { prefix: '/auth' })

  await app.register(executeRoutes, { prefix: '/workflows' })
  await app.register(webhookRoutes, { prefix: '/webhook' })

  return app
}

const start = async () => {
  const app = await buildApp()
  try {
    await app.listen({ port: Number(process.env.PORT) || 3001, host: '0.0.0.0' })
    console.log(`API server running on port ${process.env.PORT || 3001}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()