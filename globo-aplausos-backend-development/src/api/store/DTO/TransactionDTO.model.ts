import { ApiProperty } from '@nestjs/swagger';

export class TransactionDTO {
  @ApiProperty({ example: 1 })
  itemId: number;

  @ApiProperty({ example: 2 })
  userId: number;

  @ApiProperty({ example: 1 })
  transactionId: number;

  @ApiProperty({ example: 50.0 })
  price: number;

  @ApiProperty({ example: '2023-10-14T12:34:56Z' })
  datetime: Date;

  @ApiProperty({
    example: {
      image: 'image_url',
      description: 'Reward description',
      name: 'Reward Name',
    },
  })
  item: {
    image: string;
    description: string;
    name: string;
  };
}
