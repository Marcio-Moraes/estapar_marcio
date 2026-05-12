import { LoginForm } from "@/components/auth/loginForm";

import Image from "next/image";
import logo from "@/assets/ui/estapar_estacionamentos_logo.png";

export default function LoginPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans bg-[#F9FAFB]">
      <div className="max-w-md w-full mx-auto">
        <Image src={logo} alt="Logo" width={200} height={100} className="mx-auto object-contain mb-6" />
        <LoginForm />
      </div>
    </div>
  );
}