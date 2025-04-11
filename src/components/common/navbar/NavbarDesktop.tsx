import Image from "next/image";
import { Button } from "@/components/ui/button"
import Link from "next/link";

const NavbarDesktop = () => {

    const logoUrl = "https://cdn.sanity.io/images/t64y86n0/production/d47fc36ca05580f9998c039ac6ed7e1aeacb8d3b-1018x1080.png";

    return (
        <nav className="text-[#7886C7] p-2 shadow-sm bg-white border ">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/">
              <Image src={logoUrl} alt="Logo" className="h-20" width={70} height={30} />
            </Link>
            <div className="flex gap-4">
              <Link href="/about">
                <Button variant="link" className="font-bold text-[#7886C7]">
                  Acerca de
                </Button>
              </Link>
              <Link href="/create">
                <Button variant="link" className="font-bold text-[#7886C7]">
                  Probar FlowlyMeet
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button type="submit" variant="outline" className="rounded-full text-[#7886C7] border-[#7886C7] hover:text-[#7886C7] px-8">
                  Regístrate
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button type="submit" className="w-full bg-[#7886C7] hover:bg-[#A9B5DF] rounded-full font-bold px-8">
                  Iniciar sesión
                </Button>
              </Link>
            </div>
          </div>
        </nav>
    );
};
  
export default NavbarDesktop;