import { Request, Response } from "express"

const express = require('express')
const router = express.Router()

router.get('/chat', (req: Request, res: Response) => {
  res.send({ response: "I am alive" }).status(200)
})

export default router;