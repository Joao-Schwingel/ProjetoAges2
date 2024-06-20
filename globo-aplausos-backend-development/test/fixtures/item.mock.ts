import { Item } from '@prisma/client';
import { RewardDTO } from 'src/api/rewards/DTO/rewardDTO.model';

const mockItem = ({
  itemId,
  name,
  description,
  price,
  image,
}: Partial<Item>) => ({
  itemId,
  name,
  description,
  price,
  image,
  updatedAt: new Date(),
  available: true,
});

export const mockItem1: Item = mockItem({
  itemId: 1,
  name: 'Amazon Echo Dot 5ª geração',
  description:
    'O Echo Dot conta com speaker de melhor qualidade, proporcionando vocais mais nítidos, graves mais potentes e um som mais vibrante. Peça para Alexa reproduzir músicas e podcasts e aproveite a experiência sonora dinâmica em qualquer ambiente da sua casa.',
  price: 50.0,
  image: 'https://m.media-amazon.com/images/I/61-CdurOgsL._AC_SY450_.jpg',
});

export const mockItem2 = mockItem({
  itemId: 2,
  name: 'Coca-Cola',
  description: 'Coca-Cola de 2L',
  price: 7,
  image:
    'https://www.setegotas.com.br/wp-content/uploads/2020/06/refr.coca_cola_2l.jpg',
});

export const mockItem3 = mockItem({
  itemId: 3,
  name: 'Ecobag',
  description: 'A melhor ecobag do mundo',
  price: 1000,
  image:
    'https://cdn.discordapp.com/attachments/1046536792540713132/1149808351509757952/image.png?ex=653c21f9&is=6529acf9&hm=4ae549323900f1e1451e787d695cfe6f00fb953c95fc1bba091f9a08f6d1748e&',
});

export const mockItemReq5: RewardDTO = {
  file: { data: '', name: 'bagMock.png', type: 'image/png' },
  name: 'Ecobag',
  description: 'A melhor ecobag do mundo',
  price: 1000,
};

export const mockItem5: Item = mockItem({
  itemId: 5,
  name: 'Ecobag',
  description: 'A melhor ecobag do mundo',
  price: 1000,
  image: 'https://globo-aplauso.s3.amazonaws.com/items/bagMock.png',
});

export const mockInvalidItem: Item = mockItem({
  itemId: -1,
  name: 'Invalid Item',
  description: 'Invalid Item Description',
  price: -1,
  image: 'https://thisitemdoesnotexist.com/',
});

export const mockInvalidItemId: Item = mockItem({
  itemId: -1,
  name: mockItem1.name,
  description: mockItem1.description,
  price: 10,
  image: mockItem1.image,
});

export const mockInvalidItemNameReq: RewardDTO = {
  ...mockItemReq5,
  name: '',
};

export const mockInvalidItemName: Item = mockItem({
  itemId: mockItem5.itemId,
  name: '',
  description: mockItem5.description,
  price: mockItem5.price,
  image: mockItem5.image,
});

export const mockInvalidItemDescriptionReq: RewardDTO = {
  ...mockItemReq5,
  description: '',
};
export const mockInvalidItemDescription: Item = mockItem({
  itemId: mockItem5.itemId,
  name: mockItem5.name,
  description: '',
  price: mockItem5.price,
  image: mockItem5.image,
});

export const mockInvalidItemPriceReq: RewardDTO = {
  ...mockItemReq5,
  price: -1,
};

export const mockInvalidItemPrice: Item = mockItem({
  itemId: mockItem5.itemId,
  name: mockItem5.name,
  description: mockItem5.description,
  price: -1,
  image: mockItem5.image,
});

export const mockItems = [mockItem1, mockItem2];

export const mockItem4: Item = mockItem({
  name: 'Biscoitos Globo',
  description: 'Biscoitos Globo de 500g',
  image:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Biscoite_globo.jpg/800px-Biscoite_globo.jpg?20210103042314',
});
