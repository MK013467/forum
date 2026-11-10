import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('MailService', () => {
  let service: MailService;

  const mockPrismaService = {
    verificationCode: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
