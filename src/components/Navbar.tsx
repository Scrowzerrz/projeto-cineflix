import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Search } from 'lucide-react';
import NotificacaoBadge from './NotificacaoBadge';

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
        <Link to="/" className="text-2xl font-bold text-white">
          Cineflix
        </Link>
        
        <div className="flex items-center gap-4">
          <Input
            type="search"
            placeholder="Pesquisar filmes e séries..."
            className="bg-movieDarkBlue border-movieGray/20 text-white rounded-md focus-visible:ring-movieRed focus-visible:ring-1 w-64 md:w-80"
            onKeyDown={handleSearch}
          />
          <Search className="h-4 w-4 text-white/60 -ml-8 z-10 pointer-events-none" />

          {perfil ? (
            <div className="flex items-center gap-4">
              <NotificacaoBadge />
              <Avatar className="h-9 w-9">
                <AvatarImage src={perfil.avatar_url || ''} alt={perfil.nome || 'User'} />
                <AvatarFallback className="bg-movieRed text-white text-sm">
                  {perfil.nome ? perfil.nome.substring(0, 2).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <Button variant="destructive" size="sm" onClick={signOut}>
                Sair
              </Button>
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
