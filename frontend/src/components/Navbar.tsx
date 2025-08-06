import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const pathName = window.location.pathname;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Animation variants for the navbar
    const navbarVariants = {
        hidden: { y: -100, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.1
            }
        }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={navbarVariants}
            className="flex fixed backdrop-blur-sm border m-2 mx-auto rounded-full sm:rounded-4xl top-0 left-0 right-0 p-2 sm:p-3 md:p-4 cal-sans-regular justify-between w-[calc(100%-16px)] sm:w-[90%] md:w-[85%] lg:w-[80%] max-w-5xl z-50"
        >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to={'/'} className="transition-colors text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl pl-1 sm:pl-2 md:pl-4" style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.3)" }}>CHESS</Link>
            </motion.div>
            
            {/* Hamburger menu for mobile */}
            <motion.div 
                className="md:hidden flex items-center pr-1 sm:pr-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <motion.button 
                    onClick={toggleMenu} 
                    className="text-black focus:outline-none"
                    aria-label="Toggle menu"
                    whileTap={{ scale: 0.9 }}
                >
                    <svg 
                        className="w-5 h-5 text-white sm:w-6 sm:h-6" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {isMenuOpen ? (
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M6 18L18 6M6 6l12 12" 
                            />
                        ) : (
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M4 6h16M4 12h16M4 18h16" 
                            />
                        )}
                    </svg>
                </motion.button>
            </motion.div>
            
            {/* Desktop navigation */}
            <motion.div 
                className="hidden md:flex gap-3 md:gap-8 lg:gap-14 pr-1 md:pr-2 lg:pr-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, staggerChildren: 0.2 }}
            >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        to={'/game'}
                        style={
                            pathName === '/game'
                                ? undefined
                                : { textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }
                        }
                        className={`text-xl text-white sm:text-2xl md:text-3xl lg:text-4xl transition-colors ${pathName === '/game' ? 'text-amber-500' : ''}`}
                    >
                        Play
                    </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        to={'/spectate'}
                        style={
                            pathName === '/spectate'
                                ? undefined
                                : { textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }
                        } className={`text-xl text-white sm:text-2xl md:text-3xl lg:text-4xl transition-colors ${pathName === '/spectate' ? 'text-amber-500' : ''}`}
                    >
                        Spectate
                    </Link>
                </motion.div>
            </motion.div>
            
            {/* Mobile navigation - shows when hamburger is clicked */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        className="absolute top-full left-0 right-0 mt-1 sm:mt-2 mx-1 sm:mx-2 p-3 sm:p-4 backdrop-blur-sm border rounded-xl sm:rounded-2xl flex flex-col gap-2 sm:gap-4 md:hidden z-50 shadow-lg"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to={'/game'}
                                onClick={toggleMenu}
                                style={
                                    pathName === '/game'
                                        ? undefined
                                        : { textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }
                                }
                                className={`text-lg text-white sm:text-xl transition-colors text-center ${pathName === '/game' ? 'text-amber-500' : ''}`}
                            >
                                Play
                            </Link>
                        </motion.div>
                        <motion.div 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to={'/spectate'}
                                onClick={toggleMenu}
                                style={
                                    pathName === '/spectate'
                                        ? undefined
                                        : { textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }
                                } className={`text-lg text-white sm:text-xl transition-colors text-center ${pathName === '/spectate' ? 'text-amber-500' : ''}`}
                            >
                                Spectate
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default Navbar;