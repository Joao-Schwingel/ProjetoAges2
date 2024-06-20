import { useState } from 'react';
import styles from '@/styles/components/menu.module.css';
import { IconButton, Menu, MenuItem } from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  ExitToApp as LogoutIcon,
  MailOutline as MailOutlineIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import Image from 'next/image';
import router from 'next/router';
import { UserType } from '@/types/prisma';
import { removeToken } from '@/utils/token';
import { useUser } from '@/contexts/userContext';
import stringTokens from '@/utils/stringTokens';

interface BasicMenuProps {
  overlayFunctions: [() => void, () => void];
}

export default function BasicMenu({
  overlayFunctions: [openOverlay, closeOverlay]
}: BasicMenuProps) {
  const getString = stringTokens();
  const ListOfItemsUser = [
    {
      position: 1,
      text: getString.menuHome,
      link: '/',
      id: 'home',
      image: <HomeIcon className={styles.imageSize} />
    },
    {
      position: 2,
      text: getString.menuRewards,
      id: 'store',
      link: '/store',
      image: <ShoppingCartIcon className={styles.imageSize} />
    },
    {
      position: 3,
      text: getString.menuFeedbacks,
      link: '/sentFeedbacks',
      image: <MailOutlineIcon className={styles.imageSize} />
    },
    {
      position: 4,
      text: getString.menuRewardsRedeemed,
      link: '/store/redeemed',
      image: (
        <Image
          src={'/MenuCoinIcon.svg'}
          alt="ClapCoin"
          className={styles.imageSize}
          width={32}
          height={32}
        />
      )
    },
    {
      position: 5,
      text: getString.menuLogout,
      link: '/login',
      id: 'logout',
      image: <LogoutIcon className={styles.imageSize} />,
      identifier: 'logout'
    }
  ];
  const ListOfItemsAdmin = [
    {
      position: 1,
      text: getString.menuHome,
      link: '/admin',
      id: 'adminHome',
      image: <HomeIcon className={styles.imageSize} />
    },
    {
      position: 2,
      text: getString.menuRewards,
      link: '/admin/store',
      id: 'adminStore',
      image: <ShoppingCartIcon className={styles.imageSize} />
    },
    {
      position: 3,
      text: getString.menuAdminRewardsHistory,
      id: 'rewardsHistory',
      link: '/admin/store/redeemed',
      image: (
        <Image
          src={'/MenuCoinIcon.svg'}
          alt="ClapCoin"
          className={styles.imageSize}
          width={32}
          height={32}
        />
      )
    },
    {
      position: 4,
      text: getString.menuAdminInactiveProfile,
      link: '/admin/inactive',
      id: 'inactiveProfiles',
      image: <PersonIcon className={styles.imageSize} />
    },
    {
      position: 5,
      text: getString.menuLogout,
      link: '/login',
      id: 'logout',
      image: <LogoutIcon className={styles.imageSize} />,
      identifier: 'logout'
    }
  ];
  const { user } = useUser();
  const listOfItems = user?.userType === UserType.ADMIN ? ListOfItemsAdmin : ListOfItemsUser;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    openOverlay();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    closeOverlay();
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id="menu-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon className={styles.button} />
      </IconButton>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        {listOfItems.map((item, key) => {
          return (
            <MenuItem
              id={item.id}
              key={key}
              onMouseDown={(event) => {
                if (item.identifier === 'logout') {
                  removeToken();
                  router.push(item.link);
                  return;
                }
                const isMiddleButton = event.button === 1;
                if (isMiddleButton) {
                  window.open(item.link, '_blank');
                } else {
                  router.push(item.link);
                }
              }}
              className={styles.menuItem}
            >
              {listOfItems[key].image} {item.text}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
