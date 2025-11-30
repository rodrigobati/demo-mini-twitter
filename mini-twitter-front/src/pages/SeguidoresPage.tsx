/**
 * SeguidoresPage
 * 
 * Responsabilidad: Mostrar la lista de seguidores de un usuario específico
 * Permite seguir/dejar de seguir a cada usuario
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { UsuarioCard } from '../components/social';
import { useSocial } from '../hooks';
import { usuariosService } from '../api';
import type { UsuarioResponse } from '../api/types';
import styles from './SeguidoresPage.module.css';

export const SeguidoresPage = () => {
  const { idUsuario } = useParams<{ idUsuario: string }>();
  const { isSiguiendo, seguir, dejarDeSeguir } = useSocial();
  
  const [seguidores, setSeguidores] = useState<UsuarioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeguidores = async () => {
      if (!idUsuario) {
        setError('ID de usuario no proporcionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await usuariosService.getSeguidores(parseInt(idUsuario));
        setSeguidores(data);
      } catch (err) {
        console.error('Error al cargar seguidores:', err);
        setError('No se pudieron cargar los seguidores');
      } finally {
        setLoading(false);
      }
    };

    fetchSeguidores();
  }, [idUsuario]);

  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.container}>
        <div className={styles.content}>
          <header className={styles.pageHeader}>
            <h1 className={styles.title}>
              Seguidores {idUsuario && `(Usuario ${idUsuario})`}
            </h1>
          </header>

          {loading && <p className={styles.message}>Cargando...</p>}
          {error && <p className={styles.error}>{error}</p>}
          
          {!loading && !error && seguidores.length === 0 && (
            <p className={styles.empty}>Este usuario no tiene seguidores todavía</p>
          )}

          {!loading && !error && seguidores.length > 0 && (
            <div className={styles.list}>
              {seguidores.map((usuario) => (
                <UsuarioCard
                  key={usuario.id}
                  usuario={usuario}
                  isSiguiendo={isSiguiendo(usuario.id)}
                  onSeguir={() => seguir(usuario.id)}
                  onDejarDeSeguir={() => dejarDeSeguir(usuario.id)}
                  showFollowButton={true}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
