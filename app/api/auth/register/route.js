import { connectionDB } from "@/lib/mongoose";
import { User } from "@/Models/User";
import bcrypt from 'bcryptjs'
import { NextResponse } from "next/server";

export async function POST(request) {
    await connectionDB();

    const {username,email,password,role} = await request.json();

    const hashedPassword = await bcrypt.hash(password,10);

    const userdata = {
        username,
        email,
        password:hashedPassword,
        role
    };

    const register = await User.create(userdata);

    return NextResponse.json({success : true,register});
}