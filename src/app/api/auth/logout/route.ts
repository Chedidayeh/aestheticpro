import { signOut } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export async function GET() {
        await signOut({
            redirectTo: "/auth/sign-in",
        })
}