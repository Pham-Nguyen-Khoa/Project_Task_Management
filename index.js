const express = require('express');
require('dotenv').config();
const database = require("./config/database");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const  cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const router = require("./router/index")

const app = express();
const port = process.env.PORT;

app.use(cors())
app.use(cookieParser())

database.connect();

// Cấu hình Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'Task Management API',
        version: '1.0.0',
        description: 'API quản lý các công việc. Bao gồm các chức năng như thay đổi trạng thái, xóa công việc, v.v.',
        contact: {
            name: 'Support Team',
            url: 'http://localhost',
            email: 'support@example.com',
        },
        },
        servers: [
            { url: `http://localhost:${port}` }, // URL server của bạn
        ],
    },
    apis: ['./index.js','./controller/task.controller.js','./controller/user.controller.js'], // File chứa chú thích API
};

// // Middleware to parse JSON bodies
app.use(express.json());
// app.use(bodyParser.json());

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


router(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
