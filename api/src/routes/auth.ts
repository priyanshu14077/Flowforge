import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import bcrypt from 'bcrypt'

interface SignupBody {
  email: string
  password: string
  name?: string
}

interface LoginBody {
  email: string
  password: string
}

export default async function authRoutes(app: FastifyInstance) {
  app.post<{ Body: SignupBody }>('/signup', async (req: FastifyRequest<{ Body: SignupBody }>, reply: FastifyReply) => {
    const { email, password, name } = req.body

    if (!email || !password) {
      return reply.status(400).send({ error: 'Email and password required' })
    }

    if (password.length < 6) {
      return reply.status(400).send({ error: 'Password must be at least 6 characters' })
    }

    const existing = await app.prisma.user.findUnique({ where: { email } })
    if (existing) {
      return reply.status(409).send({ error: 'User already exists' })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await app.prisma.user.create({
      data: { email, password: hashed, name },
    })

    const token = app.jwt.sign({ userId: user.id, email: user.email })

    return reply.status(201).send({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    })
  })

  app.post<{ Body: LoginBody }>('/login', async (req: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
    const { email, password } = req.body

    const user = await app.prisma.user.findUnique({ where: { email } })
    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return reply.status(401).send({ error: 'Invalid credentials' })
    }

    const token = app.jwt.sign({ userId: user.id, email: user.email })

    return reply.send({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    })
  })
}