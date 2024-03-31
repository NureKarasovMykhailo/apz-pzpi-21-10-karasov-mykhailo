import ICompanyRepository from "../../../core/repositories/CompanyRepository/ICompanyRepository";
import CreateOrUpdateCompanyDto from "../../../core/repositories/CompanyRepository/dto/CreateOrUpdateCompanyDto";
import CompanyDomainModel from "../../../core/domain/models/Company/Company";
import Company from "../../database/etities/Company";
import CompanyMapper from "../../mappers/CompanyMapper/CompanyMapper";

export default class CompanyRepositoryImpl implements ICompanyRepository {
    private readonly companyMapper: CompanyMapper = new CompanyMapper();
    async createCompany(dto: CreateOrUpdateCompanyDto, creatingUserId: number, companyImage: string): Promise<CompanyDomainModel> {
        const company = await Company.create({
            companyName: dto.companyName,
            description: dto.description,
            companyImage: companyImage,
            userId: creatingUserId
        });
        return this.companyMapper.toDomainModel(company);
    }

    async getCompanyByName(companyName: string): Promise<CompanyDomainModel | null> {
        const company = await Company.findOne({ where: { companyName } });
        if (!company) {
            return null;
        }
        return this.companyMapper.toDomainModel(company);
    }

    async getCompanyByUserId(userId: number): Promise<CompanyDomainModel | null> {
        const company = await Company.findOne({
            where: { userId }
        });
        if (!company) {
            return null;
        }
        return this.companyMapper.toDomainModel(company);
    }

}