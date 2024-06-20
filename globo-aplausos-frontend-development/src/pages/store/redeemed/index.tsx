import Head from 'next/head';
import styles from '@/styles/pages/home.module.css';
import { useEffect, useState } from 'react';
import router from 'next/router';
import { UserType, redeemedItem } from '@/types/prisma';
import ProductCard from '@/components/productCard';
import ProductModal from '@/components/productModal';
import { getToken } from '@/utils/token';
import { getRedeemedProducts } from '@/pages/api/store';
import Layout from '@/components/layout';
import StringTokens from '@/utils/stringTokens';
import { useUser } from '@/contexts/userContext';

export default function Store() {
  const { loadingUserInformation, user } = useUser();
  const [products, setProducts] = useState<redeemedItem[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<redeemedItem>();
  const [isUserMessageModalOpen] = useState(false);
  const [shouldReload, setShouldReload] = useState(false);

  const handleOpenProductModal = (product: redeemedItem) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
  };

  useEffect(() => {
    if (isUserMessageModalOpen && !shouldReload) {
      setShouldReload(true);
    } else if (!isUserMessageModalOpen && shouldReload) {
      router.reload();
    }
  }, [isUserMessageModalOpen, shouldReload]);

  const handleProductRedeemed = async () => {};

  useEffect(() => {
    if (loadingUserInformation || !user) {
      return;
    }
    getProducts();
  }, [loadingUserInformation, user]);

  const getProducts = async () => {
    const token = getToken();
    const response = await getRedeemedProducts(token);
    setProducts(response);
  };

  const redeemedProducts = products.reverse();

  const getString = StringTokens();

  return (
    <>
      <Head>
        <title>Globo Aplausos - Recompensas Resgatadas</title>
      </Head>
      <Layout>
        <div className={styles.feedbacks}>
          <h1 className={styles.myClaps}>{getString.menuRewardsRedeemed}</h1>
          <div className={styles.contentBox}>
            <div>
              {redeemedProducts && redeemedProducts.length ? (
                redeemedProducts.map((product, index) => (
                  <ProductCard
                    key={product.name}
                    type={UserType.BASIC}
                    img={product.item.image}
                    name={product.item.name}
                    description={product.item.description}
                    date={product.datetime}
                    applauses={product.price}
                    onClick={() => handleOpenProductModal(product)}
                    id={`product-${index}`}
                  />
                ))
              ) : (
                <div className={styles.noContent}>
                  <h3>{getString.noRewardsRedeemed}</h3>
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedProduct && (
          <ProductModal
            itemId={selectedProduct.itemId}
            image={selectedProduct.item.image}
            name={selectedProduct.item.name}
            price={selectedProduct.price}
            isOpen={isProductModalOpen}
            type={''}
            onClose={handleCloseProductModal}
            handleCancel={handleCloseProductModal}
            handleRedeem={handleProductRedeemed}
            description={''}
            available={true}
            updatedAt={undefined}
          />
        )}
      </Layout>
    </>
  );
}
