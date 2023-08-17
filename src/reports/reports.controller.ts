import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serializeInterceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) { }

    @Get()
    getEstimate(@Query() query: GetEstimateDto) {
        console.log('query', query);
        return this.reportsService.createEstimate(query)

    }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportsService.create(body, user)
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Body() body: ApproveReportDto, @Param('id') id: string) {

        // console.log('id', id);
        // console.log('body', body.approved);

        return this.reportsService.changeApproval(id, body.approved)
    }
}
