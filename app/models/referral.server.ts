import { Prisma, User } from "@prisma/client";
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
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2002') {
              console.log(
                'There is a unique constraint violation'
              )
              return { error: "Code already taken" }
            }
          }
        return { error: "An Unknown error occured. Please try again later" }
    }

}