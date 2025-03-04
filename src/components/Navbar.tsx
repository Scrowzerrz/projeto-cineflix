
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Search, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { perfil, signOut, loading, session } = useAuth();

  useEffect(() => {
    console.log("Navbar renderizada. Estado de autenticação:", { 
      autenticado: !!session, 
      perfilExiste: !!perfil, 
      carregando: loading 
    });
  }, [perfil, loading, session]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form.elements.namedItem('searchInput') as HTMLInputElement;
    
    if (searchInput && searchInput.value.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.value.trim())}`);
      setIsSearchOpen(false);
    }
  };

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
          <form 
            className={`relative transition-all duration-300 ${isSearchOpen ? 'w-52' : 'w-0'}`}
            onSubmit={handleSearchSubmit}
          >
            {isSearchOpen && (
              <Input 
                name="searchInput"
                className="bg-movieDark/60 border-movieGray/20 text-white placeholder:text-movieGray/60 backdrop-blur-sm"
                placeholder="Buscar..." 
                autoFocus
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              />
            )}
          </form>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-white hover:bg-white/10"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          {/* Mostrar o sino apenas para usuários logados */}
          {!loading && session && perfil && (
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/10 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-movieRed rounded-full"></span>
            </Button>
          )}
          
          {!loading && session && perfil ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 border border-white/20">
                    <AvatarImage src={perfil.avatar_url || ''} />
                    <AvatarFallback className="bg-movieRed text-white">
                      {perfil.nome ? perfil.nome.substring(0, 2).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-movieDark border-movieGray/20" align="end" forceMount>
                <div className="p-2 border-b border-gray-800">
                  <p className="text-white font-medium truncate">{perfil.nome || 'Usuário'}</p>
                  <p className="text-gray-400 text-xs truncate">{perfil.email}</p>
                </div>
                <DropdownMenuItem className="text-white hover:bg-movieGray/20">
                  <Link to="/perfil" className="w-full flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-movieGray/20">
                  <Link to="/configuracoes" className="w-full flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-white hover:bg-movieGray/20"
                  onClick={() => signOut()}
                >
                  <div className="w-full flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => navigate('/auth')}
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Entrar'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
