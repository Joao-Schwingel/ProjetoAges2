import { ApiProperty } from '@nestjs/swagger';
import { Item } from '@prisma/client';
import { AWSFile } from '../../../../aws/upload';

export class RewardDTO implements Pick<Item, 'name' | 'description' | 'price'> {
  @ApiProperty({ example: 'BONÉ' })
  name: string;

  @ApiProperty({ example: 'BONÉ DA EMPRESA' })
  description: string;

  @ApiProperty({
    example: {
      data: '/9j/anyBase64String',
      name: 'bone.png',
      type: 'image/png',
    },
  })
  file?: AWSFile;

  @ApiProperty({ example: 10 })
  price: number;
}

export class RewardRedeemedDTO {
  @ApiProperty({ example: 13 })
  userId: number;

  @ApiProperty({ example: 'Luciane fortes' })
  userName: string;

  @ApiProperty({ example: '' })
  profilePicture: string;

  @ApiProperty({ example: 'Boné' })
  rewardName: string;

  @ApiProperty({ example: '' })
  image: string;

  @ApiProperty({ example: 10 })
  price: number;

  @ApiProperty({ example: 10 })
  dateTime: Date;
}
