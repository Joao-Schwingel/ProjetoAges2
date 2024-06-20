import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDTO {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJRdWVfZmFsdGFfZG9fcXVlX2ZhemVyXy4uLkhlaGVoIjoiVGVuaGEgdW0gYm9tIGRpYSEgQXR0OiBGZWxpcGUiLCJpYXQiOjE1MTYyMzkwMjJ9.yXcxghA-RoByZlOQodFK_nmC7AiNAetvFhuUCSOORys',
  })
  access_token: string;
}
