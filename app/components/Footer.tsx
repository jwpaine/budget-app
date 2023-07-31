import { Link } from "@remix-run/react";

interface HeaderProps {
  userId: string;
}

export default function Footer() {

  return (
    <footer className="mt-auto flex flex-col-reverse md:flex-row content-center items-center bg-gray-950 w-full justify-between p-10 items-start">
        <span className="text-white text-xs">©2023 DollarGrad, LLC. All rights reserved.</span>
      <div>
        <Link to="/privacy" className="text-white hover:underline border-r border-slate-300 px-2">Privacy Policy</Link>
        <Link to="/terms" className="text-white hover:underline px-2">Terms of Service</Link>
      </div>
    
    </footer>
  );
}
