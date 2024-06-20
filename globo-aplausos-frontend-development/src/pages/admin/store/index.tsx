import Head from 'next/head';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/productCard';
import ProductModal from '@/components/productModal';
import { Item, UserType } from '@/types/prisma';
import { getToken } from '@/utils/token';
import { deleteReward, getListProducts } from '@/pages/api/store';
import Layout from '@/components/layout';
import styles from '@/styles/pages/home.module.css';
import UserMessageModal from '@/components/userMessageModal';
import { useUser } from '@/contexts/userContext';
import { RewardModal } from '@/components/rewardModal';
import stringTokens from '@/utils/stringTokens';
import router from 'next/router';

export default function Store() {
  const { user, loadingUserInformation } = useUser();
  const token = getToken();
  const [products, setProducts] = useState<Item[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);
  const [isEditRewardModalOpen, setIsEditRewardModalOpen] = useState(false);
  const [isEditRewardMessageModalOpen, setIsEditRewardMessageModalOpen] = useState(false);
  const [editRewardMessageModal, setEditRewardMessageModal] = useState<'error' | 'success'>(
    'success'
  );
  const [selectedProduct, setSelectedProduct] = useState<Item>();
  const [deleteModal, setDeleteModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [shouldReload, setShouldReload] = useState(false);

  const getString = stringTokens();

  const handleDeleteProductConfirm = async () => {
    if (!selectedProduct) {
      return;
    }

    try {
      await deleteReward(token, selectedProduct.itemId);
      setSuccessModal(true);
      setDeleteModal(false);
      setSelectedProduct(undefined);
    } catch (error) {
      setErrorModal(true);
      setDeleteModal(false);
      setSelectedProduct(undefined);
    }

    try {
      retrieveProductList();
    } catch (error) {}
  };

  const handleDeleteProduct = () => {
    setDeleteModal(true);
  };

  const handleOpenDeleteProductModal = (product: Item) => {
    setSelectedProduct(product);
    setIsDeleteProductModalOpen(true);
  };

  const handleOpenModal = (product: Item) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOpenEditRewardModal = (product: Item) => {
    setSelectedProduct(product);
    setIsEditRewardModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsDeleteProductModalOpen(false);
  };

  const handleEditRewardSuccessModal = () => {
    setIsEditRewardMessageModalOpen(true);
    setEditRewardMessageModal('success');
  };

  const handleEditRewardErrorModal = () => {
    setIsEditRewardMessageModalOpen(true);
    setEditRewardMessageModal('error');
  };

  useEffect(() => {
    if (loadingUserInformation || !user) {
      return;
    }
    retrieveProductList();
  }, [loadingUserInformation, user]);

  useEffect(() => {
    if (isEditRewardMessageModalOpen && !shouldReload) {
      setShouldReload(true);
    } else if (!isEditRewardMessageModalOpen && shouldReload) {
      router.reload();
    }
  }, [isEditRewardMessageModalOpen, shouldReload]);

  const retrieveProductList = async () => {
    const token = getToken();
    if (!token) return;
    const response = await getListProducts(token);
    setProducts(response);
  };

  return (
    <>
      <Head>
        <title>Globo Aplausos - Recompensas Admin</title>
      </Head>
      <Layout>
        <div className={styles.feedbacks}>
          <h1 className={styles.myClaps}>{getString.menuRewards}</h1>
          <div className={styles.contentBox}>
            <div>
              {products && products.length ? (
                products.map((product, index) => (
                  <ProductCard
                    key={product.name}
                    type={UserType.ADMIN}
                    img={product.image}
                    name={product.name}
                    description={product.description}
                    applauses={product.price}
                    onClick={() => handleOpenModal(product)}
                    onClickEdit={() => handleOpenEditRewardModal(product)}
                    onClickDelete={() => handleOpenDeleteProductModal(product)}
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
            isOpen={isDeleteProductModalOpen}
            type={UserType.ADMIN}
            onClose={handleCloseProductModal}
            handleCancel={handleCloseProductModal}
            handleRedeem={() => {}}
            handleDelete={handleDeleteProduct}
          />
        )}

        {selectedProduct && isEditRewardModalOpen && (
          <RewardModal
            product={selectedProduct}
            isEdit
            closeRewardModal={() => setIsEditRewardModalOpen(false)}
            handleSuccessModal={handleEditRewardSuccessModal}
            handleErrorModal={handleEditRewardErrorModal}
          />
        )}

        <UserMessageModal
          isOpen={isEditRewardMessageModalOpen}
          setIsOpen={setIsEditRewardMessageModalOpen}
          hasButton={false}
          img={editRewardMessageModal}
          title={editRewardMessageModal === 'success' ? 'Sucesso' : 'Erro'}
          message={
            editRewardMessageModal === 'success'
              ? 'Recompensa editada com sucesso!'
              : 'Erro ao editar a recompensa!'
          }
        />
        <UserMessageModal
          isOpen={deleteModal}
          setIsOpen={setDeleteModal}
          hasButton={true}
          img="question"
          onConfirm={handleDeleteProductConfirm}
          message="Você tem certeza que deseja excluir essa recompensa?"
        />
        <UserMessageModal
          isOpen={errorModal}
          setIsOpen={setErrorModal}
          hasButton={false}
          img="error"
          title="Erro"
          message="Erro ao deletar a recompensa!"
        />
        <UserMessageModal
          isOpen={successModal}
          setIsOpen={setSuccessModal}
          hasButton={false}
          img="success"
          title="Sucesso"
          message="Recompensa excluída com sucesso!"
        />
      </Layout>
    </>
  );
}
