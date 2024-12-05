import { getError } from "../errors/error.mjs";
import MongoConnection from "../mongo/MongoConnection.mjs"
import bcrypt from 'bcrypt';
export default class AccountsService {
    #accounts
    #connection
    constructor(connection_str, db_name) {
        this.#connection = new MongoConnection(connection_str, db_name);
        this.#accounts = this.#connection.getCollection('accounts');
    }
    async insertAccount(account) {
        const accountDB = await this.#accounts.findOne({ _id: account.username });
        if (accountDB) {
            throw getError(400, `account for ${account.username} already exists`);
        }
        const toInsertAccount = this.#toAccountDB(account);
        const result = await this.#accounts.insertOne(toInsertAccount);
        if (result.insertedId == account.username) {
            return toInsertAccount;
        }

    }
    async updatePassword(account) {
        const accountDB = await this.#accounts.findOne({ _id: account.username });
        if (!accountDB) {
            throw getError(404, `account for ${account.username} doesn't  exist`);
        }
        const hashPassword = bcrypt.hashSync(account.password, 10);
        console.log(hashPassword);
        const result = await this.#accounts.findOneAndUpdate(
            { _id: account.username },
            { $set: { hashPassword } },
            { returnDocument: "after" });
        console.log(result);
        console.log(hashPassword);
        if (result.hashPassword == hashPassword) {
            console.log(hashPassword);
            return result;
        }
    }
    async deleteAccount(id) {
        const toDeleteAccount = await this.getAccount(id);
        await this.#accounts.deleteOne({ "_id": toDeleteAccount._id });
        return toDeleteAccount;
    }

    async getAccount(username) {
        const account = await this.#accounts.findOne({ "_id": username });
        if (!account) {
            throw getError(404, "Account not found");
        }
        return account;
    }

    #toAccountDB(account) {
        const accountDB = {};
        accountDB._id = account.username;
        accountDB.email = account.email;
        accountDB.hashPassword = bcrypt.hashSync(account.password, 10);
        return accountDB;
    }
}