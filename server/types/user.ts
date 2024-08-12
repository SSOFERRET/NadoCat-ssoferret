import { Prisma } from "@prisma/client"

export interface IUsers {
  uuid: Buffer
  email: string
  nickname: string
  authType: string
  status: string
}

export interface IUserSecrets {
  uuid: Buffer
  hashPassword: string
  salt: string
}