import {prisma} from "../config/postgresql.js"

const users = await prisma.users.findMany();