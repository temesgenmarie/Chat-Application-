import {Request,Response } from 'express'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import prisma from '../config/db'