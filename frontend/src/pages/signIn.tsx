import { SignIn } from "@clerk/clerk-react";

export default function SignInPage(){
    return <div className=" flex justify-center min-h-screen">
        <div className="flex flex-col justify-center">
        <SignIn />
        </div>
    </div>
}