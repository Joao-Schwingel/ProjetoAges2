'use client';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import BasicMenu from '@/components/menu';
import styles from '@/styles/components/header.module.css';
import style from '@/styles/pages/home.module.css';
import { useUser } from '@/contexts/userContext';
import { UserType } from '@/types/prisma';
import { DevelopersModal } from './developersModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpenInfoModal, setIsOpenInfoModal] = useState(false);

  function openOverlay() {
    setIsMenuOpen(true);
  }

  function closeOverlay() {
    setIsMenuOpen(false);
  }

  const overlayFunctions = [openOverlay, closeOverlay] as [() => void, () => void];

  const { user, loadingUserInformation } = useUser();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.buttonContainer}>
          <BasicMenu overlayFunctions={overlayFunctions} />
        </div>
        <div className={styles.logoContainer}>
          <div className={styles.imageWrapper}>
            <div className={styles.imageWrapper}>
              {user && (
                <Link href={user.userType === UserType.ADMIN ? '/admin' : '/'}>
                  <Image src={'/HeaderImage.svg'} fill alt="Logo" />
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className={styles.infoContainer}>
          <HelpOutlineIcon
            className={styles.aboutIcon}
            color="inherit"
            fontSize="inherit"
            onClick={() => setIsOpenInfoModal(true)}
          />
        </div>
      </header>
      {(isMenuOpen || isOpenInfoModal) && <div className={style.overlay} />}
      {isOpenInfoModal && <DevelopersModal toggleIsModalOpen={setIsOpenInfoModal} />}
    </>
  );
}
