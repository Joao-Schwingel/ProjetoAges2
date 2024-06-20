import { RequestWithUser } from 'src/api/auth/dto/RequestDTO.model';
import { mockAdminUser, mockBasicUser, mockInvalidUser } from './user.mock';

export const mockRequest = (id: number) =>
  ({ user: { userId: id } } as RequestWithUser);

export const mockInvalidReq = mockRequest(mockInvalidUser.userId);
export const mockAdminReq = mockRequest(mockAdminUser.userId);
export const mockBasicReq = mockRequest(mockBasicUser.userId);
