import {
  ArgumentsHost,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { ApiErrorResponse } from './api-response';

describe('HttpExceptionFilter', () => {
  const filter = new HttpExceptionFilter();
  const json = jest.fn<void, [ApiErrorResponse]>();
  const status = jest.fn().mockReturnValue({ json });
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
      getRequest: () => ({ path: '/comment/1' }),
    }),
  } as unknown as ArgumentsHost;

  beforeEach(() => jest.clearAllMocks());

  it('sends the status and message of an HttpException', () => {
    filter.catch(new NotFoundException('Comment not found'), host);

    expect(status).toHaveBeenCalledWith(404);
    const body = json.mock.calls[0][0];
    expect(body).toMatchObject({
      success: false,
      statusCode: 404,
      message: 'Comment not found',
      path: '/comment/1',
    });
    expect(typeof body.timestamp).toBe('string');
  });

  it('keeps the message array of a validation error', () => {
    filter.catch(
      new BadRequestException(['content should not be empty']),
      host,
    );

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: ['content should not be empty'],
      }),
    );
  });

  it('uses a string response body as the message', () => {
    filter.catch(new ForbiddenException(), host);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 403, message: 'Forbidden' }),
    );
  });

  it('hides the details of an unknown error behind a 500', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    filter.catch(new Error('db password leaked'), host);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Internal server error',
      }),
    );
    spy.mockRestore();
  });
});
