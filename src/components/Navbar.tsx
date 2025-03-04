import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, LogIn, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import NotificacaoBadge from './NotificacaoBadge';
import AdminLink from './AdminLink';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  
  const links = [
    { name: 'Início', path: '/' },
    { name: 'Filmes', path: '/movies' },
    { name: 'Séries', path: '/series' },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 5);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-gradient-to-b from-black/90 to-transparent'}`}>
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center">
          <span className="text-white text-xl font-bold">Cineflix</span>
          <div className="ml-1 w-4 h-4 bg-movieRed rotate-45 relative">
            <div className="absolute inset-0 flex items-center justify-center -rotate-45">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          </div>
        </Link>
        
        {!isMobile && (
          <div className="flex-1 flex items-center justify-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-white text-sm font-medium hover:text-movieRed transition-colors ${
                  location.pathname === link.path ? 'text-movieRed' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
            <AdminLink />
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-movieDark border border-gray-700 rounded-full text-white text-sm px-4 py-1.5 pl-9 focus:outline-none focus:border-movieRed transition-colors"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </form>
          
          {!loading && (
            session ? (
              <div className="flex items-center space-x-3">
                <NotificacaoBadge />
                <Link to="/perfil">
                  <Button size="icon" variant="ghost" className="rounded-full bg-movieDark border border-gray-700 h-9 w-9">
                    <User className="h-4 w-4 text-white" />
                  </Button>
                </Link>
              </div>
            ) : (
              <Link to="/auth">
                <Button size="sm" variant="ghost" className="text-white flex items-center gap-1.5">
                  <LogIn className="h-4 w-4" />
                  <span>Entrar</span>
                </Button>
              </Link>
            )
          )}
          
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          )}
        </div>
      </div>
      
      {isMobile && mobileMenuOpen && (
        <div className="bg-black/95 backdrop-blur-md border-t border-gray-800">
          <div className="container mx-auto py-4 px-4">
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-movieDark border border-gray-700 rounded-full text-white text-sm px-4 py-2 pl-9 focus:outline-none focus:border-movieRed transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </form>
            <div className="flex flex-col space-y-3">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-white text-sm font-medium hover:text-movieRed transition-colors ${
                    location.pathname === link.path ? 'text-movieRed' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <AdminLink />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
