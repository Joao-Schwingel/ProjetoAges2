import Head from 'next/head';
import styles from '@/styles/pages/home.module.css';
import { useEffect, useState } from 'react';
import { Item, UserType } from '@/types/prisma';
import ProductCard from '@/components/productCard';
import ProductModal from '@/components/productModal';
import UserMessageModal from '@/components/userMessageModal';
import StringTokens from '@/utils/stringTokens';
import { getToken } from '@/utils/token';
import { redeemProduct, getListProducts } from '../api/store';
import Layout from '@/components/layout';
import { fetchUserData } from '../api/user';
import { useUser } from '@/contexts/userContext';

export default function Store() {
  const { setUser, user, loadingUserInformation } = useUser();
  const [products, setProducts] = useState<Item[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error' | 'question'>('success');
  const [selectedProduct, setSelectedProduct] = useState<Item>();
  const [isUserMessageModalOpen, setIsUserMessageModalOpen] = useState(false);
  const token = getToken();
  const getString = StringTokens();

  const handleOpenProductModal = (product: Item) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
  };

  useEffect(() => {
    if (loadingUserInformation || !user) {
      return;
    }
    retrieveProductList();
  }, [loadingUserInformation, user]);

  const handleRedeemProduct = async () => {
    if (!selectedProduct) return;
    try {
      await redeemProduct(selectedProduct?.itemId, token);
      setModalType('success');
      const response = await fetchUserData(token);
      setUser(response);
    } catch (err) {
      setModalType('error');
    }
    try {
      retrieveProductList();
    } catch {}
    setIsProductModalOpen(false);
    setIsUserMessageModalOpen(true);
  };

  const retrieveProductList = async () => {
    const token = getToken();
    if (!token) return;

    const response = await getListProducts(token);
    setProducts(response);
  };

  return (
    <>
      <Head>
        <title>Globo Aplausos - Recompensas</title>
      </Head>
      <Layout>
        <div className={styles.feedbacks}>
          <h1 className={styles.myClaps}>{getString.pageTitleRewards}</h1>
          <div className={styles.contentBox}>
            <div>
              {products && products.length ? (
                products.map((product, index) => (
                  <ProductCard
                    key={product.name}
                    type={UserType.BASIC}
                    img={product.image}
                    name={product.name}
                    description={product.description}
                    applauses={product.price}
                    onClick={() => handleOpenProductModal(product)}
                    id={`product-${index}`}
                  />
                ))
              ) : (
                <div className={styles.noContent}>
                  <h3>{getString.noRewards}</h3>
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedProduct && (
          <ProductModal
            {...selectedProduct}
            isOpen={isProductModalOpen}
            type={UserType.BASIC}
            onClose={handleCloseProductModal}
            handleCancel={handleCloseProductModal}
            handleRedeem={handleRedeemProduct}
          />
        )}

        {isUserMessageModalOpen && (
          <UserMessageModal
            isOpen={isUserMessageModalOpen}
            setIsOpen={setIsUserMessageModalOpen}
            hasButton={false}
            img={modalType}
            title={
              modalType === 'success'
                ? getString.successProductMessageTitle
                : getString.errorProductMessageTitle
            }
            message={
              modalType === 'success'
                ? getString.successRewardMessage
                : getString.errorCoinsRewardMessage
            }
          />
        )}
      </Layout>
    </>
  );
}
