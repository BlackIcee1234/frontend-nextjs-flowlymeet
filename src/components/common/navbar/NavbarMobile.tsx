import Image from "next/image";

const NavbarMobile = () => {

    const logoUrl = "https://cdn.sanity.io/images/t64y86n0/production/d47fc36ca05580f9998c039ac6ed7e1aeacb8d3b-1018x1080.png";

    return (
      <nav className="text-[#7886C7] p-4">
        <div className="flex justify-between items-center">
            <Image src={logoUrl} alt="Logo" className="h-14" width={60} height={100} />
            <button className="text-2xl">☰</button>
        </div>
      </nav>
    );
};
  
export default NavbarMobile;  