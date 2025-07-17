import { FastifyInstance } from "fastify";

const clientRoutes = (app: FastifyInstance) =>{
    app.get('/client', async (req, res) => {
        return { message: "Client route is working!" };
    });

    app.post('/client', async (req, res) => {
        const data = req.body;
        // Here you would typically handle the data, e.g., save it to a database
        return { message: "Client data received", data };
    });

    app.put('/client/:id', async (req, res) => {
        const { id } = req.params as { id: string };
        const data = req.body;
        // Update logic here
        return { message: `Client ${id} updated`, data };
    });
}