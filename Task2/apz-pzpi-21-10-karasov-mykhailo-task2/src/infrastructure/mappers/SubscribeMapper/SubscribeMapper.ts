import IMapper from "../IMapper";
import SubscribeModel from "../../../core/domain/models/Subscribe/SubscribeModel";
import Subscription from "../../database/etities/Subscription";
import UserMapper from "../UserMapper/UserMapper";

export default class SubscribeMapper implements IMapper<Subscription, SubscribeModel> {
    private readonly userMapper: UserMapper = new UserMapper();

    toDomainModel(data: Subscription): SubscribeModel {

        return new SubscribeModel(
            data.id,
            data.code,
            data.validUntil,
            data.isValid,
            data.userId
        );
    }

    toPersistenceModel(data: SubscribeModel): Subscription {
        const subscription = new Subscription();
        subscription.id = data.id;
        subscription.code = data.code;
        subscription.validUntil = data.validUntil;
        subscription.isValid = data.isValid;
        subscription.userId = data.userId

        return subscription;
    }

}