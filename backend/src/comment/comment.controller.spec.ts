import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

describe('CommentController', () => {
  let controller: CommentController;
  const mockCommentService = {

  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers:[
        {provide:CommentService, useValue:mockCommentService}
      ]
    }).compile();
  
    controller = module.get<CommentController>(CommentController);


  });
  afterEach(() => jest.clearAllMocks());
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
