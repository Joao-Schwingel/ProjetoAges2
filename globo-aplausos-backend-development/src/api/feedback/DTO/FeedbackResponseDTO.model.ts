import { ApiProperty } from '@nestjs/swagger';

export class FeedbackResponseDTO {
  @ApiProperty({ example: '' })
  profilePicture: string;

  @ApiProperty({ example: 'João' })
  name: string;

  @ApiProperty({ example: 'Olá, tudo bem?' })
  message: string;

  @ApiProperty({ example: 10 })
  value: number;
}

export class FeedbacksSentByMeResponseDTO {
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
