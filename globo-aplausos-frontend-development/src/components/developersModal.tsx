import { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Image from 'next/image';
import styles from '@/styles/components/developersModal.module.css';
import theme from '@/styles/materialTheme';
import stringTokens from '@/utils/stringTokens';
import { getToken } from '@/utils/token';
import { Developers } from '@/types/prisma';
import { getDevelopers } from '@/pages/api/developers';

export function DevelopersModal({
  toggleIsModalOpen
}: {
  toggleIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const getString = stringTokens();
  const [developers, setDevelopers] = useState<Developers[]>([]);
  const LINKEDIN_URL = `https://linkedin.com/in`.length;

  useEffect(() => {
    const hasFetchedDevelopers = developers.length > 0;
    const token = getToken();
    if (hasFetchedDevelopers || !token) return;

    getDevelopers(token).then(setDevelopers);
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      toggleIsModalOpen((prev) => !prev);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.modalWrapper}>
          <div className={styles.titleWrapper}>
            <h2>Sobre o projeto Globo Aplausos</h2>
            <p>
              O projeto visa criar uma cultura de promover feedback entre os colaboradores da Globo,
              incentivando o reconhecimento e o fortalecimento das relações interpessoais. Através
              de uma plataforma digital, os colaboradores receberão uma moeda virtual mensal que
              poderá ser doada para outros colegas que realizaram ações positivas no dia a dia. Essa
              abordagem visa fomentar um ambiente de trabalho positivo, incentivar o reconhecimento
              mútuo e promover a motivação e o engajamento entre os colaboradores.
            </p>
          </div>
          <div className={styles.usersWrapper}>
            <h3>Objetivos do Projeto</h3>
            <p>
              Desenvolver uma plataforma digital que permita aos colaboradores receberem uma moeda
              virtual mensal. Implementar um sistema de doações, no qual os colaboradores podem doar
              suas moedas virtuais para reconhecer e valorizar as ações positivas de outros colegas
              de trabalho. Criar uma loja virtual na qual os colaboradores possam trocar suas moedas
              virtuais acumuladas por recompensas tangíveis ou benefício.
            </p>
            <h4>Administrador</h4>
            <p>
              O administrador é responsável por gerenciar os usuários, as recompensas e as doações.
              Ele pode criar, editar e excluir usuários, recompensas e doações. Além disso, ele pode
              visualizar as estatísticas de uso da plataforma.
            </p>
            <h4>Usuários</h4>
            <p>
              Os usuários são os colaboradores da Globo. Eles podem receber moedas virtuais mensais,
              doar suas moedas para outros colegas e trocar suas moedas por recompensas.
            </p>
          </div>
          <div className={styles.developersWrapper}>
            <h3>Equipe de Desenvolvimento</h3>
            <div className={styles.developers}>
              {developers.map((developer) => (
                <button
                  key={developer.id}
                  className={styles.developerWrapper}
                  onClick={() => window.open(developer.url, '_blank')}
                >
                  <div className={styles.left}>
                    <Image
                      alt={`Imagem de ${developer.name}`}
                      src={developer.image}
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className={styles.right}>
                    <h4>{developer.name}</h4>
                    <p className={styles.linkedin}>
                      <LinkedInIcon fontSize="inherit" />
                      {developer.url.substring(LINKEDIN_URL)}
                    </p>
                    <p>{developer.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
