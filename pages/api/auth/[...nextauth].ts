import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from 'lib/prisma';
import EmailProvider from 'next-auth/providers/email';
import nodemailer from 'nodemailer';

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_HOST,
                port: Number(process.env.EMAIL_PORT),
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
                secure: true
            },
            from: process.env.EMAIL_FROM,
            maxAge: 10 * 60
        })
    ],
    callbacks: {
        async session({session}) {
            return session;
        }
    }
})