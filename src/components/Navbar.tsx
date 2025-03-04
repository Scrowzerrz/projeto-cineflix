
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Search, ChevronDown } from 'lucide-react';
import NotificacaoBadge from './NotificacaoBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { perfil, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${e.currentTarget.value}`);
    }
  };

  return (
    <nav className="bg-movieDark border-b border-movieGray/20 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-white text-2xl font-bold">Cineflix</span>
              <div className="ml-1 w-4 h-4 bg-movieRed rotate-45 relative">
                <div className="absolute inset-0 flex items-center justify-center -rotate-45">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/movies" className="header-link">
              Filmes
            </Link>
            <Link to="/series" className="header-link">
              Séries
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Pesquisar filmes e séries..."
              className="bg-movieDarkBlue border-movieGray/20 text-white rounded-md focus-visible:ring-movieRed focus-visible:ring-1 w-64 md:w-80"
              onKeyDown={handleSearch}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60 pointer-events-none" />
          </div>

          {perfil ? (
            <div className="flex items-center gap-4">
              <NotificacaoBadge />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-0 hover:bg-transparent">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={perfil.avatar_url || ''} alt={perfil.nome || 'User'} />
                      <AvatarFallback className="bg-movieRed text-white text-sm">
                        {perfil.nome ? perfil.nome.substring(0, 2).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-white/60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-movieDark border-movieGray/20">
                  <DropdownMenuItem onClick={() => navigate('/perfil')} className="text-white cursor-pointer">
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/configuracoes')} className="text-white cursor-pointer">
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} className="text-movieRed cursor-pointer">
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/auth">
              <Button>Entrar</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
