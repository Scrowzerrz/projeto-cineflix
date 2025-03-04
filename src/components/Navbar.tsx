
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`fixed top-0 w-full z-50 transition-all duration-500 py-3 ${
        isScrolled ? 'bg-movieDarkBlue shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center">
            <span className="text-white text-2xl font-bold">Cineflix</span>
            <div className="ml-1 w-5 h-5 bg-movieRed rotate-45 relative">
              <div className="absolute inset-0 flex items-center justify-center -rotate-45">
                <span className="text-white text-xs font-bold">+</span>
              </div>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`header-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Início
            </Link>
            <Link 
              to="/movies" 
              className={`header-link ${location.pathname === '/movies' ? 'active' : ''}`}
            >
              Filmes
            </Link>
            <Link 
              to="/series" 
              className={`header-link ${location.pathname === '/series' ? 'active' : ''}`}
            >
              Séries
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="header-link flex items-center">
                Mais <ChevronDown className="ml-1 w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-movieDark border-movieGray/20">
                <DropdownMenuItem className="text-white hover:bg-movieGray/20">
                  <Link to="/categories" className="w-full">Categorias</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-movieGray/20">
                  <Link to="/about" className="w-full">Sobre</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`relative transition-all duration-300 ${isSearchOpen ? 'w-52' : 'w-0'}`}>
            {isSearchOpen && (
              <Input 
                className="bg-movieDark/60 border-movieGray/20 text-white placeholder:text-movieGray/60 backdrop-blur-sm"
                placeholder="Buscar..." 
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-white hover:bg-white/10"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/10 relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-movieRed rounded-full"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border border-white/20">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-movieRed text-white">US</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-movieDark border-movieGray/20" align="end" forceMount>
              <DropdownMenuItem className="text-white hover:bg-movieGray/20">
                <Link to="/profile" className="w-full">Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-movieGray/20">
                <Link to="/settings" className="w-full">Configurações</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-movieGray/20">
                <Link to="/login" className="w-full">Sair</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
