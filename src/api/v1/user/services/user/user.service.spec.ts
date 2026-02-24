import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../../../../services/database/prisma/prisma.service';
import { CryptoService } from '../../../../../services/auth/crypto/crypto.service';
import { BaseValidatorService } from '../../../../../services/validators/base-validator/base-validator.service';
import { MailgunService } from '../../../../../services/email/mailgun/mailgun.service';
import { UserRegisterDto, UserFinishRegisterDto } from '../../dtos/user.dto';
import { User } from '@prisma/client';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;
  let mailgunService: MailgunService;
  let cryptoService: CryptoService;
  let baseValidatorService: BaseValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: CryptoService,
          useValue: {
            encryptString: jest.fn().mockResolvedValue('hashedPassword'),
            createRandomHash: jest.fn().mockReturnValue('randomHash'),
          },
        },
        {
          provide: BaseValidatorService,
          useValue: {
            isValidPassword: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: MailgunService,
          useValue: {
            setTemplate: jest.fn(),
            setVariables: jest.fn(),
            setTo: jest.fn(),
            send: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    mailgunService = module.get<MailgunService>(MailgunService);
    cryptoService = module.get<CryptoService>(CryptoService);
    baseValidatorService = module.get<BaseValidatorService>(BaseValidatorService);
  });

  describe('startUserRegister', () => {
    it('should throw error if username (derived from email) is taken', async () => {
      const dto: UserRegisterDto = { email: 'test@example.com', password: 'password123' };

      const error: any = new Error('Unique constraint failed');
      error.code = 'P2002';
      error.meta = { target: ['username'] };

      (prismaService.user.create as jest.Mock).mockRejectedValue(error);

      await expect(service.startUserRegister(dto, 'token')).rejects.toThrow();
      expect(prismaService.user.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('registerUser', () => {
    const mockUser: User = {
      userId: 1,
      userUUID: 'uuid',
      username: 'test',
      email: 'test@example.com',
      password: 'hashed',
      firstName: '',
      lastName: '',
      birthDay: new Date(),
      avatar: null,
      bio: null,
      gender: 'M',
      pronouns: '',
      region: 'USA',
      isUserValidated: false,
      tokenRegistration: 'token',
      registrationExpiresAt: new Date(Date.now() + 100000),
      isWriter: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should succeed even if userDto contains interests (destructured)', async () => {
      const dto: UserFinishRegisterDto = {
        firstName: 'Test',
        lastName: 'User',
        username: 'test',
        isWriter: false,
        birthDay: new Date(),
        gender: 'M',
        region: 'USA',
        interests: ['coding'],
      };

      const dtoDifferentUsername = { ...dto, username: 'newname' };

      (prismaService.user.findFirst as jest.Mock)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);

      (prismaService.user.update as jest.Mock).mockImplementation((args) => {
        if (args.data.interests) {
          throw new Error('Unknown argument `interests`');
        }
        return Promise.resolve({ ...mockUser, ...args.data });
      });

      await expect(service.registerUser('token', dtoDifferentUsername)).resolves.toBeDefined();
    });

    it('should succeed if username collides with itself (self-collision fixed)', async () => {
      const dto: UserFinishRegisterDto = {
        firstName: 'Test',
        lastName: 'User',
        username: 'test', // same as mockUser.username
        isWriter: false,
        birthDay: new Date(),
        gender: 'M',
        region: 'USA',
        interests: [],
      };

      (prismaService.user.findFirst as jest.Mock)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockUser);

      (prismaService.user.update as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.registerUser('token', dto)).resolves.toBeDefined();
    });

    it('should set isUserValidated to true', async () => {
      const dto: UserFinishRegisterDto = {
        firstName: 'Test',
        lastName: 'User',
        username: 'newname',
        isWriter: false,
        birthDay: new Date(),
        gender: 'M',
        region: 'USA',
        interests: [],
      };

      (prismaService.user.findFirst as jest.Mock)
        .mockResolvedValueOnce(mockUser) // found by token
        .mockResolvedValueOnce(null); // username available

      (prismaService.user.update as jest.Mock).mockResolvedValue({ ...mockUser, ...dto });

      await service.registerUser('token', dto);

      const updateCall = (prismaService.user.update as jest.Mock).mock.calls[0][0];
      expect(updateCall.data.isUserValidated).toBe(true);
    });
  });
});
