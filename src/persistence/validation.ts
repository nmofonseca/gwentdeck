import { z } from 'zod'

// Schema validation must work under a CSP that does not permit unsafe-eval.
z.config({ jitless: true })

export { z }
