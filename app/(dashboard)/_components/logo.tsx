import Image from "next/image";

const Logo = () => (
  <Image 
    src="/next.svg"
    alt='logo'
    width={150}
    height={150}
    className="m-5"
  />
)

export default Logo;