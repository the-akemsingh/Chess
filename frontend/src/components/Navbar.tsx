import { Link } from "react-router-dom";

const Navbar = () => {
    const pathName = window.location.pathname;

    return (
        <div className="flex p-4 md:p-5 libre-franklin-900 text-xl md:text-2xl justify-between px-4 md:px-10 lg:px-40 z-20 relative gap-4 md:gap-20 text-white">
            <Link to={'/'} className="hover:text-amber-500 transition-colors">Chess</Link>
            <div className="flex gap-4 md:gap-20">
                <Link 
                    to={'/game'} 
                    className={`hover:text-amber-500 transition-colors ${pathName === '/game' ? 'text-amber-500' : ''}`}
                >
                    Play
                </Link>
                <Link 
                    to={'/spectate'} 
                    className={`hover:text-amber-500 transition-colors ${pathName === '/spectate' ? 'text-amber-500' : ''}`}
                >
                    Spectate
                </Link>
            </div>
        </div>
    );
}

export default Navbar;