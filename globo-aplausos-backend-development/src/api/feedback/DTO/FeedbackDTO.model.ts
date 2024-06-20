import { ApiProperty } from '@nestjs/swagger';
import { Feedback } from '@prisma/client';

export class FeedbackDTO
  implements Pick<Feedback, 'message' | 'receiverId' | 'value'>
{
  @ApiProperty({
    example: 'OLÁ ESSA É UMA MENSAGEM! PARABÉNS PELO BOM TRABALHO',
  })
  message: string;

  @ApiProperty({ example: 8 })
  receiverId: number;

  @ApiProperty({ example: 10 })
  value: number;
}
export class AllFeedbacksDTO {
  @ApiProperty({ example: '' })
  senderProfilePicture: string;

  @ApiProperty({ example: '' })
  receiverProfilePicture: string;

  @ApiProperty({ example: '' })
  senderName: string;

  @ApiProperty({ example: '' })
  receiverName: string;

  @ApiProperty({ example: 'Olá, tudo bem?' })
  message: string;

  @ApiProperty({ example: 10 })
  value: number;
}
