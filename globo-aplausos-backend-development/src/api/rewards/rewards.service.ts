import { Injectable, HttpStatus } from '@nestjs/common';
import { Item, UserType, Wallet } from '@prisma/client';
import { upload } from '../../../aws/upload';
import { PrismaService } from '../../database/prisma.service';
import { Exception } from '../exceptions/Exception';
import { RewardDTO, RewardRedeemedDTO } from './DTO/rewardDTO.model';

@Injectable()
export class RewardsService {
  constructor(private readonly prismaService: PrismaService) {}

  async makeTransaction(
    reqUserId: number,
    itemId: number,
  ): Promise<Partial<Wallet>> {
    const user = await this.prismaService.user.findUnique({
      where: { userId: reqUserId },
      select: {
        userId: true,
        name: true,
        email: true,
        cpf: true,
        userType: true,
        walletId: true,
        profilePicture: true,
      },
    });

    if (!user)
      throw new Exception(
        `User with ID ${reqUserId} not found`,
        HttpStatus.NOT_FOUND,
      );

    if (user.userType !== UserType.BASIC)
      throw new Exception(
        `User with ID ${reqUserId} is invalid`,
        HttpStatus.UNAUTHORIZED,
      );

    const wallet = await this.prismaService.wallet.findUnique({
      where: { walletId: user.walletId },
      select: {
        walletId: true,
        claps: true,
      },
    });

    if (!wallet)
      throw new Exception(
        `Wallet with ID ${user.walletId} not found`,
        HttpStatus.NOT_FOUND,
      );

    const item = await this.prismaService.item.findUnique({
      where: { itemId: Number(itemId) },
      select: {
        itemId: true,
        price: true,
      },
    });

    if (!item)
      throw new Exception(
        `Item with ID ${itemId} not found`,
        HttpStatus.NOT_FOUND,
      );

    if (wallet.claps < Number(item.price))
      throw new Exception(
        `User with ID ${reqUserId} does not have enough claps`,
        HttpStatus.FAILED_DEPENDENCY,
      );

    await this.prismaService.wallet.update({
      where: wallet,
      data: {
        claps: wallet.claps - Number(item.price),
      },
    });

    const transaction = await this.prismaService.transaction.create({
      data: {
        userId: user.userId,
        itemId: item.itemId,
        price: item.price,
        datetime: new Date(),
      },
    });

    if (!transaction)
      throw new Exception(
        `Transaction for user with ID ${reqUserId} could not be created`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return transaction;
  }

  async createReward({
    name,
    description,
    price,
    file,
  }: RewardDTO): Promise<Item> {
    if (price < 0) {
      throw new Exception(`Price cannot be negative`, HttpStatus.BAD_REQUEST);
    }

    if (!name || name.length === 0) {
      throw new Exception(`Name cannot be empty`, HttpStatus.BAD_REQUEST);
    }

    if (!description || description.length === 0) {
      throw new Exception(
        `Description cannot be empty`,
        HttpStatus.BAD_REQUEST,
      );
    }

    let image_url = `https://globo-aplauso.s3.amazonaws.com/items/default_item.png`;

    if (file) {
      if (file.data.length === 0) {
        throw new Exception(`Image cannot be empty`, HttpStatus.BAD_REQUEST);
      }

      const fileAsBuffer = Buffer.from(file.data, 'base64');
      const fileSize = fileAsBuffer.byteLength;
      const MAX_FILE_SIZE = 5 * 1024 * 1024;

      if (fileSize > MAX_FILE_SIZE) {
        throw new Exception(
          `Image cannot be larger than 5MB`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!file.type.startsWith('image/')) {
        throw new Exception(
          `File must be of type image`,
          HttpStatus.BAD_REQUEST,
        );
      }

      image_url = await upload('items', file);
    }

    const item = await this.prismaService.item.create({
      data: {
        name,
        description,
        price,
        image: image_url,
        available: true,
        updatedAt: new Date(),
      },
    });

    if (!item)
      throw new Exception(
        `Reward with name ${name} could not be created`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return item;
  }

  async editReward(
    itemId: number,
    rewardDTO: RewardDTO,
  ): Promise<Partial<Item>> {
    const reward = await this.prismaService.item.findUnique({
      where: {
        itemId: Number(itemId),
      },
    });

    if (!reward) {
      throw new Exception(
        `Reward with ID ${itemId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    let updatedData: any = { ...rewardDTO };

    if (rewardDTO.file) {
      if (rewardDTO.file.data.length === 0) {
        throw new Exception(`Image cannot be empty`, HttpStatus.BAD_REQUEST);
      }

      const fileAsBuffer = Buffer.from(rewardDTO.file.data, 'base64');
      const fileSize = fileAsBuffer.byteLength;
      const MAX_FILE_SIZE = 5 * 1024 * 1024;

      if (fileSize > MAX_FILE_SIZE) {
        throw new Exception(
          `Image cannot be larger than 5MB`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!rewardDTO.file.type.startsWith('image/')) {
        throw new Exception(
          `File must be of type image`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const image_url = await upload('items', rewardDTO.file);
      reward.image = image_url;
      const { file, ...dataWithoutFile } = updatedData;
      updatedData = { ...dataWithoutFile };
    }

    const editedReward = await this.prismaService.item.update({
      where: {
        itemId: Number(itemId),
      },
      data: {
        ...updatedData,
        image: reward.image,
      },
    });
    return editedReward;
  }

  async getRewardsRedeemed(): Promise<RewardRedeemedDTO[]> {
    try {
      const rewardsRedeemed = await this.prismaService.transaction.findMany({
        select: {
          price: true,
          userId: true,
          datetime: true,
          user: {
            select: {
              name: true,
              profilePicture: true,
            },
          },
          item: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: { datetime: 'desc' },
      });

      const rewardsFormatted = rewardsRedeemed.map((reward) => ({
        userId: reward.userId,
        userName: reward.user.name,
        profilePicture: reward.user.profilePicture,
        rewardName: reward.item.name,
        image: reward.item.image,
        price: reward.price,
        dateTime: reward.datetime,
      }));

      if (rewardsFormatted.length == 0) {
        return null;
      } else {
        return rewardsFormatted;
      }
    } catch (error) {
      throw new Exception(`Error: ${error}`, HttpStatus.NOT_FOUND);
    }
  }
}
