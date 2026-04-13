import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('PostService', () => {
  let postService: PostService;
  const mockPrismaService = {

    post:{
      findMany:jest.fn(),
      findUnique:jest.fn(),
      create:jest.fn(),
      update:jest.fn(),
      count:jest.fn(),
      delete:jest.fn()
    },
    
    comment: {
      deleteMany: jest.fn(),
    },

    post_Like: {
      deleteMany: jest.fn(),
    },

    $transaction: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {provide:PrismaService, useValue:mockPrismaService}
      ]
    }).compile();

    postService = module.get<PostService>(PostService);
  });

  afterEach(() => jest.clearAllMocks());

  // Did not test the simple Prisma logic since Prisma is already established library

  describe("delete Post" , () => {

    //update suc
    it("delete success" , async() => {
      mockPrismaService.post.findUnique.mockResolvedValue(
        {
          id:1, 
          title:"title", 
          content:"content",
          authorId:1,
        });
      mockPrismaService.$transaction.mockResolvedValue([]);

      const result = await postService.deletePost(1, 1);
      expect(result).toEqual({ msg: 'success' });

    })

    it("delete post throwing error for non existing postId", async()=> {
        mockPrismaService.post.findUnique.mockResolvedValue(null);
        await expect(
          postService.deletePost(1,  2)
        ).rejects.toThrow();

    })


  })


});
