import {
  Controller,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Res,
  Get,
  Req,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  addPagination,
  PaginationType,
  RequestPaginationDto,
} from '../../app/utils/pagination';
import { SearchQueryDto } from '../../app/utils/search-query';
import { reply } from '../../app/utils/reply';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../users/middleware';
import { ContributorsService } from '../contributors/contributors.service';
import { Organization } from '../../models/Organization';
import { ContributorType } from '../contributors/contributors.type';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly contributorsService: ContributorsService,
  ) {}

  @Get(`/contributes`)
  @UseGuards(JwtAuthGuard)
  async findAllContributorsBy(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    /** get contributor filter by organization */
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const Organizations = await this.contributorsService.findAll({
      option2: { userId: user?.id, type: ContributorType.ORGANIZATION },
      search,
      pagination,
    });

    return reply({ res, results: Organizations });
  }

  @Get(`/:organizationId`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUIDOrganization(
    @Res() res,
    @Req() req,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
  ) {
    const { user } = req;
    const getOneContributor = await this.contributorsService.findOneBy({
      option1: {
        userId: user?.id,
        organizationId: organizationId,
        type: ContributorType.ORGANIZATION,
      },
    });
    if (!getOneContributor)
      throw new HttpException(
        `Not authorized in this organization ${organizationId} please change`,
        HttpStatus.NOT_FOUND,
      );

    const organization = await this.organizationsService.findOneBy({
      option1: { organizationId },
    });

    return reply({ res, results: organization });
  }
}
