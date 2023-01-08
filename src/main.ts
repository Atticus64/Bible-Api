import { Hono } from "hono"
import { serve } from "server"


const app = new Hono()

app.get('/', (c) => c.text('Hola Bible Api'))




if (import.meta.main) {
    serve(app.fetch)
}

