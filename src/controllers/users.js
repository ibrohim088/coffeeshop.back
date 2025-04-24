import User from "../schema/User.js"
import { hasRole } from "../auth/"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConfig from '../utils/config/config.js';

export async function getAllUsers(req, res) {
    try {
        hasRole(req, res, ['admin'])
        let { limit = 100, skip = 0, q, by = 'created_at', order = 'asc' } = req.query || {}
        let filter = {}

        if (q) {
            filter = { username: { $regex: new RegExp(q, 'i') } }
        }

        limit = +limit
        skip = +skip

        const total = await User.countDocuments(filter);
        const data = await User.find(filter).sort({ [by]: order }).limit(limit).skip(limit * skip)

        res.json({ total, data, limit, skip });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error: ' + error.message);
    }
}



export async function getOneUser(req, res) {
    try {
        const { userId } = req.params || {};

        const user = await User.findById(userId);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
}


export async function register(req, res) {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 12);
        const user = new User(req.body);
        const userExist = await User.findOne({ username: req.body?.username });
        if (userExist) {
            return res.status(400).send({ msg: 'Username already exists' });
        }
        await user.save();
        const token = jwt.sign({ id: user.id, role: user.role }, dbConfig.jwt.secret, {
            expiresIn: dbConfig.jwt.expiresIn,
        });
        res.status(201).json({ data: user, token });
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
}


export async function login(req, res) {
    try {
        console.log(req.body);
        const { username, password } = req.body || {};
        const user = await User.findOne({ username: username });
        console.log(user);

        if (!user) {
            return res.status(401).send({ msg: 'Invalid username or password' });
        }
        const decode = await bcrypt.compare(password, user.password);
        console.log(decode);

        if (!user || !decode) {

            return res.status(401).send({ msg: 'Invalid username or password' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, dbConfig.jwt.secret, {

            expiresIn: dbConfig.jwt.expiresIn,
        });

        res.json({ data: user, token });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error: ' + error.message);
    }
}


export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const updated = await User.findByIdAndUpdate(id, { ...req.body });
        res.status(201).json('Updated');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error: ' + error.message);
    }
}



export async function deleteUser(req, res) {
    try {
        const { id } = req.params || {};
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).send('User not found');
        }
        res.status(201).json('Deleted  successfully');
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
}