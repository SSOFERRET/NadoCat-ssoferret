import { Prisma } from "@prisma/client"

export interface IUsers {
  id: number
  uuid: Buffer | string
  email: string
  nickname: string
  authType: string
  status: string
}

export interface IUserSecrets {
  uuid: Buffer
  hashPassword: string
  salt: string
  refreshToken: string | null
}