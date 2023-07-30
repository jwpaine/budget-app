import { User } from "@prisma/client";
import { prisma } from "~/db.server";

export const Create = async ({ code, userId }: { code: string, userId: User["id"] }) => {
    console.log("creating customer")
    // create subscription column in database:
    try {
        const r = await prisma.referral.create({
            data: {
                userId,
                code,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    } catch (e) {
        console.log(e)
        return { error: e }
    }

}