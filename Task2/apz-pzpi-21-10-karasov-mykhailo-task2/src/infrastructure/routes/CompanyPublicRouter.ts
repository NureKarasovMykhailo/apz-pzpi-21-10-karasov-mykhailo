import express from "express";
import checkRoleMiddleware from "../../core/common/middlewares/CheckRoleMiddleware";
import RolesEnum from "../../core/common/enums/RolesEnum";
import CheckSubscribeMiddleware from "../../core/common/middlewares/CheckSubscribeMiddleware";
import SubscriptionRepositoryImpl from "../repositoriesImpl/sequelizeRepository/SubscriptionRepositoryImpl";
import createOrUpdateCompanyValidator from "../../core/common/validators/CreateOrUpdateCompanyValidator";
import PublicCompanyController from "../controllers/PublicCompanyController";
import CompanyService from "../../core/services/CompanyService/CompanyService";
import CompanyRepositoryImpl from "../repositoriesImpl/sequelizeRepository/CompanyRepositoryImpl";
import UserRepositoryImpl from "../repositoriesImpl/sequelizeRepository/UserRepositoryImpl";
import CompanyMapper from "../mappers/CompanyMapper/CompanyMapper";
import authMiddleware from "../../core/common/middlewares/AuthMiddleware";
import hasUserCompanyMiddleware from "../../core/common/middlewares/HasUserCompanyMiddleware";
import UserMapper from "../mappers/UserMapper/UserMapper";

const router = express.Router();

const subscriptionRepository = new SubscriptionRepositoryImpl();
const checkUserSubscription: CheckSubscribeMiddleware = new CheckSubscribeMiddleware(subscriptionRepository);

const companyService = new CompanyService(new CompanyRepositoryImpl(), new UserRepositoryImpl());
const publicCompanyController =
    new PublicCompanyController(companyService, new CompanyMapper(), new UserMapper);

router.post(
    '/',
    checkRoleMiddleware([RolesEnum.SUBSCRIBER]),
    checkUserSubscription.checkSubscribe.bind(checkUserSubscription),
    createOrUpdateCompanyValidator(),
    publicCompanyController.createCompany.bind(publicCompanyController)
);

router.get(
    '/',
    authMiddleware,
    publicCompanyController.getCompany.bind(publicCompanyController)
);

router.patch(
    '/',
    checkRoleMiddleware([RolesEnum.SUBSCRIBER]),
    createOrUpdateCompanyValidator(),
    publicCompanyController.updateCompany.bind(publicCompanyController)
);

router.delete(
    '/',
    checkRoleMiddleware([RolesEnum.SUBSCRIBER]),
    publicCompanyController.deleteCompany.bind(publicCompanyController)
);

router.post(
    '/add-employee/:id',
    checkRoleMiddleware([RolesEnum.SUBSCRIBER, RolesEnum.COMPANY_ADMIN, RolesEnum.ADMIN]),
    hasUserCompanyMiddleware,
    publicCompanyController.addEmployee.bind(publicCompanyController)
);

router.delete(
    '/delete-employee/:id',
    checkRoleMiddleware([RolesEnum.SUBSCRIBER, RolesEnum.COMPANY_ADMIN, RolesEnum.ADMIN]),
    hasUserCompanyMiddleware,
    publicCompanyController.deleteEmployee.bind(publicCompanyController)
);


export default router;