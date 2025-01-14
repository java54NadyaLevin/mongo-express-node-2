import express from 'express';
export const accounts_route = express.Router();
import asyncHandler from 'express-async-handler';
import AccountsService from '../service/AccountsService.mjs';
const accountsService = new AccountsService(process.env.MONGO_URI, process.env.DB_NAME);
accounts_route.post("/account", asyncHandler(async (req, res) => {
    const result = await accountsService.insertAccount(req.body);
    res.status(201).json(result);
}));
accounts_route.put("/account", asyncHandler(async (req, res) => {
    const result = await accountsService.updatePassword(req.body);
    res.status(200).json(result);
}));
accounts_route.get("/account/:id", asyncHandler(async (req, res) => {
    const result = await accountsService.getAccount(req.params.id);
    res.status(200).json(result);
}));
accounts_route.delete("/account/:id", asyncHandler(async (req, res) => {
    const result = await accountsService.deleteAccount(req.params.id);
    res.status(200).json(result);
}))