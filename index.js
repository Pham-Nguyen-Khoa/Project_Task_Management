const express = require('express');
require('dotenv').config();
const database = require("./config/database");
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const router = require("./router/index")

const app = express();
const port = process.env.PORT;

database.connect();

// Cấu hình Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Management API',
            version: '1.0.0',
            description: 'API quản lý các tasks',
        },
        servers: [
            { url: `http://localhost:${port}` }, // URL server của bạn
        ],
    },
    apis: ['./index.js','./controller/task.controller.js'], // File chứa chú thích API
};

// // Middleware to parse JSON bodies
app.use(express.json());


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


router(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
